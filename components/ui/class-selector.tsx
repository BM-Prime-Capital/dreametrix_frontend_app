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
import { cn } from "@/utils/tailwind"

interface ClassItem {
  id: string
  name: string
}

interface ClassSelectorProps {
  classes: ClassItem[]
  selectedClasses: string[]
  onSelect: (classIds: string[]) => void
  placeholder?: string
  multiple?: boolean
  className?: string
}

export function ClassSelector({
  classes,
  selectedClasses,
  onSelect,
  placeholder = "Select classes...",
  multiple = false,
  className = "",
}: ClassSelectorProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredClasses = classes.filter(classItem =>
    classItem.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelect = (classId: string) => {
    if (multiple) {
      const newSelected = selectedClasses.includes(classId)
        ? selectedClasses.filter(id => id !== classId)
        : [...selectedClasses, classId]
      onSelect(newSelected)
    } else {
      onSelect([classId])
      setOpen(false)
    }
  }

  const handleSelectAll = () => {
    onSelect(classes.map(classItem => classItem.id))
    if (!multiple) setOpen(false)
  }

  const handleClear = () => {
    onSelect([])
  }

  const selectedNames = selectedClasses
    .map(id => classes.find(c => c.id === id)?.name)
    .filter(Boolean)
    .join(", ")

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-white"
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <Search className="h-4 w-4 opacity-50 shrink-0 " />
              {selectedClasses.length > 0 ? (
                <span className="truncate flex items-center">
                  {multiple ? (
                    <span className="truncate" title={selectedNames}>
                      {truncateText(selectedNames, 30)}
                    </span>
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
              placeholder="Search classes..."
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            <CommandList>
              <CommandEmpty>No classes found.</CommandEmpty>
              <CommandGroup>
                {multiple && (
                  <CommandItem onSelect={handleSelectAll}>
                    <span className="font-medium">Select All</span>
                  </CommandItem>
                )}
                {filteredClasses.map(classItem => (
                  <CommandItem
                    key={classItem.id}
                    onSelect={() => handleSelect(classItem.id)}
                  >
                    <div className="flex items-center gap-2">
                      <span>{classItem.name}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
              {selectedClasses.length > 0 && (
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