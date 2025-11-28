/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import {
  FiSearch,
  FiUpload,
  FiChevronRight,
  FiUser,
  FiAlertCircle,
  FiDownload,
  FiFileText,
  FiPlus,
} from "react-icons/fi";
import * as XLSX from "xlsx";
import { useStudents } from "@/hooks/SchoolAdmin/use-students";
import { useBaseUrl } from "@/hooks/SchoolAdmin/use-base-url";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { toast } from "react-toastify";
import { parseExcelUsers } from "@/services/UserBulkUploadService";
import CreateStudentModal from './CreateStudentModal';
import {Header} from "@/components/ui/Header";
import {Users} from "lucide-react";
import { Card } from "@/components/ui/card";
import {teacherPageNames} from "@/constants/userConstants";
// import {
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable
// } from "@tanstack/react-table";
const avatarColors = [
  "bg-blue-100 text-blue-600",
  "bg-green-100 text-green-600",
  "bg-yellow-100 text-yellow-600",
  "bg-purple-100 text-purple-600",
  "bg-pink-100 text-pink-600",
  "bg-indigo-100 text-indigo-600",
  "bg-teal-100 text-teal-600",
  "bg-orange-100 text-orange-600",
];

const getAvatarColor = (name: string) => {
  const charCode =
    name.charCodeAt(0) + (name.length > 1 ? name.charCodeAt(1) : 0);
  return avatarColors[charCode % avatarColors.length];
};

interface StudentsDashProps {
  studentCreationTaskId?: string;
}

