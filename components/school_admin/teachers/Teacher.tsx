import { Card } from "@/components/ui/card"
import { TeachersTable } from "./teachers-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function TeachersPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="space-y-2">
          <h1 className="text-xl font-semibold">TEACHERS</h1>
          <div className="text-sm text-muted-foreground">TEACHER&apos;S CODE: XXXXXXXX</div>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Button className="bg-blue-500 hover:bg-blue-600 w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add New Teacher
          </Button>
          <select className="px-2 py-1 border rounded-md text-sm">
            <option>All Classes</option>
            <option>Morning</option>
            <option>Afternoon</option>
          </select>
        </div>
      </div>
      <Card>
        <TeachersTable />
      </Card>
    </div>
  )
}

