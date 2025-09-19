"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Upload } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

interface ComposeDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function ComposeDialog({ isOpen, onClose }: ComposeDialogProps) {
  const [message, setMessage] = useState("")
  const [showPreview, setShowPreview] = useState(false)

  const handleUploadClick = () => {
    setShowPreview(true)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden gap-0 flex">
        <div className="w-[400px] p-4">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-gray-700">Compose message</DialogTitle>
          </DialogHeader>
          <div className="border-t pt-4" />

          <div className="space-y-4 mt-4">
            <Select defaultValue="teacher">
              <SelectTrigger className="rounded-full">
                <SelectValue placeholder="Select recipient" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="teacher">Eva Parker</SelectItem>
                <SelectItem value="class">Whole Class</SelectItem>
                <SelectItem value="group">Study Group</SelectItem>
              </SelectContent>
            </Select>

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
              className="min-h-[200px] resize-none rounded-xl"
              placeholder="Type your message here..."
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

