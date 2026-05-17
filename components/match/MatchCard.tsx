import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { Card } from "@/components/ui/Card";
import { ScoreBar } from "@/components/ui/ScoreBar";
import { theme } from "@/constants/theme";
import { lostFoundService } from "@/services/lostFoundService";
import type { MatchResult } from "@/types/models";
import { useEffect, useState } from "react";

type Props = {
  match: MatchResult;
  reportId: string;
};

export function MatchCard({ match, reportId }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState("…");

  useEffect(() => {
    void lostFoundService.getFoundItem(match.foundId).then((item) => {
      if (item) setTitle(item.title);
    });
  }, [match.foundId]);

  return (
    <Card
      onPress={() =>
        router.push({
          pathname: "/match/[foundId]",
          params: { foundId: match.foundId, reportId },
        })
      }
    >
      <Text style={styles.title}>{title}</Text>
      <ScoreBar score={match.score} />
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.ink,
    marginBottom: 10,
  },
});
