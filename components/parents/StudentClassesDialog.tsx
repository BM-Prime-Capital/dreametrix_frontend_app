"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Eye } from "lucide-react"
import { StudentClassesTable } from "../student/classes/student-classes-table"

export default function StudentClassesDialog({ studentName }: { studentName: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-50">
          <Eye className="h-4 w-4 text-[#25AAE1]" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{studentName}&apos;s Classes</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <StudentClassesTable />
        </div>
      </DialogContent>
    </Dialog>
  )
}
