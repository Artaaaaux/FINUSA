import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white shadow-[0_8px_24px_-12px_rgba(37,99,235,0.7)] hover:-translate-y-0.5 hover:bg-[#1D4ED8] hover:shadow-[0_12px_28px_-12px_rgba(37,99,235,0.75)]",
  secondary:
    "border border-[var(--card-border)] bg-[var(--card)] text-[var(--text-1)] shadow-[0_4px_16px_-10px_rgba(15,23,42,0.3)] hover:-translate-y-0.5 hover:border-primary/30 hover:bg-[var(--surface)]",
  ghost: "text-[var(--text-2)] hover:bg-[var(--surface)] hover:text-[var(--text-1)]",
};

export function Button({ className = "", variant = "primary", ...props }: ButtonProps) {
  const base =
    "inline-flex min-h-11 items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50";
  return <button className={`${base} ${variantClasses[variant]} ${className}`.trim()} {...props} />;
}
