interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`ascii-card relative overflow-hidden border border-border bg-background ${className}`}>
      <div aria-hidden="true" className="ascii-pattern">░</div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
