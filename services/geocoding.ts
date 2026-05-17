import { VIENNA_PLACES } from "@/constants/viennaPlaces";
import type { Coordinates } from "@/types/models";

export interface GeoPlace {
  label: string;
  coordinates: Coordinates;
}

const NOMINATIM = "https://nominatim.openstreetmap.org";
const USER_AGENT = "ViennaLostFound/1.0 (uni-hci-m3-prototype)";

const cache = new Map<string, GeoPlace>();
let lastRequestAt = 0;

async function throttle(): Promise<void> {
  const wait = 1100 - (Date.now() - lastRequestAt);
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastRequestAt = Date.now();
}

type NominatimRow = {
  display_name: string;
  lat: string;
  lon: string;
};

function rowToPlace(row: NominatimRow): GeoPlace {
  const short =
    row.display_name.length > 72
      ? `${row.display_name.slice(0, 69)}…`
      : row.display_name;
  return {
    label: short,
    coordinates: { lat: parseFloat(row.lat), lng: parseFloat(row.lon) },
  };
}

export function presetByLabel(label: string): GeoPlace | null {
  const lower = label.trim().toLowerCase();
  const hit = VIENNA_PLACES.find(
    (p) =>
      p.label.toLowerCase() === lower || p.shortLabel.toLowerCase() === lower,
  );
  if (!hit) return null;
  return { label: hit.label, coordinates: { lat: hit.lat, lng: hit.lng } };
}

export function getPresets(): GeoPlace[] {
  return VIENNA_PLACES.map((p) => ({
    label: p.label,
    coordinates: { lat: p.lat, lng: p.lng },
  }));
}

async function nominatimSearch(
  query: string,
  limit: number,
): Promise<GeoPlace[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const preset = presetByLabel(trimmed);
  if (preset && limit === 1) return [preset];

  const cacheKey = `${trimmed.toLowerCase()}|${limit}`;
  if (limit === 1 && cache.has(cacheKey)) {
    return [cache.get(cacheKey)!];
  }

  await throttle();

  const q = encodeURIComponent(
    trimmed.includes("Wien") || trimmed.includes("Vienna")
      ? trimmed
      : `${trimmed}, Vienna, Austria`,
  );
  const url = `${NOMINATIM}/search?format=json&q=${q}&limit=${limit}&countrycodes=at&addressdetails=0`;

  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
  });

  if (!res.ok) return preset ? [preset] : [];

  const rows = (await res.json()) as NominatimRow[];
  const places = rows.map(rowToPlace);

  if (limit === 1 && places[0]) {
    cache.set(cacheKey, places[0]);
    cache.set(places[0].label.toLowerCase(), places[0]);
  }

  return places;
}

export async function searchAddresses(query: string): Promise<GeoPlace[]> {
  const preset = presetByLabel(query);
  const remote = await nominatimSearch(query, 5);
  if (preset && !remote.some((r) => r.label === preset.label)) {
    return [preset, ...remote];
  }
  return remote;
}

export async function geocodeAddress(query: string): Promise<GeoPlace | null> {
  const key = query.trim().toLowerCase();
  if (cache.has(key)) return cache.get(key)!;

  const preset = presetByLabel(query);
  if (preset) {
    cache.set(key, preset);
    return preset;
  }

  const results = await nominatimSearch(query, 1);
  return results[0] ?? null;
}

export function registerCachedPlace(place: GeoPlace): void {
  cache.set(place.label.toLowerCase(), place);
}
