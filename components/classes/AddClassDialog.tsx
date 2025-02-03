"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Calendar, Users } from "lucide-react"
import { useState } from "react"

export function AddClassDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-500 hover:bg-blue-600 text-white gap-2">
          <Plus className="h-4 w-4" />
          Add New Class
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-500">CLASSES</DialogTitle>
        </DialogHeader>
        <div className="flex flex-wrap gap-4 py-4">
          <div className="flex-1 min-w-[200px]">
            <Input className="rounded-full" placeholder="Class" />
          </div>
          <div className="flex-1 min-w-[200px]">
            <Input className="rounded-full" placeholder="Sublet" />
          </div>
          <div className="flex-1 min-w-[200px]">
            <Input className="rounded-full" placeholder="Grade" />
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Input className="rounded-full pl-9" placeholder="Students" />
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Input className="rounded-full pl-9" placeholder="Date" />
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">
            APPLY
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}