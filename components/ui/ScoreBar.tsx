import { StyleSheet, Text, View } from "react-native";

import { theme } from "@/constants/theme";

export function ScoreBar({
  score,
  compact,
}: {
  score: number;
  compact?: boolean;
}) {
  return (
    <View style={styles.row}>
      <View style={[styles.track, compact && styles.trackCompact]}>
        <View style={[styles.fill, { width: `${score}%` }]} />
      </View>
      <Text style={[styles.label, compact && styles.labelCompact]}>
        {score}%
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  track: {
    flex: 1,
    height: 8,
    backgroundColor: theme.border,
    borderRadius: 4,
    overflow: "hidden",
  },
  trackCompact: { height: 6 },
  fill: { height: "100%", backgroundColor: theme.indigo, borderRadius: 4 },
  label: { width: 40, fontWeight: "700", color: theme.indigo, fontSize: 14 },
  labelCompact: { fontSize: 12, width: 36 },
});
