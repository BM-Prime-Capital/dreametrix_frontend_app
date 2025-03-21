

import { ParentsTable } from "./parent-table"
import { Button } from "@/components/ui/button"
import { PlusSquare, SlidersHorizontal } from "lucide-react"

export  function ParentsPage() {
  return (
    <section className="flex flex-col gap-4 w-full p-6 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-2xl font-normal text-[#4CD964]">PARENTS</h1>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button className="bg-[#1E88E5] hover:bg-[#1976D2] text-white rounded-md py-6 px-5 flex items-center gap-2">
            <PlusSquare className="h-5 w-5" />
            <span className="text-base font-normal">Add New Parent</span>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-gray-600">All Classes</span>
            <Button variant="ghost" size="sm" className="h-8 w-8 rounded-md p-0">
              <SlidersHorizontal className="h-5 w-5 text-gray-500" />
            </Button>
          </div>
        </div>
      </div>


        <ParentsTable />
    </section>
  )


}