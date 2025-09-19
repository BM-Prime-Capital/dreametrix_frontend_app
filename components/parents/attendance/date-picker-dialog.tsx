"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface DatePickerDialogProps {
  isOpen: boolean
  onClose: () => void
  onApply: (date: number) => void
}

export function DatePickerDialog({ isOpen, onClose, onApply }: DatePickerDialogProps) {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [selectedOption, setSelectedOption] = useState<string>("today")

  const handleApply = () => {
    if (selectedOption === "today") {
      onApply(0) // 0 represents "TODAY"
    } else if (selectedOption === "custom") {
      onApply(new Date(selectedDate).getTime())
    } else if (selectedOption === "yesterday") {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      onApply(yesterday.getTime())
    } else if (selectedOption === "last-week") {
      const lastWeek = new Date()
      lastWeek.setDate(lastWeek.getDate() - 7)
      onApply(lastWeek.getTime())
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] p-6 overflow-hidden gap-0">
        <div className="mb-4">
          <div className="text-lg font-medium">Select Date</div>
        </div>

        <div className="border-t pt-4" />

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                checked={selectedOption === "today"}
                onChange={() => setSelectedOption("today")}
                className="h-4 w-4 text-blue-600"
              />
              <span>Today</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="radio"
                checked={selectedOption === "yesterday"}
                onChange={() => setSelectedOption("yesterday")}
                className="h-4 w-4 text-blue-600"
              />
              <span>Yesterday</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="radio"
                checked={selectedOption === "last-week"}
                onChange={() => setSelectedOption("last-week")}
                className="h-4 w-4 text-blue-600"
              />
              <span>Last Week</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="radio"
                checked={selectedOption === "custom"}
                onChange={() => setSelectedOption("custom")}
                className="h-4 w-4 text-blue-600"
              />
              <span>Custom Date</span>
            </label>

            {selectedOption === "custom" && (
              <div className="pl-6 pt-2">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button className="bg-[#25AAE1] hover:bg-[#1D8CB3] text-white" onClick={handleApply}>
              Apply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
