import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "danger-soft";

export type ButtonSize = "sm" | "md" | "lg";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary-500 text-text-on-primary hover:bg-primary-hover focus-visible:outline-primary-500",
  secondary:
    "bg-secondary-100 text-primary-900 hover:bg-secondary-200 focus-visible:outline-primary-500",
  outline:
    "border border-primary-500 text-primary-900 bg-transparent hover:bg-secondary-100 focus-visible:outline-primary-500",
  ghost:
    "bg-transparent text-text-muted hover:bg-line hover:text-text-primary focus-visible:outline-primary-500",
  danger:
    "bg-danger text-text-on-primary hover:bg-danger-hover focus-visible:outline-danger",
  "danger-soft":
    "bg-danger-bg text-danger hover:bg-danger hover:text-text-on-primary focus-visible:outline-danger",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "text-label gap-1.5 px-3 py-1.5 rounded-lg",
  md: "text-body gap-2 px-4 py-2.5 rounded-xl",
  lg: "text-h2 gap-2.5 px-6 py-3 rounded-2xl",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Stretch to the width of the parent. */
  fullWidth?: boolean;
  /** Show a spinner and block clicks. */
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  leftIcon,
  rightIcon,
  disabled,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center font-medium transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {loading ? <Spinner /> : leftIcon}
      {children}
      {rightIcon}
    </button>
  );
}

function Spinner() {
  return (
    <svg
      className="size-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        opacity="0.25"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}
