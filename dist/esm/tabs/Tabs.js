import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef, useRef } from "react";
const listStyles = {
    display: "flex",
    gap: "var(--avoro-space-1)",
    borderBottom: "1px solid var(--avoro-border-default)",
};
function tabBaseStyles(selected, disabled) {
    return {
        appearance: "none",
        background: "none",
        border: "none",
        borderBottom: "2px solid",
        borderBottomColor: selected ? "var(--avoro-interactive-primary-bg)" : "transparent",
        padding: "var(--avoro-space-2) var(--avoro-space-4)",
        marginBottom: "-1px",
        fontFamily: "var(--avoro-font-display)",
        fontSize: "var(--avoro-size-body-sm)",
        fontWeight: selected ? 600 : 500,
        color: disabled
            ? "var(--avoro-interactive-disabled-fg)"
            : selected
                ? "var(--avoro-text-primary)"
                : "var(--avoro-text-muted)",
        cursor: disabled ? "not-allowed" : "pointer",
        outline: "none",
        transition: "color var(--avoro-duration-fast) var(--avoro-easing-standard), border-color var(--avoro-duration-fast) var(--avoro-easing-standard)",
    };
}
export const Tabs = forwardRef(({ tabs, value, onChange, className = "", style, ...rest }, ref) => {
    const tabRefs = useRef([]);
    const enabledIndexes = tabs
        .map((tab, i) => (tab.disabled ? -1 : i))
        .filter((i) => i >= 0);
    function focusAndActivate(index) {
        const tab = tabs[index];
        if (!tab || tab.disabled)
            return;
        tabRefs.current[index]?.focus();
        // Activation follows focus
        onChange(tab.value);
    }
    function onListKeyDown(e) {
        const currentIndex = tabRefs.current.findIndex((el) => el === document.activeElement);
        if (currentIndex === -1)
            return;
        const currentEnabledPos = enabledIndexes.indexOf(currentIndex);
        let targetIndex = null;
        if (e.key === "ArrowRight") {
            const nextPos = (currentEnabledPos + 1) % enabledIndexes.length;
            targetIndex = enabledIndexes[nextPos];
        }
        else if (e.key === "ArrowLeft") {
            const prevPos = (currentEnabledPos - 1 + enabledIndexes.length) % enabledIndexes.length;
            targetIndex = enabledIndexes[prevPos];
        }
        else if (e.key === "Home") {
            targetIndex = enabledIndexes[0];
        }
        else if (e.key === "End") {
            targetIndex = enabledIndexes[enabledIndexes.length - 1];
        }
        if (targetIndex !== null) {
            e.preventDefault();
            focusAndActivate(targetIndex);
        }
    }
    return (_jsx("div", { ref: ref, role: "tablist", className: className, style: { ...listStyles, ...style }, onKeyDown: onListKeyDown, ...rest, children: tabs.map((tab, i) => {
            const selected = tab.value === value;
            const disabled = tab.disabled ?? false;
            return (_jsx("button", { ref: (el) => {
                    tabRefs.current[i] = el;
                }, type: "button", role: "tab", "aria-selected": selected, "aria-disabled": disabled || undefined, tabIndex: selected ? 0 : -1, disabled: disabled, style: tabBaseStyles(selected, disabled), onClick: () => {
                    if (!disabled)
                        onChange(tab.value);
                }, onFocus: (e) => {
                    e.currentTarget.style.boxShadow = "var(--avoro-focus-ring)";
                }, onBlur: (e) => {
                    e.currentTarget.style.boxShadow = "none";
                }, onMouseEnter: (e) => {
                    if (!disabled && !selected) {
                        e.currentTarget.style.color = "var(--avoro-text-primary)";
                    }
                }, onMouseLeave: (e) => {
                    if (!disabled && !selected) {
                        e.currentTarget.style.color = "var(--avoro-text-muted)";
                    }
                }, children: tab.label }, tab.value));
        }) }));
});
Tabs.displayName = "Tabs";
