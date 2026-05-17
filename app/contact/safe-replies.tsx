import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Screen } from "@/components/ui/Screen";
import { theme } from "@/constants/theme";
import { lostFoundService } from "@/services/lostFoundService";
import { useAppStore } from "@/store/appStore";

const REPLIES = [
  "I think this may be my item.",
  "Can you confirm one detail?",
  "Where can I collect it?",
  "Not my item — thanks.",
];

export default function SafeRepliesScreen() {
  const { claimId } = useLocalSearchParams<{ claimId: string }>();
  const router = useRouter();
  const refresh = useAppStore((s) => s.refresh);
  const [selected, setSelected] = useState<string | null>(null);

  const confirm = async () => {
    if (!claimId || !selected) return;
    await lostFoundService.setSafeReply(claimId, selected);
    await refresh();
    router.replace({ pathname: "/claim/pickup", params: { claimId } });
  };

  return (
    <Screen
      title="Finder — M.K."
      subtitle="Use a safe preset reply. Free-text chat unlocks after ownership is verified."
      footer={
        <PrimaryButton
          label="Continue"
          onPress={() => void confirm()}
          disabled={!selected}
        />
      }
    >
      <Card>
        <Text style={styles.finderMsg}>
          Hi — I found this on the U4 platform near Karlsplatz. Happy to help
          return it via the depot.
        </Text>
      </Card>

      <Text style={styles.label}>Your reply</Text>
      {REPLIES.map((r) => (
        <View key={r} style={styles.replyRow}>
          <Chip
            label={r}
            selected={selected === r}
            onPress={() => setSelected(r)}
          />
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  finderMsg: { color: theme.ink, lineHeight: 22 },
  label: { fontWeight: "600", marginVertical: 16, color: theme.ink },
  replyRow: { marginBottom: 4 },
});
