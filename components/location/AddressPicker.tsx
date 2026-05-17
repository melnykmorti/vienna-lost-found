import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Chip } from "@/components/ui/Chip";
import { theme } from "@/constants/theme";
import {
  type GeoPlace,
  geocodeAddress,
  getPresets,
  searchAddresses,
} from "@/services/geocoding";

export type PickedLocation = GeoPlace;

type Props = {
  label?: string;
  value: PickedLocation | null;
  onChange: (place: PickedLocation | null) => void;
  onQueryChange?: (query: string) => void;
  placeholder?: string;
};

export function AddressPicker({
  label = "Location",
  value,
  onChange,
  onQueryChange,
  placeholder = "Type a place in Vienna, then choose from the list below",
}: Props) {
  const [query, setQuery] = useState(value?.label ?? "");
  const [suggestions, setSuggestions] = useState<GeoPlace[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const presets = getPresets();

  useEffect(() => {
    if (value?.label) setQuery(value.label);
  }, [value?.label]);

  const runSearch = useCallback(async (text: string) => {
    if (text.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const results = await searchAddresses(text);
      setSuggestions(results);
    } catch {
      setError("Could not reach OpenStreetMap. Pick a preset or try again.");
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const onChangeText = (text: string) => {
    setQuery(text);
    onQueryChange?.(text);
    onChange(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => void runSearch(text), 450);
  };

  const pick = (place: GeoPlace) => {
    setQuery(place.label);
    setSuggestions([]);
    onChange(place);
  };

  const resolveTyped = async () => {
    if (value?.coordinates) return value;
    setLoading(true);
    setError(null);
    try {
      const place = await geocodeAddress(query);
      if (!place) {
        setError("Address not found. Select from suggestions.");
        return null;
      }
      pick(place);
      return place;
    } catch {
      setError("Geocoding failed. Check internet or use a preset.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={query}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.muted}
        onBlur={() => {
          if (!value && query.trim().length >= 3) void resolveTyped();
        }}
      />
      {loading ? (
        <ActivityIndicator style={styles.spinner} color={theme.indigo} />
      ) : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {value?.coordinates ? (
        <Text style={styles.resolved}>
          Pin set · {value.coordinates.lat.toFixed(4)},{" "}
          {value.coordinates.lng.toFixed(4)}
        </Text>
      ) : (
        <Text style={styles.hint}>
          Type and pick a suggestion (OpenStreetMap)
        </Text>
      )}

      {suggestions.length > 0 ? (
        <View style={styles.listBox}>
          {suggestions.map((item, i) => (
            <Pressable
              key={`${item.label}-${i}`}
              style={styles.row}
              onPress={() => pick(item)}
            >
              <Text style={styles.rowText}>{item.label}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      <Text style={styles.presetTitle}>Quick picks</Text>
      <View style={styles.chips}>
        {presets.map((p) => (
          <Chip
            key={p.label}
            label={p.label.split(",")[0]}
            selected={value?.label === p.label}
            onPress={() => pick(p)}
          />
        ))}
      </View>
    </View>
  );
}

export async function ensureLocation(
  query: string,
  current: PickedLocation | null,
): Promise<PickedLocation | null> {
  if (current?.coordinates) return current;
  const trimmed = query.trim();
  if (trimmed.length < 2) return null;
  return geocodeAddress(trimmed);
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 16 },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.ink,
    marginBottom: 8,
  },
  input: {
    backgroundColor: theme.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    padding: 14,
    color: theme.ink,
  },
  spinner: { marginTop: 8 },
  hint: { fontSize: 12, color: theme.muted, marginTop: 6 },
  resolved: { fontSize: 12, color: theme.success, marginTop: 6 },
  error: { fontSize: 12, color: theme.warning, marginTop: 6 },
  listBox: {
    marginTop: 8,
    maxHeight: 160,
    backgroundColor: theme.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    overflow: "hidden",
  },
  row: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  rowText: { color: theme.ink, fontSize: 14 },
  presetTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.muted,
    marginTop: 12,
    marginBottom: 8,
  },
  chips: { flexDirection: "row", flexWrap: "wrap" },
});
