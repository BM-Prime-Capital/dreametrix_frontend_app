"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

// Sample data - would typically come from your API
const parents = [
  {
    id: 1,
    name: "Samantha Brown",
    status: "Paid",
    students: "Taylor Brown",
  },
  {
    id: 2,
    name: "Joe Smith",
    status: "Paid",
    students: "Arnold Smith - Berry Smith",
  },
  {
    id: 3,
    name: "Parker Monroe",
    status: "Debt",
    students: "Samantha Monroe",
  },
  {
    id: 4,
    name: "Patrick O'Connor",
    status: "Paid",
    students: "Susan O'Connor",
  },
  {
    id: 5,
    name: "Alison Patterson",
    status: "Debt",
    students: "Ben Patterson - John Patterson",
  },
  {
    id: 6,
    name: "Susan Davis",
    status: "Paid",
    students: "Steve Davis",
  },
  {
    id: 7,
    name: "Jeffry Jones",
    status: "Paid",
    students: "Malcolm Jones",
  },
]

export function ParentTable() {
  return (
    <div className="w-full">
      {/* Desktop version */}
      <div className="hidden md:block overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>PARENT</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead>STUDENT</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parents.map((parent, index) => (
              <TableRow key={parent.id} className={index % 2 === 0 ? "bg-sky-50/50" : ""}>
                <TableCell>{parent.name}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      parent.status === "Paid" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {parent.status}
                  </span>
                </TableCell>
                <TableCell>{parent.students}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4 text-sky-500" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Pencil className="h-4 w-4 text-sky-500" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile version */}
      <div className="md:hidden space-y-4">
        {parents.map((parent) => (
          <div key={parent.id} className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium">{parent.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{parent.students}</p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  parent.status === "Paid" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}
              >
                {parent.status}
              </span>
            </div>
            <div className="flex gap-2 mt-3">
              <Button variant="ghost" size="sm" className="flex-1">
                <Eye className="h-4 w-4 text-sky-500 mr-2" />
                View
              </Button>
              <Button variant="ghost" size="sm" className="flex-1">
                <Pencil className="h-4 w-4 text-sky-500 mr-2" />
                Edit
              </Button>
              <Button variant="ghost" size="sm" className="flex-1">
                <Trash2 className="h-4 w-4 text-red-500 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}