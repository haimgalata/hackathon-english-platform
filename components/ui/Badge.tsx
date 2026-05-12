import { ReactNode } from "react";

type Variant = "primary" | "success" | "warning" | "ghost";

const variants: Record<Variant, string> = {
  primary: "bg-brand-primary/20 text-brand-secondary border-brand-primary/30",
  success: "bg-brand-success/20 text-brand-success border-brand-success/30",
  warning: "bg-brand-warning/20 text-brand-warning border-brand-warning/30",
  ghost: "bg-white/5 text-slate-400 border-white/10",
};

type Props = {
  children: ReactNode;
  variant?: Variant;
  className?: string;
};

export function Badge({ children, variant = "primary", className = "" }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
