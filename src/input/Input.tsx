import { forwardRef, type InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
}

const labelStyles: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--avoro-font-display)",
  fontSize: "var(--avoro-size-body-sm)",
  fontWeight: 500,
  color: "var(--avoro-text-primary)",
  marginBottom: "var(--avoro-space-2)",
};

const inputBaseStyles: React.CSSProperties = {
  display: "block",
  width: "100%",
  height: "var(--avoro-component-input-height)",
  paddingLeft: "var(--avoro-component-input-padding-x)",
  paddingRight: "var(--avoro-component-input-padding-x)",
  fontFamily: "var(--avoro-font-sans)",
  fontSize: "var(--avoro-size-body)",
  color: "var(--avoro-text-primary)",
  backgroundColor: "var(--avoro-surface-card)",
  border: "var(--avoro-component-input-border-width) solid var(--avoro-border-default)",
  borderRadius: "var(--avoro-component-input-radius)",
  outline: "none",
  transition:
    "border-color var(--avoro-duration-fast) var(--avoro-easing-standard), box-shadow var(--avoro-duration-fast) var(--avoro-easing-standard)",
};

const hintStyles: React.CSSProperties = {
  fontFamily: "var(--avoro-font-sans)",
  fontSize: "var(--avoro-size-caption)",
  color: "var(--avoro-text-muted)",
  marginTop: "var(--avoro-space-2)",
};

const errorStyles: React.CSSProperties = {
  fontFamily: "var(--avoro-font-sans)",
  fontSize: "var(--avoro-size-caption)",
  color: "var(--avoro-status-error-fg)",
  marginTop: "var(--avoro-space-2)",
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      hint,
      error,
      disabled = false,
      id,
      className = "",
      style,
      ...rest
    },
    ref
  ) => {
    const inputId = id ?? `avoro-input-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    const hintId = hint ? `${inputId}-hint` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;
    const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

    const stateStyles: React.CSSProperties = disabled
      ? {
          backgroundColor: "var(--avoro-interactive-disabled-bg)",
          color: "var(--avoro-interactive-disabled-fg)",
          cursor: "not-allowed",
        }
      : error
        ? {
            borderColor: "var(--avoro-status-error-fg)",
          }
        : {};

    return (
      <div className={className} style={style}>
        <label htmlFor={inputId} style={labelStyles}>
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={describedBy}
          style={{ ...inputBaseStyles, ...stateStyles }}
          onFocus={(e) => {
            if (!disabled) {
              e.currentTarget.style.borderColor = error
                ? "var(--avoro-status-error-fg)"
                : "var(--avoro-border-focus)";
              e.currentTarget.style.boxShadow = "var(--avoro-focus-ring)";
            }
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = error
              ? "var(--avoro-status-error-fg)"
              : "var(--avoro-border-default)";
            e.currentTarget.style.boxShadow = "none";
            rest.onBlur?.(e);
          }}
          {...rest}
        />
        {error && (
          <p id={errorId} role="alert" style={errorStyles}>
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={hintId} style={hintStyles}>
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
