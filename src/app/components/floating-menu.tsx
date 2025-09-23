
"use client";

import { Button } from "@/components/ui/button";
import { Home, Plus, History } from "lucide-react";

interface FloatingMenuProps {
  onOpenAddForm: () => void;
  onShowHistory: () => void;
  onShowHome: () => void;
  showHistory: boolean;
}

export default function FloatingMenu({ 
    onOpenAddForm, 
    onShowHistory, 
    onShowHome,
    showHistory,
}: FloatingMenuProps) {

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-4 flex justify-center pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-secondary/90 p-2 shadow-2xl shadow-primary/30 backdrop-blur-sm">
        <Button
          onClick={onShowHome}
          variant="ghost"
          className={`rounded-full h-14 w-14 ${!showHistory ? 'bg-primary/20 text-primary' : ''}`}
        >
          <Home className="h-7 w-7" />
          <span className="sr-only">Home</span>
        </Button>
        <Button
          onClick={onShowHistory}
          variant="ghost"
          className={`rounded-full h-14 w-14 ${showHistory ? 'bg-primary/20 text-primary' : ''}`}
        >
          <History className="h-7 w-7" />
          <span className="sr-only">History</span>
        </Button>
        <Button
          onClick={onOpenAddForm}
          className="rounded-full h-16 w-16 text-lg"
          size="lg"
        >
          <Plus className="h-8 w-8" />
          <span className="sr-only">Log New Workout</span>
        </Button>
      </div>
    </div>
  );
}
