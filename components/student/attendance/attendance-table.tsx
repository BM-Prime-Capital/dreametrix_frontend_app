"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Sample attendance data
const attendanceData = [
  {
    id: 1,
    class: "Class 5 - Sci",
    day: "TODAY",
    status: "Present",
    historical: { present: 45, absent: 5, total: 50 },
    teacher: "Eva Parker",
  },
  {
    id: 2,
    class: "Class 5 - Math",
    day: "TODAY",
    status: "Present",
    historical: { present: 45, absent: 5, total: 50 },
    teacher: "Eva Parker",
  },
  {
    id: 3,
    class: "Class 5 - Bio",
    day: "TODAY",
    status: "Late",
    historical: { present: 45, absent: 5, total: 50 },
    teacher: "Sam Burke",
  },
  {
    id: 4,
    class: "Class 5 - Lit",
    day: "TODAY",
    status: "Present",
    historical: { present: 45, absent: 5, total: 50 },
    teacher: "Anna Blake",
  },
  {
    id: 5,
    class: "Class 5 - Che",
    day: "TODAY",
    status: "Present",
    historical: { present: 45, absent: 5, total: 50 },
    teacher: "Sam Burke",
  },
  {
    id: 6,
    class: "Class 5 - Spa",
    day: "TODAY",
    status: "Absent",
    historical: { present: 45, absent: 5, total: 50 },
    teacher: "Anna Blake",
  },
  {
    id: 7,
    class: "Class 5 - Phy",
    day: "TODAY",
    status: "Absent",
    historical: { present: 45, absent: 5, total: 50 },
    teacher: "Eva Parker",
  },
]

export function AttendanceTable() {
  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b">
            <TableHead className="font-bold text-gray-700 py-4">CLASS</TableHead>
            <TableHead className="font-bold text-gray-700 py-4">DAY</TableHead>
            <TableHead className="font-bold text-gray-700 py-4">ATTENDANCE</TableHead>
            <TableHead className="font-bold text-gray-700 py-4">HISTORICAL STADISTICS</TableHead>
            <TableHead className="font-bold text-gray-700 py-4">TEACHER</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendanceData.map((record, index) => (
            <TableRow key={record.id} className={index % 2 === 0 ? "bg-[#EDF6FA]" : ""}>
              <TableCell className="font-medium text-gray-500">{record.class}</TableCell>
              <TableCell className="text-gray-500">
                <span className="text-[#25AAE1] underline">{record.day}</span>
              </TableCell>
              <TableCell>
                <span
                  className={`
                  underline
                  ${record.status === "Present" ? "text-[#25AAE1]" : ""}
                  ${record.status === "Late" ? "text-orange-400" : ""}
                  ${record.status === "Absent" ? "text-red-500" : ""}
                `}
                >
                  {record.status}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-4">
                  <span className="text-[#25AAE1]">{record.historical.present}</span>
                  <span className="text-red-500">{record.historical.absent}</span>
                  <span className="text-gray-500">{record.historical.total}</span>
                </div>
              </TableCell>
              <TableCell className="text-gray-500">
                <div className="flex items-center">
                  {record.teacher} <MessageIcon />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function MessageIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-[#25AAE1] ml-2"
    >
      <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M22 2L15 22L11 13L2 9L22 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

