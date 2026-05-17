import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput } from "react-native";

import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Screen } from "@/components/ui/Screen";
import { theme } from "@/constants/theme";
import { lostFoundService } from "@/services/lostFoundService";
import { useAppStore } from "@/store/appStore";

export default function VerifyClaimScreen() {
  const { reportId, foundId } = useLocalSearchParams<{
    reportId: string;
    foundId: string;
  }>();
  const router = useRouter();
  const refresh = useAppStore((s) => s.refresh);
  const [detail, setDetail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!reportId || !foundId) return;
    setLoading(true);
    const claim = await lostFoundService.createClaim(
      reportId,
      foundId,
      detail.trim(),
    );
    await refresh();
    setLoading(false);
    router.replace({
      pathname: "/claim/progress",
      params: { claimId: claim.id },
    });
  };

  return (
    <Screen
      title="Verify ownership"
      subtitle="Describe a unique detail only the real owner would know. It is not shown publicly."
      footer={
        <PrimaryButton
          label={loading ? "Submitting…" : "Start verification →"}
          onPress={() => void submit()}
          disabled={loading || detail.trim().length < 3}
        />
      }
    >
      <Text style={styles.label}>Describe a unique detail</Text>
      <TextInput
        style={styles.input}
        multiline
        value={detail}
        onChangeText={setDetail}
        placeholder="Write a secret detail only the real owner would know — tag color, engraving, receipt, scratch…"
        placeholderTextColor={theme.muted}
      />
      <Text style={styles.hint}>
        Demo: verification auto-completes in ~2 seconds after submit.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: { fontWeight: "600", marginBottom: 8, color: theme.ink },
  input: {
    backgroundColor: theme.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    padding: 14,
    minHeight: 120,
    textAlignVertical: "top",
    color: theme.ink,
  },
  hint: {
    marginTop: 12,
    fontSize: 13,
    color: theme.muted,
    fontStyle: "italic",
  },
});
