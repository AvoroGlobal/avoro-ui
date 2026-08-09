import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
const toneStyles = {
    neutral: {
        bg: "var(--avoro-surface-subtle)",
        fg: "var(--avoro-text-secondary)",
    },
    success: {
        bg: "var(--avoro-status-success-bg)",
        fg: "var(--avoro-status-success-fg)",
    },
    warning: {
        bg: "var(--avoro-status-warning-bg)",
        fg: "var(--avoro-status-warning-fg)",
    },
    error: {
        bg: "var(--avoro-status-error-bg)",
        fg: "var(--avoro-status-error-fg)",
    },
    brand: {
        bg: "var(--avoro-chartreuse)",
        fg: "var(--avoro-text-on-brand)",
    },
};
export const Badge = forwardRef(({ tone = "neutral", children, className = "", style, ...rest }, ref) => {
    const toneStyle = toneStyles[tone];
    const baseStyles = {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        height: "var(--avoro-component-badge-height)",
        paddingLeft: "var(--avoro-component-badge-padding-x)",
        paddingRight: "var(--avoro-component-badge-padding-x)",
        fontFamily: "var(--avoro-font-display)",
        fontSize: "var(--avoro-size-caption)",
        fontWeight: 500,
        lineHeight: 1,
        borderRadius: "var(--avoro-component-badge-radius)",
        backgroundColor: toneStyle.bg,
        color: toneStyle.fg,
        ...style,
    };
    return (_jsx("span", { ref: ref, className: className, style: baseStyles, ...rest, children: children }));
});
Badge.displayName = "Badge";
