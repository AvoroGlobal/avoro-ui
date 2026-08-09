# Avoro logo rules

Every rule below is sourced from `brand-kit/brand-kit-no-investor/02-logos/`.
Where the kit is silent, the entry says **NOT SPECIFIED IN KIT** — nothing here
is invented. (The kit folder contains asset files only — SVG/PNG with embedded
comments — no prose guidelines document.)

## Approved lockups

Sourced from the folder structure of `02-logos/`:

- **Primary wordmark** — `primary/avoro-primary-*.svg` (horizontal, viewBox 800×200).
  Variants: `on-ink`, `on-paper`, `transparent-ink`, `transparent-paper`.
- **Slash mark** — `slash-mark/avoro-slash-*.svg` (viewBox 200×200).
  Variants: `chartreuse`, `ink`, `mono-black`, `mono-white`.
- **Pillar lockups** — `pillar-lockups/avoro-{agents,brokerages,capital,commerce,intelligence,teams}-*.svg`
  (horizontal, viewBox 990×200). Variants: `on-ink`, `on-paper`.
- **Monochrome wordmark** — `monochrome/avoro-mono-{black,white}.svg`.
- **Favicons** — `favicons/` (see `favicons/install-snippet.html`).

**Stacked lockup: NOT SPECIFIED IN KIT** (no stacked asset exists; the primary
and pillar lockups are all horizontal).

## Color / slash rule

Sourced from the SVG `fill` values:

- **On Ink (dark) backgrounds** — wordmark text `#FAFAF7` (paper), slash
  `#C8E83D` (chartreuse). Source: `primary/avoro-primary-on-ink.svg`
  (fills `#0E0E10` background, `#FAFAF7` letters, `#C8E83D` slash).
- **On Paper (light) backgrounds** — wordmark text and slash `#0E0E10` (ink).
  Source: `primary/avoro-primary-on-paper.svg` (all fills `#0E0E10`).
- **Transparent variants** — `transparent-ink` all `#0E0E10` (for light bg);
  `transparent-paper` all `#FAFAF7` (for dark bg).
  Source: `primary/avoro-primary-transparent-{ink,paper}.svg`.
- **Monochrome** — `monochrome/avoro-mono-black.svg` `#000000`;
  `monochrome/avoro-mono-white.svg` `#FFFFFF`.

## Typeface

- **Geist Mono Medium.** Source: comment in `primary/avoro-primary-on-ink.svg`
  ("Avoro Wordmark — outlined paths (Geist Mono Medium). No font dependency.
  Renders identically everywhere."). The shipped SVGs are outlined paths, not
  live text.

## Minimum sizes

**NOT SPECIFIED IN KIT.** The kit ships fixed-size PNG rasters (512 / 1024 /
2048 / 4096 px) and SVGs, but states no minimum reproduction size for print or
screen. The `Wordmark` component's 16px warning threshold is a component-level
default, **not** a kit rule — a human must set the real minimum.

## Clear space

**NOT SPECIFIED IN KIT.** No clear-space / exclusion-zone rule appears anywhere
in `02-logos/`.

## Approved backgrounds

Inferred only from the variant names and fills (no prose rule):
- Ink/dark (`on-ink`), Paper/light (`on-paper`), and transparent variants for
  placement over other backgrounds. Source: filenames + fills listed above.
- **A chartreuse ("on-brand") background variant: NOT SPECIFIED IN KIT** — no
  `on-brand` / `on-chartreuse` asset exists.

## Never-list

**NOT SPECIFIED IN KIT.** No "never do" list (no rules against stretching,
recoloring, rotating, effects, etc.) appears anywhere in `02-logos/`.
