import React, { useEffect, useState } from "react";
import PageTitleH1 from "../ui/page-title-h1";
import Image from "next/image";
import { generalImages, teacherImages } from "@/constants/images";
import StatisticItem from "../ui/StatisticItem";
import { localStorageKey, views } from "@/constants/global";
import { useList } from "@/hooks/useList";
import { getClasses } from "@/services/ClassService";
import { ISchoolClass } from "@/types";
import { Loader } from "../ui/loader";
import { getAttendanceGeneralView } from "@/services/AttendanceService";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { ChevronDown } from "lucide-react";

function AttendanceGeneralView({ changeView }: { changeView: Function }) {
  const { list: data, isLoading, error } = useList(getAttendanceGeneralView);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
  const allClasses = JSON.parse(
    localStorage.getItem(localStorageKey.ALL_CLASSES)!
  );

  // Fonction pour formater le nom de la classe
  const formatClassName = (name: string) => {
    const parts = name.split(' - ');
    // Supprime la duplication du grade (ex: "Class 6 - Class 6 - Math" => "Class 6 - Math")
    if (parts.length >= 3 && parts[0] === parts[1]) {
      return `${parts[0]} - ${parts.slice(2).join(' - ')}`;
    }
    return name;
  };

  const handleClick = (selectedClass: ISchoolClass) => {
    localStorage.setItem(
      localStorageKey.CURRENT_SELECTED_CLASS,
      JSON.stringify(allClasses.find((cl: any) => cl.id === selectedClass.id))
    );
    changeView(views.FOCUSED_VIEW);
  };

  return (
    <div className="flex flex-col h-full w-full bg-gradient-to-br from-emerald-50/30 to-teal-50/20">
      {/* Enhanced Header */}
      <div className="flex justify-between items-center bg-[#79bef2] px-8 py-6 shadow-xl rounded-2xl mx-6 mt-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <PageTitleH1 title="Attendance Overview" className="text-white font-bold text-2xl" />
            <p className="text-blue-100 text-sm mt-1">Track student attendance across classes</p>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex gap-3 items-center bg-white/20 backdrop-blur-md border border-white/20 hover:bg-white/30 text-white rounded-xl px-4 py-2 font-medium transition-all duration-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span>View: {viewMode === 'cards' ? 'Cards' : 'Table'}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuCheckboxItem 
                checked={viewMode === 'cards'} 
                onCheckedChange={() => setViewMode('cards')}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Card View
                </div>
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem 
                checked={viewMode === 'table'} 
                onCheckedChange={() => setViewMode('table')}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 6h18m-9 8h9m-9 4h9m-9-8V6a2 2 0 012-2h2a2 2 0 012 2v4M3 14h6m0 0V10a2 2 0 012-2h2a2 2 0 012 2v4m-6 0v4" />
                  </svg>
                  Table View
                </div>
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 mx-6 pb-8 space-y-8">
        {/* Enhanced Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-2">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Image src={teacherImages.whole_class} alt="students" width={24} height={24} className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{data?.student_sum_all_class ?? "..."}</p>
                <p className="text-sm font-medium text-gray-600">Students</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <Image src={generalImages.attendance_ok} alt="present" width={24} height={24} className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{data?.status_present_sum_all_class ?? "..."}</p>
                <p className="text-sm font-medium text-gray-600">Present</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-xl">
                <Image src={generalImages.red_cross} alt="absent" width={24} height={24} className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{data?.status_absent_sum_all_class ?? "..."}</p>
                <p className="text-sm font-medium text-gray-600">Absent</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Image src={generalImages.question_mark} alt="late" width={24} height={24} className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">{data?.status_late_sum_all_class ?? "..."}</p>
                <p className="text-sm font-medium text-gray-600">Late</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Image src={generalImages.classes} alt="classes" width={24} height={24} className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">{data?.classes_sum ?? "..."}</p>
                <p className="text-sm font-medium text-gray-600">Classes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Classes Display */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
            <p className="text-gray-600 font-medium">Loading attendance data...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-600 font-medium text-center">{error}</p>
          </div>
        ) : (
          viewMode === 'cards' ? (
            // Card View
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.classes?.map((classItem: any, index: number) => (
                <div 
                  key={classItem.id} 
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group"
                  onClick={() => handleClick(classItem)}
                >
                  <div className={`p-6 text-white ${
                    index % 4 === 0 ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' :
                    index % 4 === 1 ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                    index % 4 === 2 ? 'bg-gradient-to-r from-purple-500 to-purple-600' :
                    'bg-gradient-to-r from-teal-500 to-teal-600'
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1 line-clamp-2">{formatClassName(classItem.name)}</h3>
                        <p className="text-white/80 text-sm">{classItem.student_sum} Students</p>
                      </div>
                      <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-green-50 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-green-600">{classItem.present_status}</p>
                        <p className="text-xs text-green-600 font-medium">Present</p>
                      </div>
                      <div className="bg-red-50 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-red-600">{classItem.absent_status}</p>
                        <p className="text-xs text-red-600 font-medium">Absent</p>
                      </div>
                      <div className="bg-yellow-50 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-yellow-600">{classItem.late_status}</p>
                        <p className="text-xs text-yellow-600 font-medium">Late</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Attendance Rate</span>
                        <span className="text-lg font-bold text-gray-900">
                          {Math.round((classItem.present_status / classItem.student_sum) * 100)}%
                        </span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-500" style={{ width: `${(classItem.present_status / classItem.student_sum) * 100}%` }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-100 p-4">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Click to manage attendance</span>
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Original Table View
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border-0 overflow-hidden">
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Class</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Students</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-emerald-700">Present</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-red-700">Absent</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-yellow-700">Late</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {data?.classes?.map((classItem: any) => (
                        <tr key={classItem.id} className="hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-teal-50/50 cursor-pointer transition-all duration-200 hover:shadow-sm" onClick={() => handleClick(classItem)}>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatClassName(classItem.name)}</td>
                          <td className="px-6 py-4 text-sm text-gray-600 text-center font-medium">{classItem.student_sum}</td>
                          <td className="px-6 py-4 text-sm text-emerald-700 text-center font-semibold">{classItem.present_status}</td>
                          <td className="px-6 py-4 text-sm text-red-700 text-center font-semibold">{classItem.absent_status}</td>
                          <td className="px-6 py-4 text-sm text-yellow-700 text-center font-semibold">{classItem.late_status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default AttendanceGeneralView;