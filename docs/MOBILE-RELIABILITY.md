# Mobile reliability pass, September 2026

## Report and diagnosis

An iPhone 13 user reported a tab reload/crash while zooming after importing records on GitHub Pages, in Safari and Chrome. The exact device crash and operating-system memory logs were not available. Memory/compositing pressure is a plausible contributor, not a proven root cause.

The previous roster referenced twelve 1024 by 1536 PNGs, about 24 MB compressed in total. Each full decoded RGBA image is approximately 6 MiB before browser overhead. Multiple portraits, visual layers, and page magnification could make that unnecessarily expensive on a phone.

## Implemented

- Ship 160px-wide WebP thumbnails and 512px-wide WebP portraits for all twelve characters. The 24 derivatives total approximately 1.14 MB compressed. Preserve the original artwork and desktop primary portraits.
- Avoid duplicate portrait layers, heavy filters, animated decoration, and touch-driven tilt on compact/coarse-pointer displays.
- Add atlas zoom from 100% to 300%, reset, and an explicit Explore/Done gesture mode. Pinch and drag update only the SVG viewBox on an animation frame, with React state committed at gesture end. Analytics and world generation are not rerun on every pointer move.
- Keep ordinary page scrolling and browser zoom available outside Explore mode. Add a modal character inspector with its own bounded zoom and pan.
- Put the mobile map, character summary, and district controls in separate layout rows. Preserve tile labels, touch-sized controls, and safe-area spacing.
- Refresh the application shell cache version. No paid API, account, tracking, or server-side user-data storage was added.

## Verification

- Automated camera tests cover bounded zoom/pan, reset, and pinch anchoring.
- Automated asset tests check relative/subpath URLs and both optimized files for every original character.
- Browser checks at 320, 390, 768, and 1440px found no page-level horizontal overflow on the world view.
- A clearly synthetic 14-row CSV imported successfully into six districts and selected Atelier Weaver.
- Three complete 100%-300%-100% zoom cycles (48 button actions), drag, reset, and character inspection completed in the desktop browser without logged application errors.
- These are desktop browser and automated checks, not physical iPhone or Safari engine certification. A real-device pinch/reload retest is still required.

## Remaining limitations

Imported records intentionally remain in React memory. An OS-forced tab eviction or manual reload can still lose the current session. Export a passport for recovery. Persisting personal data automatically would change the privacy contract and is not part of this patch.

No website can guarantee that a phone will never terminate its tab. If the problem recurs, record the iOS version, dataset row count/file size, selected view, and whether Explore mode or ordinary page pinch was used. Do not send personal records for debugging; use an anonymized or synthetic reproduction.
