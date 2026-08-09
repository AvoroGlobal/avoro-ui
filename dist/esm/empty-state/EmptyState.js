import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from "react";
import { AIcon } from "@avoroglobal/icons";
export const EmptyState = forwardRef(({ icon, title, body, action, className = "", style, ...rest }, ref) => {
    const baseStyles = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "var(--avoro-space-8) var(--avoro-space-6)",
        fontFamily: "var(--avoro-font-sans)",
        ...style,
    };
    const iconStyles = {
        color: "var(--avoro-text-muted)",
        marginBottom: "var(--avoro-space-4)",
    };
    const titleStyles = {
        fontFamily: "var(--avoro-font-display)",
        fontSize: "var(--avoro-size-h4)",
        fontWeight: 600,
        lineHeight: "var(--avoro-leading-h4)",
        color: "var(--avoro-text-primary)",
        marginBottom: body ? "var(--avoro-space-2)" : 0,
    };
    const bodyStyles = {
        fontSize: "var(--avoro-size-body-sm)",
        color: "var(--avoro-text-muted)",
        maxWidth: "40ch",
        marginBottom: action ? "var(--avoro-space-5)" : 0,
    };
    return (_jsxs("div", { ref: ref, className: className, style: baseStyles, ...rest, children: [_jsx("div", { style: iconStyles, children: _jsx(AIcon, { name: icon, size: 32 }) }), _jsx("div", { style: titleStyles, children: title }), body && _jsx("div", { style: bodyStyles, children: body }), action] }));
});
EmptyState.displayName = "EmptyState";
