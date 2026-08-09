import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useEffect, } from "react";
const toneStyles = {
    success: {
        bg: "var(--avoro-status-success-bg)",
        fg: "var(--avoro-status-success-fg)",
        border: "var(--avoro-status-success-fg)",
    },
    warning: {
        bg: "var(--avoro-status-warning-bg)",
        fg: "var(--avoro-status-warning-fg)",
        border: "var(--avoro-status-warning-fg)",
    },
    error: {
        bg: "var(--avoro-status-error-bg)",
        fg: "var(--avoro-status-error-fg)",
        border: "var(--avoro-status-error-fg)",
    },
};
export const Toast = forwardRef(({ tone = "success", message, onDismiss, duration = 4000, className = "", style, ...rest }, ref) => {
    // Auto-dismiss after `duration` (default 4s)
    useEffect(() => {
        if (!onDismiss || duration <= 0)
            return;
        const timer = setTimeout(onDismiss, duration);
        return () => clearTimeout(timer);
    }, [onDismiss, duration]);
    const toneStyle = toneStyles[tone];
    const baseStyles = {
        display: "flex",
        alignItems: "center",
        gap: "var(--avoro-space-3)",
        padding: "var(--avoro-space-3) var(--avoro-space-4)",
        backgroundColor: "var(--avoro-surface-card)",
        border: "1px solid var(--avoro-border-default)",
        borderLeft: "4px solid",
        borderLeftColor: toneStyle.border,
        borderRadius: "var(--avoro-radius-md)",
        boxShadow: "var(--avoro-shadow-md)",
        fontFamily: "var(--avoro-font-sans)",
        fontSize: "var(--avoro-size-body-sm)",
        color: "var(--avoro-text-primary)",
        ...style,
    };
    const indicatorStyles = {
        flexShrink: 0,
        width: "8px",
        height: "8px",
        borderRadius: "var(--avoro-radius-pill)",
        backgroundColor: toneStyle.fg,
    };
    return (_jsxs("div", { ref: ref, role: "status", "aria-live": "polite", className: className, style: baseStyles, ...rest, children: [_jsx("span", { style: indicatorStyles, "aria-hidden": "true" }), _jsx("span", { children: message })] }));
});
Toast.displayName = "Toast";
