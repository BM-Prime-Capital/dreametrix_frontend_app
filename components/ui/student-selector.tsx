"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/utils/tailwind"

interface Student {
  id: number
  name: string
  class?: string
}

interface StudentSelectorProps {
  students: Student[]
  selectedStudents: number[]
  onSelect: (studentIds: number[]) => void
  placeholder?: string
  multiple?: boolean
  className?: string
}

export function StudentSelector({
  students,
  selectedStudents,
  onSelect,
  placeholder = "Select students...",
  multiple = false,
  className = "",
}: StudentSelectorProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelect = (studentId: number) => {
    if (multiple) {
      const newSelected = selectedStudents.includes(studentId)
        ? selectedStudents.filter(id => id !== studentId)
        : [...selectedStudents, studentId]
      onSelect(newSelected)
    } else {
      onSelect([studentId])
      setOpen(false)
    }
  }

  const handleSelectAll = () => {
    onSelect(students.map(student => student.id))
    if (!multiple) setOpen(false)
  }

  const handleClear = () => {
    onSelect([])
  }

  const selectedNames = selectedStudents
    .map(id => students.find(s => s.id === id)?.name)
    .filter(Boolean)
    .join(", ")

  return (
    <div className={cn("flex flex-col gap-2 w-[200px]", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-white"
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <Search className="h-4 w-4 opacity-50 shrink-0" />
              {selectedStudents.length > 0 ? (
                <span className="truncate flex items-center">
                  {multiple ? (
                    <span className="truncate">{selectedNames}</span>
                  ) : (
                    <span>{selectedNames || placeholder}</span>
                  )}
                </span>
              ) : (
                <span className="truncate">{placeholder}</span>
              )}

            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Search students..."
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            <CommandList>
              <CommandEmpty>No students found.</CommandEmpty>
              <CommandGroup>
                {multiple && (
                  <CommandItem onSelect={handleSelectAll}>
                    <span className="font-medium">Select All</span>
                  </CommandItem>
                )}
                {filteredStudents.map(student => (
                  <CommandItem
                    key={student.id}
                    onSelect={() => handleSelect(student.id)}
                  >
                    <div className="flex items-center gap-2">
                      <span>{student.name}</span>
                      {student.class && (
                        <Badge variant="outline">{student.class}</Badge>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
              {selectedStudents.length > 0 && (
                <CommandGroup>
                  <CommandItem onSelect={handleClear}>
                    <span className="text-destructive font-medium">Clear selection</span>
                  </CommandItem>
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}