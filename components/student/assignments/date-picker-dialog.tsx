"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface DatePickerDialogProps {
  isOpen: boolean
  onClose: () => void
  onApply: (selectedDates: number[]) => void
}

export function DatePickerDialog({ isOpen, onClose, onApply }: DatePickerDialogProps) {
  const [month,] = useState("June")
  const [year,] = useState("2020")
  const [selectedDates, setSelectedDates] = useState<number[]>([11, 17])
  const [highlightedDates,] = useState<number[]>([14, 15, 16])

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  // Generate calendar days for June 2020
  const calendarDays = [
    [1, 2, 3, 4, 5, 6, 7],
    [8, 9, 10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19, 20, 21],
    [22, 23, 24, 25, 26, 27, 28],
    [29, 30, 1, 2, 3, 4, 5],
  ]

  const handleDateClick = (date: number) => {
    if (date > 31 || date < 1) return // Skip dates from other months

    if (selectedDates.includes(date)) {
      setSelectedDates(selectedDates.filter((d) => d !== date))
    } else {
      setSelectedDates([...selectedDates, date])
    }
  }

  const handlePrevMonth = () => {
    // In a real app, this would change the month and regenerate the calendar
  }

  const handleNextMonth = () => {
    // In a real app, this would change the month and regenerate the calendar
  }

  const handleApply = () => {
    onApply(selectedDates)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] p-6 overflow-hidden gap-0">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="icon" onClick={handlePrevMonth} className="text-[#25AAE1]">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="text-lg font-medium">
            {month} {year}
          </div>
          <Button variant="ghost" size="icon" onClick={handleNextMonth} className="text-[#25AAE1]">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-4">
          {days.map((day) => (
            <div key={day} className="text-center text-sm font-medium text-[#25AAE1]">
              {day}
            </div>
          ))}

          {calendarDays.flat().map((date, index) => {
            const isOtherMonth = (index < 28 && date > 15) || (index > 28 && date < 15)
            const isSelected = selectedDates.includes(date) && !isOtherMonth
            const isHighlighted = highlightedDates.includes(date) && !isOtherMonth

            return (
              <button
                key={`${date}-${index}`}
                className={`
                  h-8 w-8 rounded-full flex items-center justify-center text-sm
                  ${isOtherMonth ? "text-gray-300" : "text-gray-700"}
                  ${isSelected ? "bg-[#25AAE1] text-white" : ""}
                  ${isHighlighted && !isSelected ? "bg-[#E3F2F9]" : ""}
                  hover:bg-gray-100
                `}
                onClick={() => handleDateClick(date)}
                disabled={isOtherMonth}
              >
                {date}
              </button>
            )
          })}
        </div>

        <div className="flex justify-between items-center mt-4">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button className="bg-[#25AAE1] hover:bg-[#1D8CB3] text-white rounded-full px-8" onClick={handleApply}>
            APPLY
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

