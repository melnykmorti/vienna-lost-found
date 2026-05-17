import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Screen } from "@/components/ui/Screen";
import { theme } from "@/constants/theme";

export default function ReportHubScreen() {
  const router = useRouter();

  return (
    <Screen
      title="Report an item"
      subtitle="Choose whether you lost something or found something someone else may be looking for."
    >
      <View style={styles.box}>
        <Text style={styles.emoji}>📋</Text>
        <PrimaryButton
          label="I lost something"
          onPress={() => router.push("/report/lost")}
        />
        <View style={styles.gap} />
        <PrimaryButton
          label="I found something"
          variant="secondary"
          onPress={() => router.push("/report/found")}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  box: { marginTop: 24 },
  emoji: { fontSize: 48, textAlign: "center", marginBottom: 24 },
  gap: { height: 12 },
});
