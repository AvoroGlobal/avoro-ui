import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from "react";
import { AIcon } from "@avoroglobal/icons";
const sizeStyles = {
    sm: { height: "32px", paddingX: "12px", gap: "8px", fontSize: "14px" },
    md: { height: "40px", paddingX: "16px", gap: "8px", fontSize: "15px" },
    lg: { height: "48px", paddingX: "20px", gap: "8px", fontSize: "16px" },
};
const variantStyles = {
    primary: {
        bg: "var(--avoro-interactive-primary-bg)",
        fg: "var(--avoro-interactive-primary-fg)",
        border: "none",
        hoverBg: "var(--avoro-interactive-primary-hover)",
        activeBg: "var(--avoro-interactive-primary-active)",
        activeFg: "var(--avoro-interactive-primary-active-fg)",
    },
    secondary: {
        bg: "transparent",
        fg: "var(--avoro-interactive-secondary-fg)",
        border: "1px solid var(--avoro-border-default)",
        hoverBg: "var(--avoro-interactive-secondary-hover-bg)",
    },
    ghost: {
        bg: "transparent",
        fg: "var(--avoro-text-primary)",
        border: "none",
        hoverBg: "var(--avoro-interactive-secondary-hover-bg)",
    },
    inverse: {
        bg: "var(--avoro-surface-flip)",
        fg: "var(--avoro-text-inverse)",
        border: "none",
        hoverBg: "var(--avoro-surface-flip)",
    },
};
const disabledStyles = {
    bg: "var(--avoro-interactive-disabled-bg)",
    fg: "var(--avoro-interactive-disabled-fg)",
};
function Spinner() {
    return (_jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", style: { animation: "avoro-spin 0.6s linear infinite" }, "aria-hidden": "true", children: _jsx("path", { d: "M21 12a9 9 0 1 1-6.219-8.56" }) }));
}
export const Button = forwardRef(({ variant = "primary", size = "md", loading = false, icon, disabled = false, children, className = "", style, ...rest }, ref) => {
    const isDisabled = disabled || loading;
    const sizeStyle = sizeStyles[size];
    const variantStyle = variantStyles[variant];
    const baseStyles = {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: sizeStyle.gap,
        height: sizeStyle.height,
        paddingLeft: sizeStyle.paddingX,
        paddingRight: sizeStyle.paddingX,
        fontSize: sizeStyle.fontSize,
        fontWeight: 500,
        fontFamily: "var(--avoro-font-display)",
        borderRadius: "var(--avoro-radius-md)",
        cursor: isDisabled ? "not-allowed" : "pointer",
        transition: "background-color var(--avoro-duration-fast) var(--avoro-easing-default), color var(--avoro-duration-fast) var(--avoro-easing-default), border-color var(--avoro-duration-fast) var(--avoro-easing-default)",
        outline: "none",
        ...style,
    };
    const stateStyles = isDisabled
        ? {
            backgroundColor: disabledStyles.bg,
            color: disabledStyles.fg,
            border: variantStyle.border === "none" ? "none" : variantStyle.border,
            pointerEvents: "none",
        }
        : {
            backgroundColor: variantStyle.bg,
            color: variantStyle.fg,
            border: variantStyle.border,
        };
    const focusStyles = {
        boxShadow: "var(--avoro-focus-ring)",
    };
    return (_jsxs("button", { ref: ref, type: "button", disabled: isDisabled, "aria-busy": loading ? "true" : undefined, className: className, style: { ...baseStyles, ...stateStyles }, onFocus: (e) => {
            Object.assign(e.currentTarget.style, focusStyles);
            rest.onFocus?.(e);
        }, onBlur: (e) => {
            e.currentTarget.style.boxShadow = "none";
            rest.onBlur?.(e);
        }, onMouseEnter: (e) => {
            if (!isDisabled) {
                e.currentTarget.style.backgroundColor = variantStyle.hoverBg;
                if (variantStyle.activeFg) {
                    e.currentTarget.style.color = variantStyle.activeFg;
                }
            }
            rest.onMouseEnter?.(e);
        }, onMouseLeave: (e) => {
            if (!isDisabled) {
                e.currentTarget.style.backgroundColor = variantStyle.bg;
                e.currentTarget.style.color = variantStyle.fg;
            }
            rest.onMouseLeave?.(e);
        }, ...rest, children: [loading && _jsx(Spinner, {}), !loading && icon && _jsx(AIcon, { name: icon, size: size === "sm" ? 16 : size === "md" ? 20 : 24 }), children] }));
});
Button.displayName = "Button";
