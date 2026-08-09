import { forwardRef, type HTMLAttributes } from "react";

export type SkeletonShape = "text" | "card" | "avatar";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Number of text lines to render. Only used when shape="text". */
  lines?: number;
  shape?: SkeletonShape;
}

const SHIMMER =
  "avoro-skeleton-pulse var(--avoro-duration-base) var(--avoro-easing-standard) infinite alternate";

function blockStyles(extra: React.CSSProperties): React.CSSProperties {
  return {
    backgroundColor: "var(--avoro-surface-subtle)",
    animation: SHIMMER,
    ...extra,
  };
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ lines = 3, shape = "text", className = "", style, ...rest }, ref) => {
    if (shape === "avatar") {
      return (
        <div
          ref={ref}
          aria-hidden="true"
          className={className}
          style={blockStyles({
            width: "40px",
            height: "40px",
            borderRadius: "var(--avoro-radius-pill)",
            ...style,
          })}
          {...rest}
        />
      );
    }

    if (shape === "card") {
      return (
        <div
          ref={ref}
          aria-hidden="true"
          className={className}
          style={blockStyles({
            width: "100%",
            height: "120px",
            borderRadius: "var(--avoro-component-card-radius)",
            ...style,
          })}
          {...rest}
        />
      );
    }

    // shape === "text"
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={className}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--avoro-space-2)",
          width: "100%",
          ...style,
        }}
        {...rest}
      >
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            style={blockStyles({
              height: "12px",
              borderRadius: "var(--avoro-radius-sm)",
              // Last line is shorter, like a paragraph tail
              width: i === lines - 1 && lines > 1 ? "60%" : "100%",
            })}
          />
        ))}
      </div>
    );
  }
);

Skeleton.displayName = "Skeleton";
