import { StyleSheet, Text, View } from "react-native";

import { theme } from "@/constants/theme";
import type { ClaimStep } from "@/types/models";

export function ProgressSteps({ steps }: { steps: ClaimStep[] }) {
  return (
    <View style={styles.wrap}>
      {steps.map((step, i) => (
        <View key={step.id} style={styles.row}>
          <View style={styles.lineCol}>
            <View
              style={[
                styles.dot,
                step.status === "done" && styles.dotDone,
                step.status === "current" && styles.dotCurrent,
              ]}
            />
            {i < steps.length - 1 ? <View style={styles.line} /> : null}
          </View>
          <View style={styles.textCol}>
            <Text
              style={[
                styles.label,
                step.status === "current" && styles.labelCurrent,
              ]}
            >
              {step.label}
            </Text>
            {step.timestamp ? (
              <Text style={styles.time}>
                {new Date(step.timestamp).toLocaleString()}
              </Text>
            ) : null}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginVertical: 16 },
  row: { flexDirection: "row", minHeight: 48 },
  lineCol: { width: 24, alignItems: "center" },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.border,
    marginTop: 4,
  },
  dotDone: { backgroundColor: theme.success },
  dotCurrent: { backgroundColor: theme.indigo },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: theme.border,
    marginVertical: 2,
  },
  textCol: { flex: 1, paddingLeft: 8, paddingBottom: 12 },
  label: { fontSize: 15, color: theme.muted },
  labelCurrent: { color: theme.ink, fontWeight: "600" },
  time: { fontSize: 12, color: theme.muted, marginTop: 2 },
});
