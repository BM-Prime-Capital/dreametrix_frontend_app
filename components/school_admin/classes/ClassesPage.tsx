import { Card } from "@/components/ui/card"
import { ClassesTable } from "./classes-table"

export default function ClassesPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">CLASSES</h1>
        <div className="flex items-center gap-2">
          <select className="px-2 py-1 border rounded-md text-sm">
            <option>All Classes</option>
            <option>Grade 5</option>
            <option>Grade 6</option>
            <option>Grade 7</option>
          </select>
        </div>
      </div>
      <Card>
        <ClassesTable />
      </Card>
    </div>
  )
}

