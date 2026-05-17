import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Switch,
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
import { lostFoundService } from "@/services/lostFoundService";
import { useAppStore } from "@/store/appStore";
import type { ItemCategory } from "@/types/models";

export default function ReportLostScreen() {
  const router = useRouter();
  const refresh = useAppStore((s) => s.refresh);
  const [category, setCategory] = useState<ItemCategory>("wallet");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState<PickedLocation | null>(null);
  const [locationQuery, setLocationQuery] = useState("");
  const [when, setWhen] = useState("");
  const [notify, setNotify] = useState(true);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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
    const lostAt = new Date().toISOString();
    const report = await lostFoundService.createLostReport({
      category,
      description,
      locationLabel: resolved.label,
      coordinates: resolved.coordinates,
      lostAt,
      photoUri,
      notifyOnMatch: notify,
    });
    await refresh();
    setSubmitting(false);
    router.replace(`/matches/${report.id}`);
  };

  return (
    <Screen
      title="Tell us what you've lost"
      footer={
        <PrimaryButton
          label={submitting ? "Submitting…" : "Submit"}
          onPress={() => void submit()}
          disabled={submitting || !description.trim()}
        />
      }
    >
      <Pressable style={styles.photo} onPress={() => void pickImage()}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.photoImg} />
        ) : (
          <Text style={styles.photoText}>Add a photo</Text>
        )}
      </Pressable>

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
        placeholder="Describe color, material, size, and marks — this helps us match your item"
        placeholderTextColor={theme.muted}
      />

      <AddressPicker
        label="Where did you lose it?"
        value={location}
        onChange={setLocation}
        onQueryChange={setLocationQuery}
        placeholder="Where you think you lost it — search Vienna and tap a result"
      />

      <Text style={styles.label}>When?</Text>
      <TextInput
        style={styles.inputSingle}
        value={when}
        onChangeText={setWhen}
        placeholder="When you noticed it was missing (date and approximate time)"
        placeholderTextColor={theme.muted}
      />

      <View style={styles.row}>
        <Text style={styles.label}>Notify me on match</Text>
        <Switch
          value={notify}
          onValueChange={setNotify}
          trackColor={{ true: theme.indigo }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  photo: {
    height: 140,
    backgroundColor: theme.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    overflow: "hidden",
  },
  photoImg: { width: "100%", height: "100%" },
  photoText: { color: theme.muted },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.ink,
    marginBottom: 8,
  },
  chips: { flexDirection: "row", flexWrap: "wrap", marginBottom: 16 },
  input: {
    backgroundColor: theme.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    padding: 14,
    minHeight: 100,
    textAlignVertical: "top",
    marginBottom: 16,
    color: theme.ink,
  },
  inputSingle: {
    backgroundColor: theme.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    padding: 14,
    marginBottom: 12,
    color: theme.ink,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
});
