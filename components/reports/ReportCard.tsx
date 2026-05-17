import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { theme } from "@/constants/theme";
import type { LostReport } from "@/types/models";

export function ReportCard({ report }: { report: LostReport }) {
  const router = useRouter();

  const onPress = () => {
    if (report.status === "searching" || report.status === "matched") {
      router.push(`/matches/${report.id}`);
    } else {
      router.push(`/matches/${report.id}`);
    }
  };

  return (
    <Card onPress={onPress}>
      <View style={styles.row}>
        <View style={styles.flex}>
          <Text style={styles.title}>{report.title}</Text>
          <Text style={styles.meta}>
            {report.locationLabel} · {formatDate(report.lostAt)}
          </Text>
        </View>
        <StatusBadge status={report.status} />
      </View>
    </Card>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  flex: { flex: 1 },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.ink,
    marginBottom: 4,
  },
  meta: { fontSize: 13, color: theme.muted },
});
