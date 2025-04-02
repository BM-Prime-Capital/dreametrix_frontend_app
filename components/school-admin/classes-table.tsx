"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getClasses } from "@/services/ClassService"
import { useEffect, useState } from "react"
import NoData from "../ui/no-data"
import { Loader } from "../ui/loader"
import { useRequestInfo } from "@/hooks/useRequestInfo"
import { AddClassDialog } from "./add-class-dialog"
import { ClassStudentsDialog } from "./class-students-dialog"

// Sample class data for local development
const classesMock = [
  {
    id: 1,
    name: "Class 5N",
    subject_in_short: "Science",
    subject_in_all_letter: "Science",
    grade: "Grade 5",
    teacher: { id: 1, full_name: "Samantha Brown" },
    students: Array(15).fill({}),
  },
  {
    id: 2,
    name: "Class 5M",
    subject_in_short: "Mathematics",
    subject_in_all_letter: "Mathematics",
    grade: "Grade 5",
    teacher: { id: 2, full_name: "Joe Smith" },
    students: Array(15).fill({}),
  },
]

export function ClassesTable({ refreshTime }: { refreshTime: string }) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [allClasses, setAllClasses] = useState<any[]>([])
  const { tenantDomain, accessToken, refreshToken } = useRequestInfo()

  useEffect(() => {
    const loadClasses = async () => {
      if (tenantDomain && accessToken && refreshToken) {
        setIsLoading(true)
        try {
          const classes = await getClasses(tenantDomain, accessToken, refreshToken)
          setAllClasses(classes)
        } catch (error) {
          console.error("Error loading classes:", error)
          // Use mock data in local development when API fails
          setAllClasses(classesMock)
        } finally {
          setIsLoading(false)
        }
      } else {
        // Use mock data in local development when credentials are missing
        setAllClasses(classesMock)
      }
    }

    loadClasses()
  }, [refreshTime, tenantDomain, accessToken, refreshToken])

  return (
    <div className="w-full">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {allClasses && allClasses.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-bold">CLASS</TableHead>
                  <TableHead className="font-bold">SUBJECT</TableHead>
                  <TableHead className="font-bold">GRADE</TableHead>
                  <TableHead className="font-bold">TEACHER</TableHead>
                  <TableHead className="font-bold">STUDENTS</TableHead>
                  <TableHead>ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allClasses.map((class_) => (
                  <TableRow key={class_.id}>
                    <TableCell className="font-medium">{class_.name || `Class ${class_.id}`}</TableCell>
                    <TableCell>{class_.subject_in_short}</TableCell>
                    <TableCell>{class_.grade}</TableCell>
                    <TableCell>{class_.teacher?.full_name || "Not assigned"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 ">
                        {class_.students?.length || 0}
                        <ClassStudentsDialog studentClassName={class_.name || `Class ${class_.id}`} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <AddClassDialog setRefreshTime={() => {}} existingClass={class_} />
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-50">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <NoData />
          )}
        </>
      )}
    </div>
  )
}

