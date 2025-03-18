"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Pencil, Trash2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

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
];

export function Parent() {
  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">PARENTS</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">All Classes</span>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="w-full overflow-auto rounded-lg border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>PARENT</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead>STUDENT</TableHead>
              <TableHead>VIEW MORE</TableHead>
              <TableHead>EDIT</TableHead>
              <TableHead>DELETE</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parents.map((parent, index) => (
              <TableRow key={parent.id}>
                <TableCell className="font-medium">{parent.name}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      parent.status === "Paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {parent.status}
                  </span>
                </TableCell>
                <TableCell>{parent.students}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Eye className="h-4 w-4 text-sky-500" />
                  </Button>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Pencil className="h-4 w-4 text-sky-500" />
                  </Button>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
