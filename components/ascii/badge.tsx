interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "primary" | "outline";
}

export function Badge({ children, variant = "default" }: BadgeProps) {
  return (
    <span className={`ascii-badge ascii-badge-${variant}`}>
      <span aria-hidden="true">[</span><span>{children}</span><span aria-hidden="true">]</span>
    </span>
  );
}
