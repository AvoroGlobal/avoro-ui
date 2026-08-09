import {
  forwardRef,
  useEffect,
  type HTMLAttributes,
} from "react";

export type ToastTone = "success" | "warning" | "error";

export interface ToastProps extends HTMLAttributes<HTMLDivElement> {
  tone?: ToastTone;
  message: string;
  onDismiss?: () => void;
  /** Auto-dismiss delay in ms. Defaults to 4000. Pass 0 to disable. */
  duration?: number;
}

const toneStyles: Record<ToastTone, { bg: string; fg: string; border: string }> = {
  success: {
    bg: "var(--avoro-status-success-bg)",
    fg: "var(--avoro-status-success-fg)",
    border: "var(--avoro-status-success-fg)",
  },
  warning: {
    bg: "var(--avoro-status-warning-bg)",
    fg: "var(--avoro-status-warning-fg)",
    border: "var(--avoro-status-warning-fg)",
  },
  error: {
    bg: "var(--avoro-status-error-bg)",
    fg: "var(--avoro-status-error-fg)",
    border: "var(--avoro-status-error-fg)",
  },
};

export const Toast = forwardRef<HTMLDivElement, ToastProps>(
  (
    { tone = "success", message, onDismiss, duration = 4000, className = "", style, ...rest },
    ref
  ) => {
    // Auto-dismiss after `duration` (default 4s)
    useEffect(() => {
      if (!onDismiss || duration <= 0) return;
      const timer = setTimeout(onDismiss, duration);
      return () => clearTimeout(timer);
    }, [onDismiss, duration]);

    const toneStyle = toneStyles[tone];

    const baseStyles: React.CSSProperties = {
      display: "flex",
      alignItems: "center",
      gap: "var(--avoro-space-3)",
      padding: "var(--avoro-space-3) var(--avoro-space-4)",
      backgroundColor: "var(--avoro-surface-card)",
      border: "1px solid var(--avoro-border-default)",
      borderLeft: "4px solid",
      borderLeftColor: toneStyle.border,
      borderRadius: "var(--avoro-radius-md)",
      boxShadow: "var(--avoro-shadow-md)",
      fontFamily: "var(--avoro-font-sans)",
      fontSize: "var(--avoro-size-body-sm)",
      color: "var(--avoro-text-primary)",
      ...style,
    };

    const indicatorStyles: React.CSSProperties = {
      flexShrink: 0,
      width: "8px",
      height: "8px",
      borderRadius: "var(--avoro-radius-pill)",
      backgroundColor: toneStyle.fg,
    };

    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        className={className}
        style={baseStyles}
        {...rest}
      >
        <span style={indicatorStyles} aria-hidden="true" />
        <span>{message}</span>
      </div>
    );
  }
);

Toast.displayName = "Toast";
