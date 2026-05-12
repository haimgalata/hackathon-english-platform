import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  elevated?: boolean;
};

export function Card({ children, className = "", glow = false, elevated = false }: Props) {
  return (
    <div
      className={`glass-card rounded-2xl ${glow ? "glow-primary" : ""} ${elevated ? "bg-surface-elevated" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
