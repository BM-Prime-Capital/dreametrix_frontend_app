"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import { AddStudentDialog } from "./AddStudentDialog"
import { StudentsTable } from  "./StudentTable"

export default function StudentsDash() {
  return (
    <div className="w-full space-y-6">
      <Card className="p-6">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col space-y-4">
            {/* Title row */}
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold tracking-tight text-blue-500">STUDENTS</h1>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">All Classes</span>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Action row */}
            <div className="flex items-center justify-between">
              <AddStudentDialog />
              <p className="text-sm text-muted-foreground">STUDENT&apos;S CODE: XXXXXXXX</p>
            </div>
          </div>

          <StudentsTable />
        </div>
      </Card>
    </div>
  )
}

