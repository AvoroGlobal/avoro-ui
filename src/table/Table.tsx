import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { EmptyState } from "../empty-state/EmptyState.js";

export interface TableColumn<Row> {
  key: string;
  header: string;
  render?: (row: Row) => ReactNode;
  align?: "left" | "right" | "center";
}

export interface TableProps<Row> extends Omit<HTMLAttributes<HTMLTableElement>, "children"> {
  columns: TableColumn<Row>[];
  rows: Row[];
  loading?: boolean;
  empty?: boolean;
  error?: string;
}

const headerCellStyles: React.CSSProperties = {
  fontFamily: "var(--avoro-font-display)",
  fontSize: "var(--avoro-size-caption)",
  fontWeight: "var(--avoro-component-table-header-weight)" as unknown as number,
  color: "var(--avoro-text-muted)",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  textAlign: "left",
  padding: "var(--avoro-space-2) var(--avoro-component-table-cell-padding-x)",
  borderBottom: "1px solid var(--avoro-border-default)",
};

const cellStyles: React.CSSProperties = {
  fontFamily: "var(--avoro-font-sans)",
  fontSize: "var(--avoro-size-body-sm)",
  color: "var(--avoro-text-primary)",
  padding: "0 var(--avoro-component-table-cell-padding-x)",
  height: "var(--avoro-component-table-row-height)",
  borderBottom: "1px solid var(--avoro-border-default)",
};

// NOTE: loading/error render via internal placeholders; empty uses EmptyState.
// The loading skeleton is refactored to the real Skeleton component in its
// commit (Table is built before Skeleton per the build order).
function TablePlaceholder({ message, tone }: { message: string; tone: "muted" | "error" }) {
  return (
    <div
      style={{
        padding: "var(--avoro-space-6)",
        textAlign: "center",
        fontFamily: "var(--avoro-font-sans)",
        fontSize: "var(--avoro-size-body-sm)",
        color: tone === "error" ? "var(--avoro-status-error-fg)" : "var(--avoro-text-muted)",
      }}
    >
      {message}
    </div>
  );
}

function TableSkeletonRows({ columnCount }: { columnCount: number }) {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <tr key={i} aria-hidden="true">
          {Array.from({ length: columnCount }).map((_, j) => (
            <td key={j} style={cellStyles}>
              <div
                style={{
                  height: "12px",
                  borderRadius: "var(--avoro-radius-sm)",
                  backgroundColor: "var(--avoro-surface-subtle)",
                  animation:
                    "avoro-skeleton-pulse var(--avoro-duration-base) var(--avoro-easing-standard) infinite alternate",
                }}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export const Table = forwardRef(
  <Row extends Record<string, unknown> = Record<string, unknown>>(
    { columns, rows, loading = false, empty = false, error, className = "", style, ...rest }: TableProps<Row>,
    ref: React.ForwardedRef<HTMLTableElement>
  ) => {
    const wrapperStyles: React.CSSProperties = {
      width: "100%",
      overflowX: "auto",
      border: "1px solid var(--avoro-border-default)",
      borderRadius: "var(--avoro-component-card-radius)",
      backgroundColor: "var(--avoro-surface-card)",
    };

    const tableStyles: React.CSSProperties = {
      width: "100%",
      borderCollapse: "collapse",
      ...style,
    };

    const showPlaceholder = error != null || empty || loading;

    return (
      <div style={wrapperStyles}>
        <table ref={ref} className={className} style={tableStyles} {...rest}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{ ...headerCellStyles, textAlign: col.align ?? "left" }}
                  scope="col"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          {loading && (
            <tbody>
              <TableSkeletonRows columnCount={columns.length} />
            </tbody>
          )}
          {!loading && !showPlaceholder && (
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={i}
                  style={{ transition: "background-color var(--avoro-duration-fast) var(--avoro-easing-standard)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--avoro-interactive-secondary-hover-bg)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  {columns.map((col) => (
                    <td key={col.key} style={{ ...cellStyles, textAlign: col.align ?? "left" }}>
                      {col.render ? col.render(row) : (row[col.key] as ReactNode)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          )}
        </table>
        {error != null && <TablePlaceholder message={error} tone="error" />}
        {error == null && empty && !loading && (
          <EmptyState
            icon="search"
            title="No data yet"
          />
        )}
      </div>
    );
  }
) as <Row extends Record<string, unknown> = Record<string, unknown>>(
  props: TableProps<Row> & { ref?: React.ForwardedRef<HTMLTableElement> }
) => React.ReactElement;

(Table as { displayName?: string }).displayName = "Table";
