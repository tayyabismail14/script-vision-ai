import { Sparkles } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 surface-glass">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-md">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold tracking-tight">ScriptVision</span>
        </div>
        <nav className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">AI-Powered Visual Generation</span>
        </nav>
      </div>
    </header>
  );
}
