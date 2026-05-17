import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  AddressPicker,
  ensureLocation,
  type PickedLocation,
} from "@/components/location/AddressPicker";
import { Chip } from "@/components/ui/Chip";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Screen } from "@/components/ui/Screen";
import { CATEGORIES } from "@/constants/categories";
import { theme } from "@/constants/theme";
import { detectAiTags } from "@/services/aiTags";
import { lostFoundService } from "@/services/lostFoundService";
import { useAppStore } from "@/store/appStore";
import type { HandoffType, ItemCategory } from "@/types/models";

export default function ReportFoundScreen() {
  const router = useRouter();
  const refresh = useAppStore((s) => s.refresh);
  const [category, setCategory] = useState<ItemCategory>("keys");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState<PickedLocation | null>(null);
  const [locationQuery, setLocationQuery] = useState("");
  const [handoff, setHandoff] = useState<HandoffType>("depot");
  const [aiTags, setAiTags] = useState<string[]>([]);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setAiTags(detectAiTags(category, description));
  }, [category, description]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });
    if (!result.canceled) setPhotoUri(result.assets[0].uri);
  };

  const submit = async () => {
    const resolved = await ensureLocation(locationQuery, location);
    if (!resolved) {
      Alert.alert(
        "Pick a location",
        "Search for an address and tap a suggestion, or use a quick pick.",
      );
      return;
    }

    setSubmitting(true);
    await lostFoundService.createFoundItem({
      category,
      description,
      locationLabel: resolved.label,
      coordinates: resolved.coordinates,
      foundAt: new Date().toISOString(),
      photoUri,
      handoff,
      aiTags,
    });
    await refresh();
    setSubmitting(false);
    router.replace("/(tabs)/map");
  };

  return (
    <Screen
      title="You found something — thanks!"
      footer={
        <PrimaryButton
          label={submitting ? "Submitting…" : "Submit found report"}
          onPress={() => void submit()}
          disabled={submitting}
        />
      }
    >
      <Pressable style={styles.photo} onPress={() => void pickImage()}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.photoImg} />
        ) : (
          <Text style={styles.photoText}>Snap the item</Text>
        )}
      </Pressable>

      <View style={styles.aiBox}>
        <Text style={styles.aiTitle}>AI Detected (demo)</Text>
        <View style={styles.chips}>
          {aiTags.map((t) => (
            <Chip key={t} label={t} selected />
          ))}
        </View>
      </View>

      <Text style={styles.label}>Category</Text>
      <View style={styles.chips}>
        {CATEGORIES.map((c) => (
          <Chip
            key={c.id}
            label={c.label}
            selected={category === c.id}
            onPress={() => setCategory(c.id)}
          />
        ))}
      </View>

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        multiline
        value={description}
        onChangeText={setDescription}
        placeholder="What the item looks like — color, brand, damage, anything distinctive"
        placeholderTextColor={theme.muted}
      />

      <AddressPicker
        label="Where did you find it?"
        value={location}
        onChange={setLocation}
        onQueryChange={setLocationQuery}
        placeholder="Where you found it — street, station, or building in Vienna"
      />

      <Text style={styles.label}>What will you do with it?</Text>
      <View style={styles.chips}>
        <Chip
          label="Drop at pickup point"
          selected={handoff === "depot"}
          onPress={() => setHandoff("depot")}
        />
        <Chip
          label="Hand to staff on site"
          selected={handoff === "staff"}
          onPress={() => setHandoff("staff")}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  photo: {
    height: 120,
    backgroundColor: theme.indigo,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    overflow: "hidden",
  },
  photoImg: { width: "100%", height: "100%" },
  photoText: { color: theme.white, fontWeight: "600" },
  aiBox: {
    backgroundColor: theme.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    ...theme.cardShadow,
  },
  aiTitle: { fontWeight: "600", marginBottom: 8, color: theme.ink },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.ink,
    marginBottom: 8,
  },
  chips: { flexDirection: "row", flexWrap: "wrap", marginBottom: 12 },
  input: {
    backgroundColor: theme.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    padding: 14,
    minHeight: 80,
    marginBottom: 16,
    color: theme.ink,
  },
});
