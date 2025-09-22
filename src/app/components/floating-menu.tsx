
"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface FloatingMenuProps {
  onOpenAddForm: () => void;
}

export default function FloatingMenu({ onOpenAddForm }: FloatingMenuProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-4 flex justify-center pointer-events-none">
      <div className="pointer-events-auto">
        <Button
          onClick={onOpenAddForm}
          className="rounded-full shadow-2xl shadow-primary/40 h-16 px-8 text-lg"
          size="lg"
        >
          <PlusCircle className="mr-3 h-6 w-6" /> Log New Workout
        </Button>
      </div>
    </div>
  );
}
