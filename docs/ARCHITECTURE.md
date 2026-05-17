# Software Architecture — Vienna Lost & Found (M3)

## Overview

Expo 54 React Native app using **Expo Router** (file-based navigation).  
Persistence is **local only** via AsyncStorage; business logic lives in service modules.

## Libraries

| Library | Role |
|---------|------|
| expo-router | Navigation (tabs + stack) |
| @react-native-async-storage/async-storage | Local persistence |
| react-native-webview | Map tab: hosts inline HTML with Leaflet |
| expo-image-picker | Optional photos on reports |
| react-native-qrcode-svg | Pickup QR code |
| zustand | App hydration / refresh state |
| OpenStreetMap Nominatim (HTTP) | Address search and geocoding in `AddressPicker` |

`react-native-maps` is **not** used (removed after crashes with native map modules in Expo Go).

## Navigation

```
(tabs)
  Home | Search | Report | Map | Profile
(stack)
  report/lost, report/found
  matches/[reportId]
  match/[foundId]
  claim/verify → claim/progress → contact/safe-replies → claim/pickup
```

## Data flow

1. `initApp()` loads seed JSON into AsyncStorage on first launch.
2. Screens call `lostFoundService` methods (never AsyncStorage directly).
3. `matching.ts` scores found items against a lost report.
4. `useAppStore.refresh()` reloads data after writes.
5. Claims update report status (`searching` → `matched` → `at_depot` → `claimed`).

```mermaid
flowchart LR
  UI[Screens] --> SVC[lostFoundService]
  SVC --> ST[storage.ts]
  ST --> AS[AsyncStorage]
  SVC --> MAT[matching.ts]
  UI --> GEO[geocoding.ts]
  GEO --> NOM[Nominatim API]
```

## Backend (prototypisch)

No server, authentication, or push notifications.  
Designed so a future REST API could replace `lostFoundService` internals without changing screen contracts.

## Maps

**Implementation:** `components/map/OsmMapView.tsx`

1. React Native **`WebView`** loads a self-contained HTML document (string built in TypeScript).
2. **Leaflet 1.9** and its CSS are loaded from unpkg inside that HTML.
3. **OpenStreetMap** raster tiles: `https://tile.openstreetmap.org/{z}/{x}/{y}.png`.
4. Markers: numbered `L.marker` pins for each found item; `L.circleMarker` for demo user at Karlsplatz.
5. Native UI below the map: sorted list of items with distance; tap opens match detail.

Found items store `coordinates` per report. Demo user position is fixed at Karlsplatz (`constants/locations.ts`). Distances use haversine in `matching.ts`.

**Why WebView + Leaflet:** avoids native map SDK requirements and worked reliably on **Android (Expo Go / Pixel 6 emulator)** for the course demo.

## Location input

`components/location/AddressPicker.tsx` — used on Report Lost/Found:

- Quick picks from `constants/viennaPlaces.ts`
- Live search via `geocoding.ts` → Nominatim (throttled ~1 req/s, Austria bias)
- Resolves label + coordinates before submit
