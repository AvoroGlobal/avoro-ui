import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
const SHIMMER = "avoro-skeleton-pulse var(--avoro-duration-base) var(--avoro-easing-standard) infinite alternate";
function blockStyles(extra) {
    return {
        backgroundColor: "var(--avoro-surface-subtle)",
        animation: SHIMMER,
        ...extra,
    };
}
export const Skeleton = forwardRef(({ lines = 3, shape = "text", className = "", style, ...rest }, ref) => {
    if (shape === "avatar") {
        return (_jsx("div", { ref: ref, "aria-hidden": "true", className: className, style: blockStyles({
                width: "40px",
                height: "40px",
                borderRadius: "var(--avoro-radius-pill)",
                ...style,
            }), ...rest }));
    }
    if (shape === "card") {
        return (_jsx("div", { ref: ref, "aria-hidden": "true", className: className, style: blockStyles({
                width: "100%",
                height: "120px",
                borderRadius: "var(--avoro-component-card-radius)",
                ...style,
            }), ...rest }));
    }
    // shape === "text"
    return (_jsx("div", { ref: ref, "aria-hidden": "true", className: className, style: {
            display: "flex",
            flexDirection: "column",
            gap: "var(--avoro-space-2)",
            width: "100%",
            ...style,
        }, ...rest, children: Array.from({ length: lines }).map((_, i) => (_jsx("div", { style: blockStyles({
                height: "12px",
                borderRadius: "var(--avoro-radius-sm)",
                // Last line is shorter, like a paragraph tail
                width: i === lines - 1 && lines > 1 ? "60%" : "100%",
            }) }, i))) }));
});
Skeleton.displayName = "Skeleton";
