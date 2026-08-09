# CLAUDE.md — Avoro UI

This package is the single source of truth for all UI primitives in Avoro applications.

## Rules

- Semantic tokens only. No raw hex. No arbitrary Tailwind values like w-[37px].
- Every interactive component has a visible focus state using the semantic focusRing token.
- Every component renders and is tested in light AND dark themes.
- Icons come from @avoroglobal/icons by registry name only.
- Every component is a forwardRef component with typed props.
- The component owns theme behavior. Surfaces never hand-pick variants per theme.

## Usage

```tsx
import { Button } from "@avoroglobal/ui";

// Primary (default)
<Button>Save changes</Button>

// Secondary
<Button variant="secondary">Cancel</Button>

// Ghost
<Button variant="ghost">Learn more</Button>

// Inverse (auto-flips per theme)
<Button variant="inverse">Get started</Button>

// With icon
<Button icon="bolt">Quick action</Button>

// Loading
<Button loading>Saving...</Button>

// Disabled
<Button disabled>Not available</Button>
```

## Adding a new component

1. Create `src/<component>/<Component>.tsx`
2. Create `src/<component>/<component>.test.tsx`
3. Export from `src/index.ts`
4. Run `npm run build && npm test`
5. PR with the component name and use case
