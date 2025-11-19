/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Search, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import NoData from "../ui/no-data";
import { Loader } from "../ui/loader";
import PageTitleH1 from "../ui/page-title-h1";
import ClassSelect from "../ClassSelect";
import { Card } from "@/components/ui/card";
import { getRewardsGeneralView } from "@/services/RewardsService";
import { useRequestInfo } from "@/hooks/useRequestInfo";
import { localStorageKey } from "@/constants/global";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AllRewardFiltersPopUp from "./AllChildStudyFiltersPopUp";

interface ChildStudyViewProps {
  changeView: (viewName: string, student?: any) => void;
}

export default function ChildStudyView({ changeView }: ChildStudyViewProps) {
  const { tenantDomain: tenantPrimaryDomain, accessToken, refreshToken } = useRequestInfo();
  //const userData = JSON.parse(localStorage.getItem(localStorageKey.USER_DATA)!);
  const currentClass = JSON.parse(
    localStorage.getItem(localStorageKey.CURRENT_SELECTED_CLASS)??'{}'
  );
  
  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(10);
  const [, setFromDate] = useState("");
  const [, setToDate] = useState("");

  useEffect(() => {
    const loadStudents = async () => {
      setIsLoading(true);
      try {
        if (!tenantPrimaryDomain || !accessToken || !refreshToken) {
          console.error("Missing authentication credentials");
          return;
        }

        const apiData = await getRewardsGeneralView(
          tenantPrimaryDomain,
          accessToken,
          refreshToken,
          "", 
          "",
          currentClass?.id
        );

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const transformedData = apiData?.classes.flatMap((classItem: any) => 
          classItem.students.map((studentItem: any) => ({
            id: studentItem.student.id,
            fullName: studentItem.student.name,
            firstName: studentItem.student.name.split(' ')[0], 
            photoUrl: studentItem.student.photo || `/default-avatar.png`,
            grade: extractGradeFromClassName(classItem.className),
            class: classItem.className,
            status: studentItem.attendance > 80 ? 'Active' : 'Needs Review',
            iep: studentItem.total < 50 ? 'Yes' : 'No',
            lastEvaluation: "2023-11-15",
            rawData: {
              ...studentItem,
              className: classItem.className
            }
          }))
        );

        setStudents(transformedData);
        setFilteredStudents(transformedData);
      } catch (error) {
        console.error("Failed to load students:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStudents();
  }, [tenantPrimaryDomain, accessToken, refreshToken, currentClass?.id]);

  // Filter students based on search term
  useEffect(() => {
    const filtered = students.filter(student => 
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.class.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
    setCurrentPage(1);
  }, [searchTerm, students]);

  // Pagination logic
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleExport = () => {
    console.log("Exporting student data...");
  };

  const extractGradeFromClassName = (className: string) => {
    const match = className.match(/(\d+)(th|rd|nd|st)?\s?Grade/i);
    return match ? `${match[1]}${match[2] || 'th'} Grade` : className;
  };

  const handleViewDetails = (student: any) => {
    changeView("STUDENT_DETAILS", student.rawData);
  };

  return (
    <section className="flex flex-col h-full w-full bg-gradient-to-br from-slate-50/30 to-gray-50/20">
      {/* Enhanced Header */}
      <div className="flex justify-between items-center bg-[#79bef2] px-8 py-6 shadow-xl rounded-2xl mx-6 mt-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <PageTitleH1 title="Child Study Team" className="text-white font-bold text-2xl" />
            <p className="text-blue-100 text-sm mt-1">Student profiles and assessments</p>
          </div>
        </div>
        <ClassSelect className="text-white bg-white/20 hover:bg-white/30 border-white/30 rounded-xl backdrop-blur-sm" />
      </div>

      {/* Content Area */}
      <div className="flex-1 mx-6 pb-8 space-y-6 overflow-auto">
        {/* Stats and Search Bar */}
        <div className="flex justify-between items-center bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg mt-2">
          <div className="flex items-center gap-6">
            <div className="text-lg text-gray-700">
              <span className="font-bold text-slate-700 text-2xl">{filteredStudents.length}</span>
              <span className="text-sm text-gray-600 ml-2">students</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm"
                type="date"
                placeholder="From"
                onChange={(e) => setFromDate(e.target.value)}
              />
              <span className="text-gray-400">to</span>
              <input
                className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm"
                type="date"
                placeholder="To"
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          </div>
          <AllRewardFiltersPopUp />
        </div>

        {/* Search and Export */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 rounded-lg border-gray-300"
            />
          </div>
          <Button 
            onClick={handleExport}
            className="bg-[#79bef2] hover:bg-[#6bb0e8] text-white rounded-lg px-4 py-2"
            disabled={filteredStudents.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Students Table */}
        <Card className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border-0 overflow-hidden">
          {isLoading ? (
            <div className="p-8 flex justify-center">
              <Loader />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-gray-200">
                    <TableHead className="font-bold text-gray-800 py-4">Student</TableHead>
                    <TableHead className="font-bold text-gray-800">Grade</TableHead>
                    <TableHead className="font-bold text-gray-800">Class</TableHead>
                    <TableHead className="font-bold text-gray-800">Status</TableHead>
                    <TableHead className="font-bold text-gray-800">IEP</TableHead>
                    <TableHead className="font-bold text-gray-800 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentStudents.length > 0 ? (
                    currentStudents.map((student) => (
                      <TableRow key={student.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => handleViewDetails(student)}>
                        <TableCell className="font-medium py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border-2 border-teal-100">
                              <AvatarImage 
                                src={student.photoUrl} 
                                alt={`Photo of ${student.fullName}`}
                              />
                              <AvatarFallback className="bg-teal-100 text-teal-700">
                                {student.firstName?.charAt(0) || 'S'}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-gray-800">{student.fullName}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600">{student.grade}</TableCell>
                        <TableCell className="text-gray-600">{student.class}</TableCell>
                        <TableCell>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            student.status === 'Active' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {student.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            student.iep === 'Yes' 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {student.iep}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 hover:bg-teal-100 rounded-xl"
                            onClick={() => handleViewDetails(student)}
                          >
                            <Eye className="h-4 w-4 text-teal-600" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <NoData />
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50/50">
                  <div className="text-sm text-gray-600">
                    Showing {indexOfFirstStudent + 1} to {Math.min(indexOfLastStudent, filteredStudents.length)} of {filteredStudents.length} students
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="rounded-lg"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                      <Button
                        key={pageNumber}
                        variant={currentPage === pageNumber ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNumber)}
                        className={`rounded-lg ${
                          currentPage === pageNumber 
                            ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white' 
                            : ''
                        }`}
                      >
                        {pageNumber}
                      </Button>
                    ))}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="rounded-lg"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </section>
  );
}