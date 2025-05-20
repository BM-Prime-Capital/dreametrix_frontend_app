"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteClass, getClasses } from "@/services/ClassService";
import { useEffect, useState } from "react";
import NoData from "../ui/no-data";
import { Loader } from "../ui/loader";
import { useRequestInfo } from "@/hooks/useRequestInfo";
import { AddClassDialog } from "./AddClassDialog";
import Swal from 'sweetalert2';
import { ClassDetailsDialog } from "./ClassDetailsDialog";

export function ClassesTable({ refreshTime, setRefreshTime }: { refreshTime: string, setRefreshTime: Function }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [allClasses, setAllClasses] = useState<any[]>([]);
  const { tenantDomain, accessToken, refreshToken } = useRequestInfo();

  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleViewDetails = (classData: any) => {
    setSelectedClass(classData);
    setDetailsOpen(true);
  };

  const handleDeleteClass = async (classId: number) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      customClass: {
        title: 'text-lg font-semibold',
        htmlContainer: 'text-sm',
        confirmButton: 'text-sm',
        cancelButton: 'text-sm'
      },
      buttonsStyling: true,
      backdrop: `
        rgba(0,0,0,0.4)
        url("/images/nyan-cat.gif")
        left top
        no-repeat
      `
    });
  
    if (result.isConfirmed) {
      try {
        setIsLoading(true);
        const success = await deleteClass(
          classId,
          tenantDomain,
          accessToken,
          refreshToken
        );
        
        if (success) {
          const updatedClasses = await getClasses(tenantDomain, accessToken, refreshToken);
          setAllClasses(updatedClasses);
          
          await Swal.fire({
            title: 'Deleted!',
            text: 'Class has been deleted.',
            icon: 'success',
            customClass: {
              title: 'text-lg font-semibold',
              htmlContainer: 'text-sm'
            }
          });
        } else {
          await Swal.fire({
            title: 'Failed!',
            text: 'Failed to delete class.',
            icon: 'error',
            customClass: {
              title: 'text-lg font-semibold',
              htmlContainer: 'text-sm'
            }
          });
        }
      } catch (error) {
        console.error("Error deleting class:", error);
        await Swal.fire({
          title: 'Error!',
          text: error instanceof Error ? error.message : 'Unknown error',
          icon: 'error',
          customClass: {
            title: 'text-lg font-semibold',
            htmlContainer: 'text-sm'
          }
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    const loadClasses = async () => {
      if (tenantDomain && accessToken && refreshToken) {
        setIsLoading(true);
        try {
          const classes = await getClasses(tenantDomain, accessToken, refreshToken);
          if (isMounted) {
            setAllClasses(classes);
          }
        } catch (error) {
          await Swal.fire(
            'Error!',
            'Failed to load classes.',
            'error'
          );
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      }
    };
  
    loadClasses();
  
    return () => {
      isMounted = false;
    };
  }, [refreshTime, tenantDomain, accessToken, refreshToken]);



  return (
    <div className="w-full space-y-6 p-4 bg-white rounded-lg shadow-sm">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {allClasses && allClasses.length > 0 ? (
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <Table className="min-w-full">
                <TableHeader className="bg-[#3e81d4]/10">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="px-4 py-3 text-left text-xs font-medium text-[#3e81d4] uppercase tracking-wider">
                      CLASS
                    </TableHead>
                    <TableHead className="px-4 py-3 text-left text-xs font-medium text-[#3e81d4] uppercase tracking-wider">
                      SUBJECT
                    </TableHead>
                    <TableHead className="px-4 py-3 text-left text-xs font-medium text-[#3e81d4] uppercase tracking-wider">
                      GRADE
                    </TableHead>
                    <TableHead className="px-4 py-3 text-left text-xs font-medium text-[#3e81d4] uppercase tracking-wider">
                      TEACHER
                    </TableHead>
                    <TableHead className="px-4 py-3 text-center text-xs font-medium text-[#3e81d4] uppercase tracking-wider">
                      STUDENTS
                    </TableHead>
                    <TableHead className="px-4 py-3 text-center text-xs font-medium text-[#3e81d4] uppercase tracking-wider">
                      ACTIONS
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-white divide-y divide-gray-200">
                  {allClasses.map((class_) => (
                    <TableRow
                      key={class_.id}
                      className="hover:bg-[#3e81d4]/5 transition-colors"
                    >
                      <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                        <span className="bg-[#3e81d4]/10 text-[#3e81d4] rounded-full px-3 py-1 text-sm font-medium">
                          {class_.name}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-sm text-gray-800">
                        {class_.subject_in_short}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <span className="px-2.5 py-1 bg-[#3e81d4]/10 text-[#3e81d4] rounded-full text-xs font-medium inline-flex items-center justify-center min-w-[40px]">
                          {class_.grade}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-sm text-gray-800">
                        <span className="bg-[#3e81d4]/10 text-[#3e81d4] rounded-full px-3 py-1 text-sm font-medium">
                          {class_.teacher.full_name}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className="px-2.5 py-1 bg-[#3e81d4]/10 text-[#3e81d4] rounded-full text-xs font-medium">
                            {class_.students.length}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 hover:bg-[#3e81d4]/10 rounded-full"
                            onClick={() => handleViewDetails(class_)}
                          >
                            <Eye className="h-3.5 w-3.5 text-[#3e81d4]" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <div className="flex gap-2 justify-center">
                          <AddClassDialog
                            setRefreshTime={setRefreshTime}
                            existingClass={class_}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 hover:bg-[#3e81d4]/10 rounded-full"
                            onClick={() => handleDeleteClass(class_.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5 text-[#3e81d4]" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <NoData />
          )}
  
          <ClassDetailsDialog
            classData={selectedClass}
            open={detailsOpen}
            onOpenChange={setDetailsOpen}
          />
        </>
      )}
    </div>
  );
}