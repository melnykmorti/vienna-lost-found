import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { Screen } from "@/components/ui/Screen";
import { CATEGORIES } from "@/constants/categories";
import { theme } from "@/constants/theme";
import { distanceFromDemoM, formatDistance } from "@/services/matching";
import { lostFoundService } from "@/services/lostFoundService";
import type { FoundItem, ItemCategory } from "@/types/models";

export default function SearchScreen() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [last7, setLast7] = useState(true);
  const [category, setCategory] = useState<ItemCategory | "all">("all");
  const [results, setResults] = useState<FoundItem[]>([]);

  const search = useCallback(async () => {
    const items = await lostFoundService.searchFoundItems({
      text,
      category: category === "all" ? undefined : category,
      last7Days: last7,
    });
    setResults(
      [...items].sort((a, b) => distanceFromDemoM(a) - distanceFromDemoM(b)),
    );
  }, [text, last7, category]);

  useFocusEffect(
    useCallback(() => {
      void search();
    }, [search]),
  );

  return (
    <Screen
      title="Find your item"
      subtitle="Search the catalog near Karlsplatz (demo position)."
    >
      <TextInput
        style={styles.search}
        placeholder="Type item name, color, or place where it was found"
        placeholderTextColor={theme.muted}
        value={text}
        onChangeText={setText}
        onSubmitEditing={() => void search()}
      />
      <View style={styles.chips}>
        <Chip
          label="Last 7 days"
          selected={last7}
          onPress={() => setLast7(!last7)}
        />
        <Chip label="Near Karlsplatz" selected onPress={() => {}} />
      </View>
      <View style={styles.chips}>
        <Chip
          label="All"
          selected={category === "all"}
          onPress={() => setCategory("all")}
        />
        {CATEGORIES.slice(0, 4).map((c) => (
          <Chip
            key={c.id}
            label={c.label}
            selected={category === c.id}
            onPress={() => setCategory(c.id)}
          />
        ))}
      </View>

      <Text style={styles.count}>RESULTS — {results.length}</Text>
      {results.map((item) => (
        <Card
          key={item.id}
          onPress={() =>
            router.push({
              pathname: "/match/[foundId]",
              params: { foundId: item.id, reportId: "browse" },
            })
          }
        >
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.meta}>
            {item.locationLabel} · {formatDistance(distanceFromDemoM(item))}
          </Text>
          <Text style={styles.desc} numberOfLines={2}>
            {item.description}
          </Text>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  search: {
    backgroundColor: theme.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    padding: 14,
    marginBottom: 12,
    color: theme.ink,
  },
  chips: { flexDirection: "row", flexWrap: "wrap", marginBottom: 8 },
  count: {
    fontWeight: "700",
    marginVertical: 12,
    color: theme.ink,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.ink,
    marginBottom: 4,
  },
  meta: { color: theme.muted, fontSize: 13, marginBottom: 6 },
  desc: { color: theme.muted, fontSize: 14 },
});
