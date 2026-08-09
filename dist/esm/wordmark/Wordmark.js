import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from "react";
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
const themeColors = {
    light: { text: "var(--avoro-ink)", slash: "var(--avoro-ink)" },
    dark: { text: "var(--avoro-paper)", slash: "var(--avoro-chartreuse)" },
    onBrand: { text: "var(--avoro-ink)", slash: "var(--avoro-ink)" },
    // auto defers to the ambient theme: --avoro-fg / --avoro-accent flip with the
    // surrounding surface (accent is chartreuse-deep on light, chartreuse on dark),
    // so the wordmark follows its context rather than a fixed theme.
    auto: { text: "var(--avoro-fg)", slash: "var(--avoro-accent)" },
};
// Kit minimum for the primary lockup (LOGO-RULES.md). Below this we warn.
const KIT_MIN_PRIMARY_PX = 16;
export const Wordmark = forwardRef(({ lockup = "horizontal", theme = "light", size = 16, className = "", style, ...rest }, ref) => {
    if (lockup !== "mark" && size < KIT_MIN_PRIMARY_PX) {
        console.warn(`Wordmark: size ${size}px is below the kit minimum of ${KIT_MIN_PRIMARY_PX}px for the primary lockup.`);
    }
    const colors = themeColors[theme];
    const baseStyles = {
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
    const slash = (_jsx("span", { style: { color: colors.slash }, "aria-hidden": "true", children: "/" }));
    if (lockup === "mark") {
        // The slash mark on its own.
        return (_jsx("span", { ref: ref, "aria-label": "avoro/", className: className, style: baseStyles, ...rest, children: slash }));
    }
    if (lockup === "stacked") {
        // NOTE: the kit specifies only the horizontal primary lockup — "stacked"
        // is NOT SPECIFIED IN KIT (see LOGO-RULES.md). Rendered as wordmark over slash.
        return (_jsxs("span", { ref: ref, "aria-label": "avoro/", className: className, style: baseStyles, ...rest, children: [_jsx("span", { children: "avoro" }), slash] }));
    }
    // horizontal (the kit primary lockup)
    return (_jsxs("span", { ref: ref, "aria-label": "avoro/", className: className, style: baseStyles, ...rest, children: ["avoro", slash] }));
});
Wordmark.displayName = "Wordmark";
