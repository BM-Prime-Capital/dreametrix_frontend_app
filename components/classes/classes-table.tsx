"use client"
import { Eye, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

// Sample class data
const classes = [
  {
    id: 1,
    name: "Class 5 - Sci",
    subject: "Science",
    grade: "Grade 5",
    teacher: "Samantha Brown",
    students: 15,
  },
  {
    id: 2,
    name: "Class 5 - Math",
    subject: "Mathematics",
    grade: "Grade 5",
    teacher: "Joe Smith",
    students: 15,
  },
  {
    id: 3,
    name: "Class 6 - Math",
    subject: "Mathematics",
    grade: "Grade 6",
    teacher: "Joe Smith",
    students: 15,
  },
  {
    id: 4,
    name: "Class 7 - Sci",
    subject: "Science",
    grade: "Grade 7",
    teacher: "Samantha Brown",
    students: 15,
  },
  {
    id: 5,
    name: "Class 6 - Math",
    subject: "Mathematics",
    grade: "Grade 6",
    teacher: "Joe Smith",
    students: 15,
  },
  {
    id: 6,
    name: "Class 7 - Math",
    subject: "Mathematics",
    grade: "Grade 7",
    teacher: "Joe Smith",
    students: 15,
  },
  {
    id: 7,
    name: "Class 8 - Sci",
    subject: "Science",
    grade: "Grade 8",
    teacher: "Samantha Brown",
    students: 15,
  },
]

export function ClassesTable() {
  return (
    <div className="w-full">
      

      <div className="w-full overflow-x-auto rounded-b-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-y border-gray-200">
              <th className="py-5 px-6 text-left text-gray-600 font-medium text-base">CLASS</th>
              <th className="py-5 px-6 text-left text-gray-600 font-medium text-base">SUBJECT</th>
              <th className="py-5 px-6 text-left text-gray-600 font-medium text-base">GRADE</th>
              <th className="py-5 px-6 text-left text-gray-600 font-medium text-base">TEACHER</th>
              <th className="py-5 px-6 text-left text-gray-600 font-medium text-base">STUDENTS</th>
              <th className="py-5 px-6 text-left text-gray-600 font-normal text-base">EDIT</th>
              <th className="py-5 px-6 text-left text-gray-600 font-normal text-base">DELETE</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((class_, index) => (
              <tr
                key={class_.id}
                className={`
                  ${index % 2 === 0 ? "bg-[#EBF5FA]" : "bg-white"}
                  hover:bg-[#EBF5FA]/80 transition-colors
                `}
              >
                <td className="py-5 px-6 font-normal text-gray-700">{class_.name}</td>
                <td className="py-5 px-6 text-gray-600 font-normal">{class_.subject}</td>
                <td className="py-5 px-6 text-gray-600 font-normal">{class_.grade}</td>
                <td className="py-5 px-6 text-gray-600 font-normal">{class_.teacher}</td>
                <td className="py-5 px-6">
                  <div className="flex items-center gap-1">
                    <span className="text-gray-600 font-normal">{class_.students}</span>
                    <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0">
                      <Eye className="h-5 w-5 text-[#25AAE1]" />
                    </Button>
                  </div>
                </td>
                <td className="py-5 px-6">
                  <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0">
                    <Pencil className="h-5 w-5 text-[#25AAE1]" />
                  </Button>
                </td>
                <td className="py-5 px-6">
                  <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0">
                    <Trash2 className="h-5 w-5 text-red-400" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

