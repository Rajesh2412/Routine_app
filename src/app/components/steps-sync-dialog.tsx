
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface StepsSyncDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSync: (prompt: string) => void;
  isSyncing?: boolean;
}

export default function StepsSyncDialog({
  isOpen,
  setIsOpen,
  onSync,
  isSyncing,
}: StepsSyncDialogProps) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = () => {
    if (prompt.trim()) {
      onSync(prompt);
      // We don't close the dialog immediately, parent will handle it on success
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sync Steps from Watch</DialogTitle>
          <DialogDescription>
            Type what your smartwatch says to sync your steps for today. For example: "I walked 8,250 steps."
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            placeholder="e.g., Today I have 8,250 steps."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full"
            rows={3}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isSyncing}>
            {isSyncing ? "Syncing..." : "Sync Now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
