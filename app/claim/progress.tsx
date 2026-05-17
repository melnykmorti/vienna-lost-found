import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, Text } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { ProgressSteps } from "@/components/ui/ProgressSteps";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Screen } from "@/components/ui/Screen";
import { theme } from "@/constants/theme";
import { lostFoundService } from "@/services/lostFoundService";
import type { Claim } from "@/types/models";

export default function ClaimProgressScreen() {
  const { claimId } = useLocalSearchParams<{ claimId: string }>();
  const router = useRouter();
  const [claim, setClaim] = useState<Claim | null>(null);

  const load = useCallback(async () => {
    if (!claimId) return;
    const c = await lostFoundService.getClaim(claimId);
    setClaim(c ?? null);
  }, [claimId]);

  useFocusEffect(
    useCallback(() => {
      void load();
      const t = setInterval(() => void load(), 1500);
      return () => clearInterval(t);
    }, [load]),
  );

  if (!claim) {
    return (
      <Screen title="Claim status">
        <Text style={styles.muted}>Loading…</Text>
      </Screen>
    );
  }

  const canContinue =
    claim.status === "verified" ||
    claim.status === "ready_pickup" ||
    claim.status === "completed";

  return (
    <Screen
      title="Claim request started"
      subtitle="Verification in progress…"
      footer={
        canContinue ? (
          <PrimaryButton
            label={
              claim.safeReply
                ? "Continue to pickup"
                : "Continue to safe replies"
            }
            onPress={() => {
              if (claim.safeReply) {
                router.push({
                  pathname: "/claim/pickup",
                  params: { claimId: claim.id },
                });
              } else {
                router.push({
                  pathname: "/contact/safe-replies",
                  params: { claimId: claim.id },
                });
              }
            }}
          />
        ) : (
          <Text style={styles.wait}>Waiting for verification…</Text>
        )
      }
    >
      <ProgressSteps steps={claim.steps} />
      <Text style={styles.note}>
        Wiener Linien Fundbüro will ask 2 questions only the owner would know.
      </Text>
      <PrimaryButton
        label="Save for later"
        variant="ghost"
        onPress={() => router.push("/(tabs)")}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  muted: { color: theme.muted },
  wait: { textAlign: "center", color: theme.muted },
  note: { marginTop: 8, color: theme.muted, lineHeight: 22 },
});
