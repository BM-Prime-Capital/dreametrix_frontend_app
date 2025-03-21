"use client"

import { TeachersTable } from "./teachers-table"
import { ExcelUploadDialog } from "./excel-upload-dialog"
import { Button } from "@/components/ui/button"
import { PlusSquare, SlidersHorizontal } from "lucide-react"

export default function TeachersPage() {
  return (
    <section className="flex flex-col gap-4 w-full p-6 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-2xl font-normal text-[#D4AF37]">TEACHERS</h1>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button className="bg-[#1E88E5] hover:bg-[#1976D2] text-white rounded-md py-6 px-5 flex items-center gap-2">
            <PlusSquare className="h-5 w-5" />
            <span className="text-base font-normal">Add New Teacher</span>
          </Button>
          <ExcelUploadDialog />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-700 font-normal">TEACHE&apos;S CODE: XXXXXXXX</span>
          <div className="w-40"></div> {/* Spacer */}
          <div className="flex items-center gap-2">
            <span className="text-gray-600">All Classes</span>
            <Button variant="ghost" size="sm" className="h-8 w-8 rounded-md p-0">
              <SlidersHorizontal className="h-5 w-5 text-gray-500" />
            </Button>
          </div>
        </div>
      </div>

      <TeachersTable />
    </section>
  )
}

