"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { X, Upload } from "lucide-react"

interface SendMessageDialogProps {
  isOpen: boolean
  onClose: () => void
  teacher: string
}

export function SendMessageDialog({ isOpen, onClose, teacher }: SendMessageDialogProps) {
  const [message, setMessage] = useState("Hi Teacher,")
  const [showPreview, setShowPreview] = useState(false)

  const handleUploadClick = () => {
    setShowPreview(true)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden gap-0 flex">
        <div className="w-[400px] p-4">
          <DialogHeader className="pb-2">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-gray-700">Send message</DialogTitle>
              <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="border-t pt-4" />

          <div className="space-y-4 mt-4">
            <div className="rounded-full border px-4 py-2 flex items-center">
              <span className="text-gray-500">To:</span>
              <span className="ml-2">{teacher}</span>
            </div>

            <div
              className="rounded-full border px-4 py-2 flex items-center text-gray-500 cursor-pointer"
              onClick={handleUploadClick}
            >
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
              <Button className="bg-[#25AAE1] hover:bg-[#1D8CB3] text-white rounded-full px-8">SEND</Button>
            </div>
          </div>
        </div>

        {showPreview && (
          <div className="w-[400px] bg-gray-100 p-4 flex flex-col">
            <div className="flex-1 bg-white rounded-lg p-4 flex flex-col justify-center items-center">
              <div className="w-full space-y-3 px-4">
                <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
            <div className="text-center text-sm text-gray-500 mt-4">1/1</div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

