import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: string;
  interactive?: boolean;
  children?: ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    { padding, interactive = false, children, className = "", style, ...rest },
    ref
  ) => {
    const baseStyles: React.CSSProperties = {
      backgroundColor: "var(--avoro-surface-card)",
      border: "var(--avoro-component-card-border-width) solid var(--avoro-border-default)",
      borderRadius: "var(--avoro-component-card-radius)",
      padding: padding ?? "var(--avoro-component-card-padding)",
      color: "var(--avoro-text-primary)",
      fontFamily: "var(--avoro-font-sans)",
      outline: "none",
      transition:
        "border-color var(--avoro-duration-fast) var(--avoro-easing-standard), box-shadow var(--avoro-duration-fast) var(--avoro-easing-standard)",
      ...(interactive ? { cursor: "pointer" } : {}),
      ...style,
    };

    return (
      <div
        ref={ref}
        className={className}
        style={baseStyles}
        tabIndex={interactive ? 0 : undefined}
        role={interactive ? "button" : undefined}
        onFocus={(e) => {
          if (interactive) {
            e.currentTarget.style.boxShadow = "var(--avoro-focus-ring)";
          }
          rest.onFocus?.(e);
        }}
        onBlur={(e) => {
          if (interactive) {
            e.currentTarget.style.boxShadow = "none";
          }
          rest.onBlur?.(e);
        }}
        onMouseEnter={(e) => {
          if (interactive) {
            e.currentTarget.style.borderColor = "var(--avoro-border-strong)";
          }
          rest.onMouseEnter?.(e);
        }}
        onMouseLeave={(e) => {
          if (interactive) {
            e.currentTarget.style.borderColor = "var(--avoro-border-default)";
          }
          rest.onMouseLeave?.(e);
        }}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
