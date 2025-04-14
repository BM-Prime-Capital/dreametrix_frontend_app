"use client"

import { Card } from "@/components/ui/card"
import { ParentClassesTable } from "@/components/parents/ParentClassesTable"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

export default function ParentClassesPage() {
  const [selectedChild, setSelectedChild] = useState("all")

  // Sample children data
  const children = [
    { id: "john", name: "John Smith" },
    { id: "emma", name: "Emma Smith" },
  ]

  return (
    <section className="flex flex-col gap-4 w-full mx-auto px-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-[#25AAE1] text-xl font-bold">CLASSES</h1>
          <div className="text-gray-700 font-medium">PARENT&apos;S CODE: XXXXXXXX</div>
        </div>
        <div className="flex gap-4">
          <Select value={selectedChild} onValueChange={setSelectedChild}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="All Children" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Children</SelectItem>
              {children.map((child) => (
                <SelectItem key={child.id} value={child.id}>
                  {child.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select defaultValue="all-classes">
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="All Classes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-classes">All Classes</SelectItem>
              <SelectItem value="science">Science</SelectItem>
              <SelectItem value="mathematics">Mathematics</SelectItem>
              <SelectItem value="biology">Biology</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all-days">
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="All Days" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-days">All Days</SelectItem>
              <SelectItem value="monday">Monday</SelectItem>
              <SelectItem value="tuesday">Tuesday</SelectItem>
              <SelectItem value="wednesday">Wednesday</SelectItem>
              <SelectItem value="thursday">Thursday</SelectItem>
              <SelectItem value="friday">Friday</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="rounded-lg shadow-sm p-0 overflow-hidden border-0">
        <ParentClassesTable selectedChild={selectedChild} />
      </Card>
    </section>
  )
}
