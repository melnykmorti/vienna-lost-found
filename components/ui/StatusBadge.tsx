import { StyleSheet, Text, View } from "react-native";

import { theme } from "@/constants/theme";
import type { LostReportStatus } from "@/types/models";

const LABELS: Record<LostReportStatus, string> = {
  searching: "searching",
  matched: "matched",
  at_depot: "at depot",
  claimed: "claimed",
  returned: "returned",
};

export function StatusBadge({ status }: { status: LostReportStatus }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{LABELS[status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: theme.cream,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.indigo,
    textTransform: "lowercase",
  },
});
