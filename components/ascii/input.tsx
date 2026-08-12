"use client";

import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: string;
  onClear?: () => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ icon, onClear, className = "", ...props }, ref) => (
  <div className="relative w-full">
    {icon && <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>}
    <input
      ref={ref}
      className={`w-full border border-input bg-transparent px-3 py-2 text-sm outline-none transition-colors hover:border-ring/50 focus:border-ring focus:ring-1 focus:ring-ring ${icon ? "pl-8" : ""} ${onClear ? "pr-12" : ""} ${className}`}
      {...props}
    />
    {onClear && props.value && (
      <button type="button" className="input-clear" onClick={onClear} aria-label="Clear search">[x]</button>
    )}
  </div>
));

Input.displayName = "Input";
export { Input };
