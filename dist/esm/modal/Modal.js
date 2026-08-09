import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { forwardRef, useEffect, useRef, } from "react";
const FOCUSABLE = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
export const Modal = forwardRef(({ open, onClose, title, children, className = "", style, ...rest }, ref) => {
    const dialogRef = useRef(null);
    const previousFocusRef = useRef(null);
    // Focus trap + Escape handling + restore focus on close
    useEffect(() => {
        if (!open)
            return;
        previousFocusRef.current = document.activeElement;
        const dialog = dialogRef.current;
        const focusables = dialog?.querySelectorAll(FOCUSABLE);
        focusables?.[0]?.focus();
        function onKeyDown(e) {
            if (e.key === "Escape") {
                e.stopPropagation();
                onClose();
                return;
            }
            if (e.key !== "Tab" || !dialog)
                return;
            const items = Array.from(dialog.querySelectorAll(FOCUSABLE)).filter((el) => el.offsetParent !== null);
            if (items.length === 0) {
                e.preventDefault();
                return;
            }
            const first = items[0];
            const last = items[items.length - 1];
            const active = document.activeElement;
            if (e.shiftKey && active === first) {
                e.preventDefault();
                last.focus();
            }
            else if (!e.shiftKey && active === last) {
                e.preventDefault();
                first.focus();
            }
            else if (!dialog.contains(active)) {
                e.preventDefault();
                first.focus();
            }
        }
        document.addEventListener("keydown", onKeyDown, true);
        return () => {
            document.removeEventListener("keydown", onKeyDown, true);
            if (previousFocusRef.current instanceof HTMLElement) {
                previousFocusRef.current.focus();
            }
        };
    }, [open, onClose]);
    if (!open)
        return null;
    const backdropStyles = {
        position: "fixed",
        inset: 0,
        backgroundColor: "var(--avoro-ink)",
        opacity: 0.5,
        zIndex: 40,
    };
    const dialogStyles = {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 50,
        width: "calc(100% - var(--avoro-space-6) * 2)",
        maxWidth: "var(--avoro-component-modal-max-width)",
        backgroundColor: "var(--avoro-surface-card)",
        borderRadius: "var(--avoro-component-modal-radius)",
        padding: "var(--avoro-component-modal-padding)",
        boxShadow: "var(--avoro-shadow-lg)",
        color: "var(--avoro-text-primary)",
        fontFamily: "var(--avoro-font-sans)",
        outline: "none",
        ...style,
    };
    const titleStyles = {
        fontFamily: "var(--avoro-font-display)",
        fontSize: "var(--avoro-size-h3)",
        fontWeight: 600,
        lineHeight: "var(--avoro-leading-h3)",
        marginBottom: "var(--avoro-space-4)",
    };
    return (_jsxs(_Fragment, { children: [_jsx("div", { style: backdropStyles, onClick: onClose, "aria-hidden": "true" }), _jsxs("div", { ref: (node) => {
                    dialogRef.current = node;
                    if (typeof ref === "function")
                        ref(node);
                    else if (ref)
                        ref.current = node;
                }, role: "dialog", "aria-modal": "true", "aria-label": title, tabIndex: -1, className: className, style: dialogStyles, ...rest, children: [_jsx("div", { style: titleStyles, children: title }), children] })] }));
});
Modal.displayName = "Modal";
