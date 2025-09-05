"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"

interface PrintDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function PrintDialog({ isOpen, onClose }: PrintDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Printer className="h-5 w-5 text-blue-600" />
            Print Rewards Data
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-gray-600">
            Print your children's rewards and achievements data.
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <input type="radio" name="print-option" id="current-view" className="rounded" defaultChecked />
              <label htmlFor="current-view" className="text-sm font-medium">Current View</label>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <input type="radio" name="print-option" id="detailed-report" className="rounded" />
              <label htmlFor="detailed-report" className="text-sm font-medium">Detailed Report</label>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <input type="radio" name="print-option" id="summary-only" className="rounded" />
              <label htmlFor="summary-only" className="text-sm font-medium">Summary Only</label>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 