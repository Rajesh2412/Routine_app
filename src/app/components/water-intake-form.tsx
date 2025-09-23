
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface WaterIntakeFormProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addWater: (quantity: number) => void;
}

export default function WaterIntakeForm({
  isOpen,
  setIsOpen,
  addWater,
}: WaterIntakeFormProps) {
  const [quantity, setQuantity] = useState("");

  const handleSubmit = () => {
    const amount = parseInt(quantity, 10);
    if (!isNaN(amount) && amount > 0) {
      addWater(amount);
      setQuantity("");
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log Water Intake</DialogTitle>
          <DialogDescription>
            Enter the amount of water you drank in milliliters (ml).
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input
            type="number"
            placeholder="e.g., 250"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full"
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Add Intake</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
