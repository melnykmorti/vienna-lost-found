import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { ReportCard } from "@/components/reports/ReportCard";
import { Card } from "@/components/ui/Card";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Screen } from "@/components/ui/Screen";
import { theme } from "@/constants/theme";
import { useAppData } from "@/hooks/useAppData";
import { rankMatches } from "@/services/matching";

export default function HomeScreen() {
  const router = useRouter();
  const { reports, foundItems } = useAppData();

  const openReports = reports.filter((r) => r.status !== "returned");
  const hasStrongMatch = openReports.some((r) => {
    const { top } = rankMatches(r, foundItems);
    return top[0]?.score >= 70;
  });

  return (
    <Screen
      title="Vienna Lost & Found"
      subtitle="Lost something in Vienna? We help you report, match, and recover items."
    >
      {hasStrongMatch ? (
        <Card
          accent
          onPress={() =>
            openReports[0] && router.push(`/matches/${openReports[0].id}`)
          }
        >
          <Text style={styles.notifyTitle}>We found a possible match</Text>
          <Text style={styles.notifyBody}>
            Tap to review likely matches for your open report.
          </Text>
        </Card>
      ) : null}

      <View style={styles.actions}>
        <PrimaryButton
          label="Report Lost"
          onPress={() => router.push("/report/lost")}
          style={styles.half}
        />
        <PrimaryButton
          label="Report Found"
          variant="secondary"
          onPress={() => router.push("/report/found")}
          style={styles.half}
        />
      </View>

      <Text style={styles.section}>Your open reports</Text>
      {openReports.length === 0 ? (
        <Text style={styles.empty}>
          No open reports. Start with Report Lost or Found.
        </Text>
      ) : (
        openReports.map((r) => <ReportCard key={r.id} report={r} />)
      )}

      <View style={styles.quick}>
        <PrimaryButton
          label="Search catalog"
          variant="ghost"
          onPress={() => router.push("/(tabs)/search")}
        />
        <PrimaryButton
          label="Map of pins"
          variant="ghost"
          onPress={() => router.push("/(tabs)/map")}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  notifyTitle: {
    color: theme.white,
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 6,
  },
  notifyBody: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    lineHeight: 20,
  },
  actions: { flexDirection: "row", gap: 10, marginBottom: 24 },
  half: { flex: 1 },
  section: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.ink,
    marginBottom: 12,
    fontFamily: "serif",
  },
  empty: { color: theme.muted, marginBottom: 16 },
  quick: { marginTop: 8, gap: 4 },
});
