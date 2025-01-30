"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const messages = {
  teacher: [
    {
      id: 1,
      avatar: "/avatars/teacher1.jpg",
      name: "Teacher 1",
      message: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do...",
      time: "13:45",
      date: "21/07/24",
    },
    {
      id: 2,
      avatar: "/avatars/teacher2.jpg",
      name: "Teacher 2",
      message: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do...",
      time: "13:45",
      date: "21/07/24",
    },
  ],
  class: [
    {
      id: 1,
      name: "Class 5A",
      message: "Homework submission deadline extended...",
      time: "14:30",
      date: "21/07/24",
    },
  ],
  parent: [
    {
      id: 1,
      name: "John Smith",
      message: "Regarding tomorrow's parent meeting...",
      time: "15:20",
      date: "21/07/24",
    },
  ],
  "all-parents": [
    {
      id: 1,
      name: "School Announcement",
      message: "School closure due to weather conditions...",
      time: "16:00",
      date: "21/07/24",
    },
  ],
  group: [
    {
      id: 1,
      name: "Science Club",
      message: "Next week's experiment preparation...",
      time: "16:45",
      date: "21/07/24",
    },
  ],
}

interface CommunicateTableProps {
  type: keyof typeof messages
}

export function CommunicateTable({ type }: CommunicateTableProps) {
  return (
    <div className="w-full overflow-auto rounded-lg border mt-4">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-[250px]">NAME</TableHead>
            <TableHead className="hidden md:table-cell">MESSAGE</TableHead>
            <TableHead className="w-[100px]">TIME</TableHead>
            <TableHead className="w-[100px]">DATE</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages[type].map((item) => (
            <TableRow key={item.id} className="hover:bg-gray-50">
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  {type === "teacher" && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{item.name[0]}</AvatarFallback>
                    </Avatar>
                  )}
                  {item.name}
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell text-gray-500">
                {item.message}
              </TableCell>
              <TableCell>{item.time}</TableCell>
              <TableCell>{item.date}</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}