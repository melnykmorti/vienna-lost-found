# Evaluation — Personas & Usability (M3)

## Link to M1 use cases

| M1 task             | Prototype support                                         |
| ------------------- | --------------------------------------------------------- |
| Create lost report  | Report Lost — single screen, categories, optional photo   |
| Create found report | Report Found — AI tags (demo), handoff choice             |
| Search for matches  | Proactive matches from open report + Search catalog + Map |
| Safe contact        | Safe replies screen — preset phrases only                 |
| Verify ownership    | Unique detail + progress timeline before pickup           |

## Persona walkthroughs

### Anna (stressed student)

- **Need:** Fast report after losing wallet on U-Bahn.
- **Flow:** Home → preloaded report → Find Matches → 88% match → claim → QR pickup.
- **Result:** Few steps, clear status on Home, no long forms.

### Lukas (helpful finder)

- **Need:** Low-effort, safe reporting.
- **Flow:** Report Found → photo + AI tags → item on Map/Search; no direct phone contact.
- **Result:** Handoff to depot; communication via safe replies only.

### Sofia (tourist)

- **Need:** Simple English UI, location-based search.
- **Flow:** Search or Map near Karlsplatz; distance labels; guided match explanation.
- **Result:** No local Fundamt knowledge required for first steps.

## Strengths

- Variant B visual clarity (cream/indigo, open reports dashboard).
- Transparent match scoring (“Why this match?”).
- Trust features: verification detail, safe replies, official pickup info.
- OSM map with pins (WebView + Leaflet) supports M1 location focus.

## Limitations

- No multi-device sync or real finder confirmation.
- Rule-based “AI” is demo-only.
- No German UI toggle in this build.
- Map tab tested on Android (Expo Go); requires network for OSM tiles and Nominatim.

## M4 improvements (post usability study)

| Finding                           | Change in prototype                                         |
| --------------------------------- | ----------------------------------------------------------- |
| Match score unclear (6/8 users)   | Tier labels + green/yellow/grey score bar on matches        |
| Verification too vague (critical) | Good-examples block; partial acceptance; retry on rejection |
| “Other” too broad                 | Added Keychain and ID/Card categories                       |
| No onboarding (minor)             | Deferred — needs separate UI + retest cycle                 |

## Future improvements

- First-run onboarding tour (identified in M4 study).
- Real backend + accounts; push on match.
- ML image tagging; staff verification (Maria persona).
- DE/EN localization; Wiener Linien API integration.
