# LifeMap engineering rules

These rules apply to every change in this repository.

1. Never upload user data.
2. Never introduce an AI API.
3. Never introduce unnecessary infrastructure.
4. Never commit secrets.
5. Never commit personal data.
6. Never use copyrighted game assets.
7. Never make unsupported analytical claims.
8. Never turn the world into a generic dashboard.
9. Keep the character and world visually central.
10. Every visual encoding must have a documented meaning.
11. Every metric must be reproducible.
12. Every imported value is untrusted input.
13. Keep dependencies lightweight.
14. Preserve GitHub Pages compatibility and relative asset paths.
15. Test before declaring phases complete.
16. Preserve semantic HTML, keyboard operation, contrast, reduced motion, and the textual world alternative.
17. Preserve the 320px mobile layout without page-level horizontal overflow.
18. Fix broken functionality instead of documenting it as a limitation.
19. Do not optimize for screenshots alone; controls and data flows must function.
20. The final product should feel like real software.

## Working agreement

- Keep personal datasets out of fixtures. Use only the deterministic fictional generator or small clearly synthetic examples.
- Keep imported data in React memory unless explicit, opt-in persistence is designed and documented.
- Treat all imported strings as text. Do not use `dangerouslySetInnerHTML` for user values.
- Frame correlations as associations and show sample size. Never imply causation.
- Update `docs/ANALYTICS.md` when formulas change and `docs/DESIGN.md` when visual mappings change.
- Run `pnpm test`, `pnpm lint`, and `pnpm build` before release.

