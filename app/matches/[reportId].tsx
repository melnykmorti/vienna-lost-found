import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { MatchCard } from "@/components/match/MatchCard";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Screen } from "@/components/ui/Screen";
import { theme } from "@/constants/theme";
import { lostFoundService } from "@/services/lostFoundService";
import type { LostReport, MatchResult } from "@/types/models";

export default function MatchesScreen() {
  const { reportId } = useLocalSearchParams<{ reportId: string }>();
  const router = useRouter();
  const [report, setReport] = useState<LostReport | null>(null);
  const [top, setTop] = useState<MatchResult[]>([]);
  const [weakerCount, setWeakerCount] = useState(0);
  const [showWeak, setShowWeak] = useState(false);
  const [weak, setWeak] = useState<MatchResult[]>([]);

  const load = useCallback(async () => {
    if (!reportId) return;
    const data = await lostFoundService.getMatches(reportId, false);
    if (!data) return;
    setReport(data.report);
    setTop(data.top);
    setWeakerCount(data.weakerCount);
    const all = await lostFoundService.getMatches(reportId, true);
    if (all) setWeak(all.top.slice(3));
  }, [reportId]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  if (!report) {
    return (
      <Screen title="Matches">
        <Text style={styles.muted}>Loading…</Text>
      </Screen>
    );
  }

  const list = showWeak ? [...top, ...weak] : top;

  return (
    <Screen
      title={`${list.length} likely matches`}
      subtitle={`${report.title} · ${report.locationLabel}`}
    >
      <Text style={styles.demo}>
        (i) Demo matching — rule-based scoring, not machine learning.
      </Text>

      {list.length === 0 ? (
        <Text style={styles.muted}>
          No matches yet. Check again after more found reports.
        </Text>
      ) : (
        list.map((m) => (
          <MatchCard key={m.foundId} match={m} reportId={report.id} />
        ))
      )}

      {weakerCount > 0 && !showWeak ? (
        <PrimaryButton
          label={`Show weaker matches (${weakerCount})`}
          variant="secondary"
          onPress={() => setShowWeak(true)}
        />
      ) : null}

      <View style={styles.gap} />
      <PrimaryButton
        label="Find Matches →"
        onPress={() => void load()}
        variant="ghost"
      />
      <PrimaryButton
        label="Back to Home"
        variant="ghost"
        onPress={() => router.push("/(tabs)")}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  demo: {
    fontSize: 12,
    color: theme.muted,
    marginBottom: 16,
    fontStyle: "italic",
  },
  muted: { color: theme.muted },
  gap: { height: 12 },
});
