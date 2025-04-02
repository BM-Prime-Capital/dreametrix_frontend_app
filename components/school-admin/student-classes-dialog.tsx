"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function StudentClassesDialog({
  studentName,
}: {
  studentName: string
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
            <Avatar className="h-12 w-12">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>SL</AvatarFallback>
            </Avatar>
            <label className="text-gray-700">{studentName}</label>
            <label className="text-gray-400">ID 0366ANH55</label>
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-x-auto">
          <table className="w-full" id="studentClassesTable">
            <thead>
              <tr>
                <th>SUBJECT</th>
                <th>AVERAGE</th>
                <th>TEACHER</th>
              </tr>
            </thead>
            <tbody className="text-gray-500">
              <tr>
                <td>Science1 </td>
                <td>66% (0)</td>
                <td>Samanthan Brown</td>
              </tr>
              <tr>
                <td>Science2</td>
                <td>78% (0)</td>
                <td>Joe Smith</td>
              </tr>
              <tr>
                <td>Science3</td>
                <td>74% (0)</td>
                <td>Parker Moroe</td>
              </tr>
              <tr>
                <td>Science3</td>
                <td>78% (0)</td>
                <td>Joe Smith</td>
              </tr>
              <tr>
                <td>Science4</td>
                <td>74% (0)</td>
                <td>Parker Moroe</td>
              </tr>
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  )
}

