import { Alert, StyleSheet, Text } from "react-native";

import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Screen } from "@/components/ui/Screen";
import { theme } from "@/constants/theme";
import { useAppStore } from "@/store/appStore";

export default function ProfileScreen() {
  const resetDemo = useAppStore((s) => s.resetDemo);

  const onReset = () => {
    Alert.alert(
      "Reset demo data",
      "Restore seed data and the demo wallet report?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => void resetDemo(),
        },
      ],
    );
  };

  return (
    <Screen title="Profile" subtitle="Vienna Lost & Found — M3 prototype">
      <Text style={styles.p}>
        All data is stored locally on this device. There is no account login or
        remote server in this build.
      </Text>
      <Text style={styles.p}>
        Demo user position is fixed at Karlsplatz. Matching uses rule-based
        scoring (not machine learning).
      </Text>
      <Text style={styles.p}>Maps © OpenStreetMap contributors.</Text>

      <PrimaryButton
        label="Reset demo data"
        variant="secondary"
        onPress={onReset}
      />

      <Text style={styles.version}>Version 1.0.0 · Team 211</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  p: { color: theme.muted, lineHeight: 22, marginBottom: 14 },
  version: {
    marginTop: 32,
    textAlign: "center",
    color: theme.muted,
    fontSize: 12,
  },
});
