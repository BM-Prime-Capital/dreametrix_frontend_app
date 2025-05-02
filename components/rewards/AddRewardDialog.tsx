"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import { useState } from "react";

export function AddRewardDialog({
  setRefreshTime,
  existingReward,
}: {
  setRefreshTime: () => void;
  existingReward?: any;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-green-50"
        >
          <Pencil className="h-4 w-4 text-green-500" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {existingReward ? "Edit Reward" : "Add New Reward"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Formulaire pour ajouter/modifier des récompenses */}
          <p>Reward form will go here</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}