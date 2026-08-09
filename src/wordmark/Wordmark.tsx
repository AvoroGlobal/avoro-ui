import { forwardRef, type HTMLAttributes } from "react";

export type WordmarkLockup = "horizontal" | "stacked" | "mark";
export type WordmarkTheme = "light" | "dark" | "onBrand";

export interface WordmarkProps extends HTMLAttributes<HTMLSpanElement> {
  lockup?: WordmarkLockup;
  theme?: WordmarkTheme;
  /** Font size in px. The kit minimum for the primary lockup is 16px (see LOGO-RULES.md). */
  size?: number;
}

/**
 * Avoro wordmark — `avoro/` lowercase always, Geist Mono Medium (500),
 * tracking -0.02em (brand-tokens CLAUDE.md §4.3).
 *
 * Slash rule (§3 + kit 02-logos/primary): on Ink/dark surfaces the slash is
 * chartreuse; on Paper/light it is ink. onBrand (on a chartreuse background)
 * the whole lockup is ink.
 *
 * Colors come from the non-flipping primitives so the wordmark is correct on
 * its intended background regardless of the surrounding theme:
 *   light  → ink text + ink slash (for Paper/light backgrounds)
 *   dark   → paper text + chartreuse slash (for Ink/dark backgrounds)
 *   onBrand→ ink text + ink slash (for chartreuse backgrounds)
 */
const themeColors: Record<WordmarkTheme, { text: string; slash: string }> = {
  light: { text: "var(--avoro-ink)", slash: "var(--avoro-ink)" },
  dark: { text: "var(--avoro-paper)", slash: "var(--avoro-chartreuse)" },
  onBrand: { text: "var(--avoro-ink)", slash: "var(--avoro-ink)" },
};

// Kit minimum for the primary lockup (LOGO-RULES.md). Below this we warn.
const KIT_MIN_PRIMARY_PX = 16;

export const Wordmark = forwardRef<HTMLSpanElement, WordmarkProps>(
  (
    { lockup = "horizontal", theme = "light", size = 16, className = "", style, ...rest },
    ref
  ) => {
    if (lockup !== "mark" && size < KIT_MIN_PRIMARY_PX) {
      console.warn(
        `Wordmark: size ${size}px is below the kit minimum of ${KIT_MIN_PRIMARY_PX}px for the primary lockup.`
      );
    }

    const colors = themeColors[theme];

    const baseStyles: React.CSSProperties = {
      fontFamily: "var(--avoro-font-mono)",
      fontWeight: 500,
      letterSpacing: "-0.02em",
      fontSize: `${size}px`,
      lineHeight: 1,
      color: colors.text,
      userSelect: "none",
      whiteSpace: "nowrap",
      display: lockup === "stacked" ? "inline-flex" : "inline",
      flexDirection: lockup === "stacked" ? "column" : undefined,
      alignItems: lockup === "stacked" ? "flex-start" : undefined,
      ...style,
    };

    const slash = (
      <span style={{ color: colors.slash }} aria-hidden="true">
        /
      </span>
    );

    if (lockup === "mark") {
      // The slash mark on its own.
      return (
        <span
          ref={ref}
          aria-label="avoro/"
          className={className}
          style={baseStyles}
          {...rest}
        >
          {slash}
        </span>
      );
    }

    if (lockup === "stacked") {
      // NOTE: the kit specifies only the horizontal primary lockup — "stacked"
      // is NOT SPECIFIED IN KIT (see LOGO-RULES.md). Rendered as wordmark over slash.
      return (
        <span
          ref={ref}
          aria-label="avoro/"
          className={className}
          style={baseStyles}
          {...rest}
        >
          <span>avoro</span>
          {slash}
        </span>
      );
    }

    // horizontal (the kit primary lockup)
    return (
      <span
        ref={ref}
        aria-label="avoro/"
        className={className}
        style={baseStyles}
        {...rest}
      >
        avoro{slash}
      </span>
    );
  }
);

Wordmark.displayName = "Wordmark";
