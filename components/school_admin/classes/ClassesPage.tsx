"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import { AddClassDialog } from "./AddClassDialog"
import { ClassesTable } from "./classes-table"

export default function ClassesPage() {
  return (
    <div className="w-full space-y-6">
      <Card className="p-6">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col space-y-4">
            {/* Title row */}
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold tracking-tight text-blue-500">CLASSES</h1>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">All Classes</span>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Action row */}
            <div className="flex items-center justify-between">
              <AddClassDialog />
              <p className="text-sm text-muted-foreground">STUDENT&apos;S CODE: XXXXXXXX</p>
            </div>
          </div>
          
          <ClassesTable />
        </div>
      </Card>
    </div>
  )
}