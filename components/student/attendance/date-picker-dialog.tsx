"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface DatePickerDialogProps {
  isOpen: boolean
  onClose: () => void
  onApply: (selectedDate: Date) => void
}

export function DatePickerDialog({ isOpen, onClose, onApply }: DatePickerDialogProps) {
  //use today's date
  const today = new Date()
  const [month, setMonth] = useState(today.getMonth())
  const [year, setYear] = useState(today.getFullYear())
  const [selectedDate, setSelectedDate] = useState<Date>(today)
  /* //use today's date
  const [month, setMonth] = useState(today.getMonth())
  const [year, setYear] = useState(today.getFullYear())
  const [selectedDate, setSelectedDate] = useState<Date>(today) */

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  // Generate calendar days for the current month/year
  const generateCalendarDays = () => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    
    // Adjust to start from Monday (1 = Monday, 0 = Sunday)
    const dayOfWeek = (firstDay.getDay() + 6) % 7
    startDate.setDate(firstDay.getDate() - dayOfWeek)
    
    const days = []
    const current = new Date(startDate)
    
    for (let week = 0; week < 6; week++) {
      const weekDays = []
      for (let day = 0; day < 7; day++) {
        weekDays.push(new Date(current))
        current.setDate(current.getDate() + 1)
      }
      days.push(weekDays)
    }
    
    return days
  }

  const calendarDays = generateCalendarDays()

  const handleDateClick = (date: Date) => {
    setSelectedDate(new Date(date))
  }

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11)
      setYear(year - 1)
    } else {
      setMonth(month - 1)
    }
  }

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0)
      setYear(year + 1)
    } else {
      setMonth(month + 1)
    }
  }

  const handleApply = () => {
    onApply(selectedDate)
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
            {new Date(year, month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
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
            const isOtherMonth = date.getMonth() !== month
            const isSelected = selectedDate.toDateString() === date.toDateString()

            return (
              <button
                key={`${date.getTime()}-${index}`}
                className={`
                  h-8 w-8 rounded-full flex items-center justify-center text-sm
                  ${isOtherMonth ? "text-gray-300" : "text-gray-700"}
                  ${isSelected ? "bg-[#25AAE1] text-white" : ""}
                  hover:bg-gray-100
                `}
                onClick={() => handleDateClick(date)}
                disabled={isOtherMonth}
              >
                {date.getDate()}
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

