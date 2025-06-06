"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, Download, Printer, ChevronLeft, ChevronRight } from "lucide-react"
import { Assignment } from "@/app/api/student/assignment/assignment.model"

interface ViewSubmissionDialogProps {
  isOpen: boolean
  onClose: () => void
  assignment: Assignment | null;
}
export function ViewSubmissionDialog({ isOpen, onClose, assignment }: ViewSubmissionDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden gap-0 bg-gray-50">
        <DialogHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-gray-700">Your Files</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <div className="px-4 pb-4 space-y-4">
          <div className="text-gray-500 text-sm">
            {assignment?.name}
            <br />
            {assignment?.kind}
          </div>

          <div className="bg-white rounded-lg p-4 min-h-[200px] flex flex-col justify-center items-center">
            <div className="w-full space-y-3 px-4">
              <div className="h-4 bg-gray-400 rounded w-1/3"></div>
              <div className="h-4 bg-gray-400 rounded w-1/2"></div>
              <div className="h-4 bg-gray-400 rounded w-full"></div>
              <div className="h-4 bg-gray-400 rounded w-full"></div>
              <div className="h-4 bg-gray-400 rounded w-full"></div>
              <div className="h-4 bg-gray-400 rounded w-full"></div>
              <div className="h-4 bg-gray-400 rounded w-full"></div>
              <div className="h-4 bg-gray-400 rounded w-3/4"></div>
            </div>
          </div>

          <div className="flex justify-center items-center gap-4">
            <Button variant="ghost" size="icon" className="text-purple-500">
              <Download className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-[#25AAE1]">
              <Printer className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex justify-center items-center gap-2 text-sm text-gray-500">
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span>1/4</span>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

