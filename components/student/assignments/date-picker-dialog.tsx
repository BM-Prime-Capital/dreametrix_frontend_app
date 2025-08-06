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
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDates, setSelectedDates] = useState<number[]>([])
  const [highlightedDates] = useState<number[]>([14, 15, 16])

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  // Get current month and year
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' })
  const currentYear = currentDate.getFullYear()

  // Generate calendar days for current month
  const generateCalendarDays = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startDay = firstDay.getDay() // 0 = Sunday, 1 = Monday, etc.
    
    // Adjust for Monday start (0 = Monday, 6 = Sunday)
    const adjustedStartDay = startDay === 0 ? 6 : startDay - 1
    
    const calendarDays = []
    let week = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < adjustedStartDay; i++) {
      week.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      week.push(day)
      if (week.length === 7) {
        calendarDays.push(week)
        week = []
      }
    }
    
    // Add remaining days from next month to complete the last week
    while (week.length < 7) {
      week.push(null)
    }
    if (week.length > 0) {
      calendarDays.push(week)
    }
    
    return calendarDays
  }

  const calendarDays = generateCalendarDays(currentDate)

  const handleDateClick = (date: number | null) => {
    if (!date) return

    if (selectedDates.includes(date)) {
      setSelectedDates(selectedDates.filter((d) => d !== date))
    } else {
      setSelectedDates([...selectedDates, date])
    }
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
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
            {currentMonth} {currentYear}
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
            const isOtherMonth = date === null
            const isSelected = selectedDates.includes(date || 0)
            const isHighlighted = highlightedDates.includes(date || 0)

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
                {date || ""}
              </button>
            )
          })}
        </div>

        <div className="flex justify-between items-center mt-4">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleApply} className="bg-[#25AAE1] hover:bg-[#1D8CB3] text-white">
            APPLY
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

