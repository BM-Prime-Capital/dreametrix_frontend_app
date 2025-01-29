import { Header } from "../header"
import { Sidebar } from "../sidebar"
import { ActivityFeed } from "../activity-feed"
import { Card } from "@/components/ui/card"
import { ClassesTable } from "./classes-table"

export default function ClassesPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto max-w-7xl px-3 sm:px-4">
        <div className="flex flex-col lg:flex-row gap-6 justify-center">
          <Card className="w-full lg:w-[200px] h-fit">
            <Sidebar />
          </Card>

          <main className="flex-1 space-y-6 max-w-3xl">
            <Card className="p-6">
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
              <div className="mt-6">
                <ClassesTable />
              </div>
            </Card>
          </main>

          <Card className="w-full lg:w-[300px] h-fit">
            <ActivityFeed />
          </Card>
        </div>
      </div>
    </div>
  )
}