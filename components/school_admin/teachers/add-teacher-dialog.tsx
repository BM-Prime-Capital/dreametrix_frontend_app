"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {  Mail, GraduationCap, Clock, User } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import { generalImages } from "@/constants/images"

export function AddTeacherDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex gap-2 items-center text-lg bg-blue-500 hover:bg-blue-600 rounded-md px-2 py-4 lg:px-4 lg:py-6">
          <Image
            src={generalImages.add}
            alt="add"
            width={100}
            height={100}
            className="w-8 h-8"
          />
          <span>Add New Teacher</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-500">TEACHERS</DialogTitle>
        </DialogHeader>
        <div className="flex flex-wrap gap-4 py-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Input className="rounded-full pl-9" placeholder="Full Name" />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Input className="rounded-full pl-9" placeholder="Email" />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Input className="rounded-full pl-9" placeholder="Subjects" />
              <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Input className="rounded-full pl-9" placeholder="Grades" />
              <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Input className="rounded-full pl-9" placeholder="Shift" />
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
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