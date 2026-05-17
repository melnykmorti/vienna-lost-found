import type { Coordinates } from "@/types/models";

export const DEMO_USER = {
  lat: 48.201,
  lng: 16.3728,
  label: "Karlsplatz",
};

export const PICKUP_OFFICE = {
  name: "Fundservice Wien",
  address: "Stadtbahnbogen 263, 1090 Wien",
  hours: "Mon–Fri 8:00–18:00, Sat 9:00–12:00",
  coordinates: { lat: 48.218, lng: 16.358 } as Coordinates,
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Fundservice+Wien+Stadtbahnbogen+263",
};

export const VIENNA_MAP_REGION = {
  latitude: 48.2082,
  longitude: 16.3738,
  latitudeDelta: 0.06,
  longitudeDelta: 0.06,
};

export const LOCATION_PRESETS = [
  "Karlsplatz, 1040 Wien",
  "Landhausgasse 1, 1010 Wien",
  "Stephansplatz, 1010 Wien",
  "Praterstern, 1020 Wien",
  "Westbahnhof, 1150 Wien",
];
