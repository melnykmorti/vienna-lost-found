import { StyleSheet, Text, View } from "react-native";

import { theme } from "@/constants/theme";
import {
  getScoreColor,
  getScoreLabel,
  getScoreTier,
} from "@/services/scoreDisplay";

export function ScoreBar({
  score,
  compact,
  showLabel,
}: {
  score: number;
  compact?: boolean;
  showLabel?: boolean;
}) {
  const tier = getScoreTier(score);
  const color = getScoreColor(tier);

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <View style={[styles.track, compact && styles.trackCompact]}>
          <View
            style={[
              styles.fill,
              { width: `${score}%`, backgroundColor: color },
            ]}
          />
        </View>
        <Text style={[styles.label, compact && styles.labelCompact, { color }]}>
          {score}%
        </Text>
      </View>
      {showLabel ? (
        <Text style={styles.tierLabel}>{getScoreLabel(tier)}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  track: {
    flex: 1,
    height: 8,
    backgroundColor: theme.border,
    borderRadius: 4,
    overflow: "hidden",
  },
  trackCompact: { height: 6 },
  fill: { height: "100%", borderRadius: 4 },
  label: { width: 40, fontWeight: "700", fontSize: 14 },
  labelCompact: { fontSize: 12, width: 36 },
  tierLabel: { fontSize: 12, color: theme.muted, lineHeight: 18 },
});
