import { Dumbbell } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Dumbbell className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            RajEsh's Routine
          </h1>
        </div>
      </div>
    </header>
  );
}
