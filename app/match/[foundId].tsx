import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Screen } from "@/components/ui/Screen";
import { ScoreBar } from "@/components/ui/ScoreBar";
import { theme } from "@/constants/theme";
import { lostFoundService } from "@/services/lostFoundService";
import type { FoundItem, MatchResult } from "@/types/models";

export default function MatchDetailScreen() {
  const { foundId, reportId } = useLocalSearchParams<{
    foundId: string;
    reportId: string;
  }>();
  const router = useRouter();
  const [item, setItem] = useState<FoundItem | null>(null);
  const [match, setMatch] = useState<MatchResult | null>(null);

  const load = useCallback(async () => {
    if (!foundId || !reportId) return;
    const f = await lostFoundService.getFoundItem(foundId);
    setItem(f ?? null);
    if (reportId === "browse") {
      setMatch({
        foundId,
        score: 0,
        reasons: [
          {
            label: "Browsing catalog (no active lost report)",
            points: 0,
          },
        ],
      });
      return;
    }
    const m = await lostFoundService.getMatchForReport(reportId, foundId);
    setMatch(m ?? null);
  }, [foundId, reportId]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  if (!item || !match) {
    return (
      <Screen title="Match detail">
        <Text style={styles.muted}>Loading…</Text>
      </Screen>
    );
  }

  return (
    <Screen
      title={match && match.score > 0 ? `Match · ${match.score}%` : item.title}
      footer={
        <View style={styles.footer}>
          <PrimaryButton
            label="This could be mine"
            onPress={() => {
              if (reportId === "browse") {
                router.push("/report/lost");
                return;
              }
              router.push({
                pathname: "/claim/verify",
                params: { reportId, foundId },
              });
            }}
          />
          <PrimaryButton
            label="Not my item"
            variant="ghost"
            onPress={() => router.back()}
          />
        </View>
      }
    >
      <View style={styles.imageBox}>
        {item.photoUri ? (
          <Image source={{ uri: item.photoUri }} style={styles.image} />
        ) : (
          <Text style={styles.placeholder}>Found item</Text>
        )}
      </View>

      <Text style={styles.itemTitle}>{item.title}</Text>
      <Text style={styles.meta}>
        {item.locationLabel} · {new Date(item.foundAt).toLocaleString()}
      </Text>
      {match && match.score > 0 ? <ScoreBar score={match.score} /> : null}

      <Text style={styles.section}>Why this match?</Text>
      {(match?.reasons ?? []).map((r) => (
        <View key={r.label} style={styles.reason}>
          <Text style={styles.reasonLabel}>{r.label}</Text>
          <Text style={styles.reasonPts}>+{r.points}</Text>
        </View>
      ))}

      <Text style={styles.desc}>{item.description}</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  imageBox: {
    height: 160,
    backgroundColor: theme.white,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.border,
  },
  image: { width: "100%", height: "100%", borderRadius: 12 },
  placeholder: { color: theme.muted },
  itemTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: theme.ink,
    marginBottom: 4,
  },
  meta: { color: theme.muted, marginBottom: 16 },
  section: {
    fontSize: 17,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
    fontFamily: "serif",
  },
  reason: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  reasonLabel: { color: theme.ink, flex: 1 },
  reasonPts: { color: theme.indigo, fontWeight: "600" },
  desc: { marginTop: 16, color: theme.muted, lineHeight: 22 },
  footer: { gap: 8 },
  muted: { color: theme.muted },
});
