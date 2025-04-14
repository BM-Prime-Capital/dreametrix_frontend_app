"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { X, Upload } from "lucide-react"

interface SubmitAssignmentDialogProps {
  isOpen: boolean
  onClose: () => void

  assignment: {
    class?: string
    type?: string
  }
}

export function SubmitAssignmentDialog({ isOpen, onClose, assignment }: SubmitAssignmentDialogProps) {
  const [message, setMessage] = useState("Hi Teacher,\nThis is my homework.")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden gap-0">
        <DialogHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-gray-700">Submit</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <div className="px-4 pb-4 space-y-4">
          <div className="border-t pt-4" />

          <div className="space-y-4">
            <div className="text-gray-500 text-sm">
              {assignment?.class}
              <br />
              {assignment?.type}
            </div>

            <div className="rounded-full border px-4 py-2 flex items-center text-gray-500">
              <Upload className="h-4 w-4 mr-2" />
              <span>Upload</span>
            </div>

            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[100px] resize-none rounded-xl"
            />

            <div className="flex justify-between items-center pt-2">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button className="bg-[#25AAE1] hover:bg-[#1D8CB3] text-white rounded-full px-8">SUBMIT</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

