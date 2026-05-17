# Readme — M3

- **Gruppe:** 2
- **Team-Nr.:** 211
- **Projektthema:** Vienna Lost & Found

## Implementierung

**Framework:** React Native Android (Expo)

**API-Version:** Android API 36 (Emulator)

**Gerät(e), auf dem(denen) getestet wurde:**  
Google Pixel 6 (Android-Emulator in Android Studio)

**Externe Libraries und Frameworks:**

- Expo ~54 (expo-router, expo-font, expo-image-picker, expo-linking, expo-splash-screen, expo-status-bar, expo-web-browser)
- React 19 / React Native 0.81
- @react-navigation/native
- @react-native-async-storage/async-storage
- react-native-webview (Karte: Leaflet + OpenStreetMap-Tiles)
- react-native-qrcode-svg, react-native-svg
- react-native-reanimated, react-native-safe-area-context, react-native-screens
- zustand
- OpenStreetMap Nominatim API (Geocoding, kostenlos, Netzwerk)

**Dauer der Entwicklung:** 15 Stunden

**Weitere Anmerkungen:**

---

## Installation und Start

```bash
cd vienna-lost-found
npm install
npx expo start --android
```

- Expo Go auf dem Gerät/Emulator oder Taste `a` im Terminal.
- Nach Code-Änderungen: `r` zum Neuladen.
- Demo zurücksetzen: **Profile → Reset demo data**.

## Arbeitsverteilung

| Mitglied            | Beitrag                                                                                                                                                                                              |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mykola Melnyk       | Kernlogik (Services, Storage, Matching, Geocoding), Report-/Claim-Flows, Seed-Daten, Address Picker, README, `docs/EVALUATION.md`                                                                    |
| Rodion Ganopolskyy  | Expo-/Projekt-Setup, Navigation (Expo Router, Tabs), UI-Komponenten & Theme (Variant B), Map (WebView/Leaflet), Search/Home/Profile-Screens, Integration & Tests auf Android, `docs/ARCHITECTURE.md` |
| Fadel Abo Hamed     | UX / Designentscheidungen                                                                                                                                                                            |
| Oleksii Parkhomenko | UI-Polish, Screenshots, Präsentation                                                                                                                                                                 |

Weitere Dokumentation: `docs/EVALUATION.md`, `docs/ARCHITECTURE.md`.
