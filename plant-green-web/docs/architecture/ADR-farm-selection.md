# ADR: Farm Selection

- Status: Accepted for Phase 1.
- Selected farm is stored in global Farm Switcher state.
- Farm identity is not part of URL routing.
- This differs deliberately from the Blueprint route tree, which uses `/:farmId`.
- The deviation keeps farm selection consistent across `/app` pages.
- The decision should be revisited if deep-linking per farm becomes required.
