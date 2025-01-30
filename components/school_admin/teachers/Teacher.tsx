"use client"

import { Card } from "@/components/ui/card"
import { TeachersTable } from "./teachers-table"
import { Button } from "@/components/ui/button"
import { Plus, Settings } from "lucide-react"

export default function TeachersPage() {
  return (
    <div className="w-full space-y-6">
      <Card className="p-6">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col space-y-4">
            {/* Title row */}
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold tracking-tight">TEACHERS</h1>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">All Classes</span>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Action row */}
            <div className="flex items-center justify">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white gap-2">
                <Plus className="h-4 w-4" />
                Add New Teacher
              </Button> 

              <div className="flex justify-center px-9">
                 <p className=" px-9 text-sm text-muted-foreground ">TEACHER&apos;S CODE: XXXXXXXX</p>
              </div>
            </div>
          </div>
          
          <TeachersTable />
        </div>
      </Card>
    </div>
  )
}