const StudentsListPage = ({ studentCreationTaskId = 'school_admin_create_student' }: StudentsDashProps) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { students, isLoading, error, refetch } = useStudents();
  const { baseUrl } = useBaseUrl();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);


  // const table = useReactTable({
  //   data: students,
  //
  //
  //
  //
  //   getCoreRowModel: getCoreRowModel(),
  //   getPaginationRowModel: getPaginationRowModel(),
  //   getSortedRowModel: getSortedRowModel(),
  //   getFilteredRowModel: getFilteredRowModel(),
  //
  // });

  const enhancedStudents = students || [];
  // const enhancedStudents = students?.map(student => ({
  //   ...student,
  //   attendance: student.attendance || Math.floor(Math.random() * 30) + 70,
  //   status: student.status || (Math.random() > 0.2 ? 'active' : 'inactive'),
  //   photo: student.photo || '',
  //   class: student.class || ['A', 'B', 'C'][Math.floor(Math.random() * 3)]
  // })) || [];

  const filteredStudents = enhancedStudents
    .filter((student: any) =>
      `${student.user.first_name} ${student.user.last_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) || student.user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls') && !file.name.endsWith('.csv')) {
      toast.error('Please select an Excel file (.xlsx, .xls) or CSV file (.csv)');
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !baseUrl) return;

    try {
      console.log("Starting upload (parsed JSON)...", {
        baseUrl,
        fileName: selectedFile.name,
      });
      setIsUploading(true);

      // Parse Excel into structured student objects
      const users = await parseExcelUsers(selectedFile, "student");

      if (!users.length) {
        toast.error("No valid student rows found in the file.");
        return;
      }

      const accessToken = localStorage.getItem('accessToken');
      const uploadUrl = `${baseUrl}/school-admin/create-user/`;
      console.log('Upload URL:', uploadUrl);

      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ users }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`Upload failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('Upload result:', result);
      const message = result.created_count
        ? `Successfully uploaded ${result.created_count} students`
        : 'File processed successfully';
      toast.success(message);
      refetch();
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast.error('Failed to upload students. Please try again.');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    const headers = [
      "first_name",
      "last_name",
      "email",
      "role",
      "grade",
    ];
    const sampleRow = [
      "Jane",
      "Doe",
      "janedoe@email.com",
      "student",
      3,
    ];

    const worksheet = XLSX.utils.aoa_to_sheet([headers, sampleRow]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    XLSX.writeFile(workbook, "students_template.xlsx");
    toast.success("Template downloaded successfully!");
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-6 bg-gray-50 min-h-screen">
        {/* Header skeleton */}
        <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-10 w-36 bg-gray-200 rounded-lg animate-pulse" />
        </div>

        {/* Filter bar skeleton */}
        <div className="w-full bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse" />
          <div className="flex gap-2">
            <div className="h-10 w-20 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-10 w-20 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-10 w-20 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </div>

        {/* Students grid skeleton */}
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center w-full h-full bg-white z-50">
        <div className="flex flex-col items-center text-red-500">
          <FiAlertCircle className="text-3xl mb-2" />
          <p className="text-lg font-medium">Loading error</p>
          <p className="text-sm text-gray-500 mt-2">
            { "Failed to load student data"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (



        <section className="flex flex-col h-full w-full bg-gradient-to-br from-blue-50/30 to-blue-50/20">
          <Header title={teacherPageNames.students.title} icon={<Users/>} description={teacherPageNames.students.description} backgroundColor={"bg-gradient-to-r from-blue-600 to-purple-600"}/>

          <div className="flex-1 mx-6 pb-8 space-y-6">

            <div className="flex justify-between items-center mt-2">
              <div className="flex w-[100%] justify-end gap-3 mt-4">
                <button
                    onClick={downloadTemplate}
                    className="bg-[#D15A9D] hover:bg-[#B84A8D] text-white px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg text-sm"
                >
                  <FiDownload className="text-base"/>
                  <span>Download sample</span>
                </button>

                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg text-sm"
                >
                  <FiPlus className="text-base"/>
                  <span>Add Student</span>
                </button>


                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-[#7F569F] hover:bg-[#6B4785] text-white px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg text-sm max-w-48"
                >
                  <FiFileText className="text-base"/>
                  <span className="truncate">{selectedFile ? selectedFile.name : 'Select File'}</span>
                </button>

                <button
                    onClick={handleUpload}
                    disabled={!selectedFile || isUploading || !baseUrl}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg text-sm"
                >
                  {isUploading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                      <FiUpload className="text-base"/>
                  )}
                  <span>{isUploading ? 'Uploading..' : 'Upload'}</span>
                </button>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileSelect}
                    className="hidden"
                />
              </div>

            </div>

            <Card className="rounded-2xl shadow-xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiSearch className="text-gray-400 text-lg"/>
                  </div>
                  <input
                      type="text"
                      placeholder="Search by name or email..."
                      className="block w-full pl-12 pr-1 py-4 border-2 border-gray-200 rounded-xl bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-lg"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                  />
                </div>
              </div>

              <div className="p-6">
                <div
                    className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-dark">
                      <tr>
                        <th className="px-6 py-4 text-left font-semibold">Student Name</th>
                        <th className="px-6 py-4 text-left font-semibold">Email</th>
                        <th className="px-6 py-4 text-left font-semibold">Grade</th>
                        <th className="px-6 py-4 text-left font-semibold">School</th>
                        <th className="px-6 py-4 text-left font-semibold">Joined</th>
                        <th className="px-6 py-4 text-center font-semibold">Actions</th>
                      </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                      {paginatedStudents.map((student: any) => {
                        const initials = `${student.user.first_name[0] || ''}${student.user.last_name[0] || ''}`;
                        const avatarClass = getAvatarColor(student.user.first_name + student.user.last_name);

                        return (
                            <tr key={student.id} className="hover:bg-blue-50/50 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div
                                      className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm ${avatarClass}`}>
                                    {initials}
                                  </div>
                                  <div>
                                    <div className="font-semibold text-gray-900">
                                      {student.user.first_name} {student.user.last_name}
                                    </div>
                                    <div className="text-sm text-gray-500">Student</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-gray-900">{student.user.email}</div>
                              </td>
                              <td className="px-6 py-4">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                        Grade {student.grade}
                      </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-gray-900">{student.school?.name || 'Not assigned'}</div>
                                <div className="text-sm text-gray-500">{student.enrolled_courses?.length || 0} courses
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500">
                                {new Date(student.created_at).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center justify-center">
                                  <button
                                      onClick={() => router.push(`/school_admin/students/details/${student.id}`)}
                                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all"
                                      title="View Details"
                                  >
                                    <FiChevronRight className="h-4 w-4"/>
                                  </button>
                                </div>
                              </td>
                            </tr>
                        );
                      })}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 px-4">
                    <div className="text-sm text-gray-600">
                      Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredStudents.length)} of {filteredStudents.length} students
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      {Array.from({length: totalPages}, (_, i) => i + 1).map(page => (
                          <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`px-3 py-2 text-sm rounded-lg ${
                                  currentPage === page
                                      ? 'bg-blue-600 text-white'
                                      : 'border border-gray-300 hover:bg-gray-50'
                              }`}
                          >
                            {page}
                          </button>
                      ))}
                      <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
              )}
              {/* Empty state */}
              {filteredStudents.length === 0 && !isLoading && (
                  <div className="w-full bg-white rounded-xl shadow-sm p-8 text-center">
                    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <FiUser className="text-gray-400 text-3xl"/>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      {searchTerm ? 'No students found' : 'No students yet'}
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {searchTerm
                          ? "Try adjusting your search"
                          : "Upload an Excel file to add students"}
                    </p>
                    {searchTerm ? (
                        <button
                            onClick={() => setSearchTerm("")}
                            className="text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                          Clear search
                        </button>
                    ) : (
                        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                          <button
                              onClick={downloadTemplate}
                              className="bg-[#D15A9D] hover:bg-[#B84A8D] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
                          >
                            <FiDownload className="text-base"/>
                            <span>Download Template</span>
                          </button>
                          <span className="text-gray-400">then</span>
                          <button
                              onClick={() => fileInputRef.current?.click()}
                              className="bg-[#7F569F] hover:bg-[#6B4785] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
                          >
                            <FiFileText className="text-base"/>
                            <span>Select File</span>
                          </button>
                        </div>
                    )}
                  </div>
              )}

              <CreateStudentModal
                  isOpen={showCreateModal}
                  onClose={() => setShowCreateModal(false)}
                  onSuccess={refetch}
                  taskId={studentCreationTaskId}
              />
            </Card>
          </div>
        </section>
  );
};

export default StudentsListPage;
