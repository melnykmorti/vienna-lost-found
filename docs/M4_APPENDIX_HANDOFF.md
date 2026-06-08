# M4 Appendix

Screenshots from the **current** build (after M4 changes). Before shooting: **Profile → Reset demo data**.

## Screens to capture (M3 vs M4)

| Screen | Before (M3) | After (M4) | filename |
|--------|-------------|------------|----------|
| Matches | % only, blue bar | coloured bar; full text on detail screen | `screenshot-matches.png` |
| Match detail | score hard to read | label + short hint + “Why this match?” | `screenshot-match-detail.png` |
| Verify | empty field, unclear | “Good examples” box | `screenshot-verify.png` |
| Claim progress | always passes | rejected + **Try again** (type `wallet` on verify) | `screenshot-verify-rejected.png` |
| Report Lost | no Keychain | Keychain + ID/Card in category list | `screenshot-categories.png` |

## Text for Implementation section (report)

We used Expo 54 with React Native and TypeScript. Navigation is Expo Router. Data is stored locally in AsyncStorage (with a small in-memory fallback if storage fails). Main logic is in services: `lostFoundService`, `matching`, `geocoding`, and after M4 also `verification`. The map is a WebView with Leaflet and OSM tiles — we dropped react-native-maps because it crashed in Expo Go. Addresses are resolved through Nominatim (rate-limited).

**Changes after the usability study:** match % now has colour and a short label (green / yellow / grey); verify screen has examples and checks the secret detail against the found item (accept / partial / reject, retry on reject); categories Keychain and ID/Card added.

**Problems we hit:** AsyncStorage 3.x broke the app, so we use 2.2.0; map moved from native module to WebView + Leaflet.

## Onboarding — not built

Only 2 of 8 testers asked for a tutorial. We left it out for M4 — would need extra screens and another round of testing. Mention as future work in the report.

## Demo (about 5 min)

1. Home → wallet report → Matches (~88%, green).
2. Match → claim → verify: `brass stud` → progress → safe replies → pickup QR.
3. Extra if time: verify `wallet` → rejected → Try again.
