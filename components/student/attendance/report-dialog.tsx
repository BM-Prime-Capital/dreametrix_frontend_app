"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, Download } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ReportDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function ReportDialog({ isOpen, onClose }: ReportDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] p-6 overflow-hidden gap-0">
        <div className="flex items-center mb-4">
          <div className="text-lg font-medium">Report</div>
        </div>

        <div className="border-t pt-4" />

        <div className="space-y-4 mt-4">
          <Select defaultValue="class-5-math">
            <SelectTrigger className="w-full rounded-full">
              <SelectValue placeholder="Class 5 - Math" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="class-5-math">Class 5 - Math</SelectItem>
              <SelectItem value="class-5-sci">Class 5 - Sci</SelectItem>
              <SelectItem value="class-5-bio">Class 5 - Bio</SelectItem>
              <SelectItem value="class-5-lit">Class 5 - Lit</SelectItem>
              <SelectItem value="class-5-che">Class 5 - Che</SelectItem>
              <SelectItem value="class-5-spa">Class 5 - Spa</SelectItem>
              <SelectItem value="class-5-phy">Class 5 - Phy</SelectItem>
            </SelectContent>
          </Select>

          {/* <Button className="w-full bg-[#25AAE1] hover:bg-[#1D8CB3] text-white rounded-full">
            <Download className="h-4 w-4 mr-2" />
            SAVE REPORT
          </Button> */}

          <div className="text-center">
            <Button variant="ghost" onClick={onClose} className="text-gray-500">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

