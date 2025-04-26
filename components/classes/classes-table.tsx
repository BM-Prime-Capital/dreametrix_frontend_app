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

  // return (
  //   <div className="w-full">
  //     {isLoading ? (
  //       <Loader />
  //     ) : (
  //       <>
  //         {allClasses && allClasses.length > 0 ? (
  //           <Table>
  //             <TableHeader>
  //               <TableRow className="hover:bg-transparent">
  //                 <TableHead className="font-bold">CLASS</TableHead>
  //                 <TableHead className="font-bold">SUBJECT</TableHead>
  //                 <TableHead className="font-bold">GRADE</TableHead>
  //                 <TableHead className="font-bold">TEACHER</TableHead>
  //                 <TableHead className="font-bold">STUDENTS</TableHead>
  //                 <TableHead>ACTIONS</TableHead>
  //               </TableRow>
  //             </TableHeader>
  //             <TableBody>
  //               {allClasses.map((class_) => (
  //                 <TableRow key={class_.id}>
  //                   <TableCell className="font-medium">{class_.name}</TableCell>
  //                   <TableCell>{class_.subject_in_short}</TableCell>
  //                   <TableCell>{class_.grade}</TableCell>
  //                   <TableCell>{class_.teacher.full_name}</TableCell>
  //                   <TableCell>
  //                     <div className="flex items-center gap-2 ">
  //                       {class_.students.length}
  //                       <Button
  //                         variant="ghost"
  //                         size="icon"
  //                         className="h-8 w-8 hover:bg-blue-50"
  //                         onClick={() => handleViewDetails(class_)}
  //                       >
  //                         <Eye className="h-4 w-4 text-[#25AAE1]" />
  //                       </Button>
  //                     </div>
  //                   </TableCell>
  //                   <TableCell>
  //                     <div className="flex gap-2">
  //                       <AddClassDialog
  //                         setRefreshTime={setRefreshTime}
  //                         existingClass={class_}
  //                       />
  //                       <Button
  //                         variant="ghost"
  //                         size="icon"
  //                         className="h-8 w-8 hover:bg-red-50"
  //                         onClick={() => handleDeleteClass(class_.id)}
  //                       >
  //                         <Trash2 className="h-4 w-4 text-red-500" />
  //                       </Button>
  //                     </div>
  //                   </TableCell>
  //                 </TableRow>
  //               ))}
  //             </TableBody>
  //           </Table>
  //         ) : (
  //           <NoData />
  //         )}
  //       </>
  //     )}
  //   </div>
  // );

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
                    <TableCell className="font-medium">{class_.name}</TableCell>
                    <TableCell>{class_.subject_in_short}</TableCell>
                    <TableCell>{class_.grade}</TableCell>
                    <TableCell>{class_.teacher.full_name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {class_.students.length}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-blue-50"
                          onClick={() => handleViewDetails(class_)}
                        >
                          <Eye className="h-4 w-4 text-[#25AAE1]" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <AddClassDialog
                          setRefreshTime={setRefreshTime}
                          existingClass={class_}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-red-50"
                          onClick={() => handleDeleteClass(class_.id)}
                        >
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