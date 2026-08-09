import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { AIcon, type IconName } from "@avoroglobal/icons";

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  icon: IconName;
  title: string;
  body?: string;
  /** A Button element, e.g. <Button variant="secondary">Retry</Button> */
  action?: ReactNode;
}

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ icon, title, body, action, className = "", style, ...rest }, ref) => {
    const baseStyles: React.CSSProperties = {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "var(--avoro-space-8) var(--avoro-space-6)",
      fontFamily: "var(--avoro-font-sans)",
      ...style,
    };

    const iconStyles: React.CSSProperties = {
      color: "var(--avoro-text-muted)",
      marginBottom: "var(--avoro-space-4)",
    };

    const titleStyles: React.CSSProperties = {
      fontFamily: "var(--avoro-font-display)",
      fontSize: "var(--avoro-size-h4)",
      fontWeight: 600,
      lineHeight: "var(--avoro-leading-h4)",
      color: "var(--avoro-text-primary)",
      marginBottom: body ? "var(--avoro-space-2)" : 0,
    };

    const bodyStyles: React.CSSProperties = {
      fontSize: "var(--avoro-size-body-sm)",
      color: "var(--avoro-text-muted)",
      maxWidth: "40ch",
      marginBottom: action ? "var(--avoro-space-5)" : 0,
    };

    return (
      <div ref={ref} className={className} style={baseStyles} {...rest}>
        <div style={iconStyles}>
          <AIcon name={icon} size={32} />
        </div>
        <div style={titleStyles}>{title}</div>
        {body && <div style={bodyStyles}>{body}</div>}
        {action}
      </div>
    );
  }
);

EmptyState.displayName = "EmptyState";
