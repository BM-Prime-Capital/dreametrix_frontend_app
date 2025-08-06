"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"

interface ReportDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function ReportDialog({ isOpen, onClose }: ReportDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Generate Rewards Report
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-gray-600">
            Generate a comprehensive report of your children's rewards and achievements.
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <input type="checkbox" id="points" className="rounded" />
              <label htmlFor="points" className="text-sm font-medium">Total Points Summary</label>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <input type="checkbox" id="attendance" className="rounded" />
              <label htmlFor="attendance" className="text-sm font-medium">Attendance Records</label>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <input type="checkbox" id="domains" className="rounded" />
              <label htmlFor="domains" className="text-sm font-medium">Good Domains & Focus Areas</label>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
              <input type="checkbox" id="character" className="rounded" />
              <label htmlFor="character" className="text-sm font-medium">Character Development</label>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 