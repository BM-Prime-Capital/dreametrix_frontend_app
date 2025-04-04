"use client"

import { Card } from "@/components/ui/card"
import { StudentClassesTable } from "./student-classes-table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function StudentClassesPage() {
  return (
    <section className="flex flex-col gap-4 w-full  mx-auto px-8 bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-[#25AAE1] text-xl font-bold">CLASSES</h1>
          <div className="text-gray-700 font-medium">PARENT&apos;S CODE: XXXXXXXX</div>
        </div>
        <div className="flex gap-4">
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
        <StudentClassesTable />
      </Card>
    </section>
  )
}

