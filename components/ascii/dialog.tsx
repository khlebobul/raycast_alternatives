"use client";

import { useEffect } from "react";

interface DialogProps {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
}

export function Dialog({ children, onClose, title }: DialogProps) {
  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section aria-modal="true" role="dialog" aria-labelledby="dialog-title" className="flex max-h-[85vh] w-full max-w-2xl flex-col border border-border bg-card">
        <header className="flex items-start justify-between border-b border-border px-4 py-3">
          <h2 id="dialog-title" className="text-sm font-bold">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="text-muted-foreground hover:text-foreground">[x]</button>
        </header>
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
        <footer className="border-t border-border px-4 py-2 text-xs text-muted-foreground">press [esc] to close</footer>
      </section>
    </div>
  );
}
