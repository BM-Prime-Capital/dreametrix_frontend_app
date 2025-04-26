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
    <div className="w-full">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {allClasses && allClasses.length > 0 ? (
            <div className="rounded-lg border shadow-sm overflow-hidden">
              <Table>
                <TableHeader className="bg-[#f8fafc]">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-bold text-gray-700 py-4 w-[25%]">CLASS</TableHead>
                    <TableHead className="font-bold text-gray-700 py-4 w-[20%]">SUBJECT</TableHead>
                    <TableHead className="font-bold text-gray-700 py-4 w-[10%]">GRADE</TableHead>
                    <TableHead className="font-bold text-gray-700 py-4 w-[20%]">TEACHER</TableHead>
                    <TableHead className="font-bold text-gray-700 py-4 w-[15%] text-center">STUDENTS</TableHead>
                    <TableHead className="font-bold text-gray-700 py-4 w-[10%] text-center">ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allClasses.map((class_) => (
                    <TableRow key={class_.id} className="border-t hover:bg-[#f8fafc] transition-colors">
                      <TableCell className="py-4">
                        <span className="bg-primary-50 text-indigo-700 rounded-full text-sm font-medium whitespace-nowrap">
                          {class_.name}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 text-gray-600">{class_.subject_in_short}</TableCell>
                      <TableCell className="py-4">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium inline-flex items-center justify-center min-w-[40px]">
                          {class_.grade}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium whitespace-nowrap">
                          {class_.teacher.full_name}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                            {class_.students.length}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 hover:bg-blue-50 rounded-full"
                            onClick={() => handleViewDetails(class_)}
                          >
                            <Eye className="h-3.5 w-3.5 text-[#25AAE1]" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex gap-1 justify-center">
                          <AddClassDialog
                            setRefreshTime={setRefreshTime}
                            existingClass={class_}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 hover:bg-red-50 rounded-full"
                            onClick={() => handleDeleteClass(class_.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5 text-red-500" />
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