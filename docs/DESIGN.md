# Design system and world language

## Direction

LifeMap uses an original cartographic 2.5D language: deep ink atmosphere, parchment typography, restrained mineral accents, one connected isometric realm, architectural beacons, paths, vegetation, and one central protagonist. The primary mental model is a personal RPG world; analytical chrome recedes into the HUD, archive, and Codex.

## Tokens

- **Ink background:** `#08191b`
- **Raised ink:** `#10272a` / `#173235`
- **Parchment foreground:** `#f5f2e8`
- **Gold action/accent:** `#e7cc78`
- **Muted copy:** `#9fb3ae`
- **Category palette:** amber, green, coral, violet, blue, yellow
- **Display type:** Georgia/system serif stack
- **Body type:** Inter/system sans stack
- **Radius:** 0.65–1.5rem by hierarchy; circular controls where spatial
- **Spacing:** compact 4/8/12px rhythm inside controls; large editorial gaps at view level

The palette avoids random neon, ubiquitous glow, rainbow gradients, glass card grids, emoji, or stock game icons.

## Visual encodings

| Data                         | World encoding                                |
| ---------------------------- | --------------------------------------------- |
| Category time share          | District scale and world-index percentage     |
| Consistency                  | Number of environmental trees                 |
| Category level               | Landmark height                               |
| Streak ≥ 5 days              | Beacon above landmark                         |
| Fewer than 3 records         | Fog/unexplored treatment                      |
| Recurring activity structure | Connecting road                               |
| Selected category            | Highlight, camera focus, protagonist movement |
| Dominant time bucket         | Restrained atmosphere class                   |

Only the six largest categories are placed spatially to preserve legibility. All categories remain in calculations, data, and exports.

## Character

LifeMap has twelve original protagonist identities: Wayfinder, City Architect, Guild Forgemaster, Archive Sage, Observatory Scholar, Trail Warden, Circuit Ranger, Hearth Envoy, Festival Herald, Grovekeeper, Dream Gardener, and Atelier Weaver. Each identity has a locked face, age, body language, silhouette, wardrobe, palette, and signature prop set. These traits are documented in the character bible and cannot be replaced by a generic class body. The class equipment is visual world-building rather than a combat system.

Aggregate activity by recognized life domain selects the identity deterministically. Each recognized domain has a core form, and Career, Learning, Fitness, Social, or Recreation reveals a specialist form when it holds at least 68% of tracked time. This is a visual metaphor for the uploaded activity pattern, not a gender classifier or a claim about the user’s identity. A user can change the display name, accent, and journey style without supplying a photo. The selected protagonist remains consistent across Landing, World, Character, Journey, and Compare, while data-derived equipment, achievement sigils, level bands, title, aura intensity, and environmental context create visible evolution.

The authoritative original form is used throughout Landing, World, Character, Journey, and Compare so every protagonist remains recognizable. The final living-form renderer adds restrained depth, parallax, lighting, aura, and idle motion to the exact original portrait. Earlier generic 3D rigs were removed because they did not preserve the documented identities. Any future custom mesh must preserve the locked face, body, silhouette, wardrobe, palette, and signature props before it can replace an original form. Interface surfaces use shallow spatial layering so the atlas feels dimensional without tilting long-form text or compromising readability.

## Screen language

- **Landing:** a cinematic protagonist-in-world composition explains “my data → my world” immediately.
- **Landing preview:** the four leading categories use a fixed two-by-two isometric tile arrangement. Structures and landmarks stay anchored to the center of their own tile, while the complete World view retains the full geography.
- **Landing character lane:** the protagonist occupies the far-left lane of the visual realm. The four-tile preview begins to the right of that lane, so the character never covers a district.
- **World tile geometry:** one through six districts use balanced fixed isometric platforms. A bounded colored inset represents relative time share without moving the platform boundary. Structures, lights, vegetation, and landmark hit areas use the same tile-local anchors and are clipped to that platform. District names appear on the front ridge.
- **District color:** each platform inherits the same generated district color as its landmark roofs. Recreation therefore remains red in the standard ordering and Fitness remains blue.
- **World:** the atlas is the primary interface, with region focus, camera controls, landmark evidence, and protagonist travel.
- **Character:** a full RPG profile sanctum centers identity, XP, equipment, attributes, category mastery, and collectible achievements.
- **Journey:** a time gate reconstructs complete monthly worlds in place before the user enters an era.
- **Journey title lane:** era titles remain in a bounded left column while the reconstructed tile world begins to its right on desktop and below it on smaller screens.
- **Journey intensity:** the activity heatmap and its explanatory copy use a dark atlas surface so white headings, muted copy, metrics, and green intensity cells retain clear contrast.
- **Protagonist framing:** full-world portraits reserve top headroom and use top-aligned containment so hair, hats, and other head details remain visible for every deterministic archetype.
- **Discoveries:** deterministic insights become an observation chronicle with supporting calculations.
- **Compare:** two period-specific realms appear as parallel chapters before the exact metric ledger.
- **Data:** the source archive keeps import/export, normalized records, and landmark traces literal and clear.
- **Codex:** the deterministic data → analytics → progression → world → character pipeline remains fully documented.

## Motion

Motion explains state: camera zoom, selected-region focus, avatar travel, district hover/focus, XP bars, and restrained idle movement. `prefers-reduced-motion` removes idle animation and compresses transitions to near-zero duration.

## Responsive and accessible design

Desktop shows the full world, index, progression metrics, and selected-region strip. Tablet reorganizes controls. At 320px the world remains large enough to read, metrics stack, a touch dock replaces the full nav, and page scroll width remains equal to viewport width.

The SVG has a title and description, regions are keyboard buttons with exact values, every color encoding has text, and the world is accompanied by indices, metrics, methodology, and normalized data.
