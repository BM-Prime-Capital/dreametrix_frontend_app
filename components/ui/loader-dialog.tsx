"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Loader } from "./loader";

export function LoaderDialog({ shouldOpen }: { shouldOpen: boolean }) {
  return (
    <Dialog open={shouldOpen}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <Loader />
      </DialogContent>
    </Dialog>
  );
}
