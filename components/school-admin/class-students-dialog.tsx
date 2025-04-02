"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import ClassStudent from "./class-student"

export function ClassStudentsDialog({
  studentClassName,
}: {
  studentClassName: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="cursor-pointer">
        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-50">
          <Eye className="h-4 w-4 text-sky-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader className="pb-4" style={{ borderBottom: "solid 1px #eee" }}>
          <DialogTitle className="flex gap-2 items-center opacity-80">
            <span>Students</span>
            <span className="text-muted-foreground">{studentClassName}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <ClassStudent />
          <ClassStudent />
          <ClassStudent />
        </div>
      </DialogContent>
    </Dialog>
  )
}

