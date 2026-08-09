import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from "react";
import { EmptyState } from "../empty-state/EmptyState.js";
import { Skeleton } from "../skeleton/Skeleton.js";
import { Button } from "../button/Button.js";
const headerCellStyles = {
    fontFamily: "var(--avoro-font-display)",
    fontSize: "var(--avoro-size-caption)",
    fontWeight: "var(--avoro-component-table-header-weight)",
    color: "var(--avoro-text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    textAlign: "left",
    padding: "var(--avoro-space-2) var(--avoro-component-table-cell-padding-x)",
    borderBottom: "1px solid var(--avoro-border-default)",
};
const cellStyles = {
    fontFamily: "var(--avoro-font-sans)",
    fontSize: "var(--avoro-size-body-sm)",
    color: "var(--avoro-text-primary)",
    padding: "0 var(--avoro-component-table-cell-padding-x)",
    height: "var(--avoro-component-table-row-height)",
    borderBottom: "1px solid var(--avoro-border-default)",
};
// NOTE: empty renders via EmptyState and loading via Skeleton. Error stays an
// inline placeholder (error tone is not an EmptyState concern).
function TablePlaceholder({ message, tone }) {
    return (_jsx("div", { style: {
            padding: "var(--avoro-space-6)",
            textAlign: "center",
            fontFamily: "var(--avoro-font-sans)",
            fontSize: "var(--avoro-size-body-sm)",
            color: tone === "error" ? "var(--avoro-status-error-fg)" : "var(--avoro-text-muted)",
        }, children: message }));
}
function TableSkeletonRows({ columnCount }) {
    return (_jsx(_Fragment, { children: [0, 1, 2].map((i) => (_jsx("tr", { "aria-hidden": "true", children: Array.from({ length: columnCount }).map((_, j) => (_jsx("td", { style: cellStyles, children: _jsx(Skeleton, { shape: "text", lines: 1 }) }, j))) }, i))) }));
}
export const Table = forwardRef(({ columns, rows, loading = false, empty = false, error, onRetry, className = "", style, ...rest }, ref) => {
    const wrapperStyles = {
        width: "100%",
        overflowX: "auto",
        border: "1px solid var(--avoro-border-default)",
        borderRadius: "var(--avoro-component-card-radius)",
        backgroundColor: "var(--avoro-surface-card)",
    };
    const tableStyles = {
        width: "100%",
        borderCollapse: "collapse",
        ...style,
    };
    const showPlaceholder = error != null || empty || loading;
    return (_jsxs("div", { style: wrapperStyles, children: [_jsxs("table", { ref: ref, className: className, style: tableStyles, ...rest, children: [_jsx("thead", { children: _jsx("tr", { children: columns.map((col) => (_jsx("th", { style: { ...headerCellStyles, textAlign: col.align ?? "left" }, scope: "col", children: col.header }, col.key))) }) }), loading && (_jsx("tbody", { children: _jsx(TableSkeletonRows, { columnCount: columns.length }) })), !loading && !showPlaceholder && (_jsx("tbody", { children: rows.map((row, i) => (_jsx("tr", { style: { transition: "background-color var(--avoro-duration-fast) var(--avoro-easing-standard)" }, onMouseEnter: (e) => {
                                e.currentTarget.style.backgroundColor = "var(--avoro-interactive-secondary-hover-bg)";
                            }, onMouseLeave: (e) => {
                                e.currentTarget.style.backgroundColor = "transparent";
                            }, children: columns.map((col) => (_jsx("td", { style: { ...cellStyles, textAlign: col.align ?? "left" }, children: col.render ? col.render(row) : row[col.key] }, col.key))) }, i))) }))] }), error != null && (_jsxs("div", { children: [_jsx(TablePlaceholder, { message: error, tone: "error" }), onRetry && (_jsx("div", { style: { textAlign: "center", paddingBottom: "var(--avoro-space-5)" }, children: _jsx(Button, { variant: "secondary", onClick: onRetry, children: "Try again" }) }))] })), error == null && empty && !loading && (_jsx(EmptyState, { icon: "search", title: "No data yet" }))] }));
});
Table.displayName = "Table";
