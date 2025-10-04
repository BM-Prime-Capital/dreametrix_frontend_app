"use client";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import {
  FiSearch,
  FiUpload,
  FiChevronRight,
  FiUser,
  FiMail,
  FiBook,
  FiPercent,
  FiAlertCircle,
  FiDownload,
  FiFileText,
} from "react-icons/fi";
import { useStudents } from "@/hooks/SchoolAdmin/use-students";
import { useBaseUrl } from "@/hooks/SchoolAdmin/use-base-url";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { toast } from "react-toastify";
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

const StudentsListPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const { students, isLoading, error, refetch } = useStudents();
  const { baseUrl } = useBaseUrl();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const enhancedStudents = students?.map(student => ({
    ...student,
    attendance:  Math.floor(Math.random() * 30) + 70,
    status:  (Math.random() > 0.2 ? 'active' : 'inactive'),
    photo: '',
    class: ['A', 'B', 'C'][Math.floor(Math.random() * 3)]
  })) || [];
  // const enhancedStudents = students?.map(student => ({
  //   ...student,
  //   attendance: student.attendance || Math.floor(Math.random() * 30) + 70,
  //   status: student.status || (Math.random() > 0.2 ? 'active' : 'inactive'),
  //   photo: student.photo || '',
  //   class: student.class || ['A', 'B', 'C'][Math.floor(Math.random() * 3)]
  // })) || [];

  const filteredStudents = enhancedStudents
    .filter((student) =>
      `${student.user.first_name} ${student.user.last_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .filter(
      (student) => activeFilter === "all" || student.status === activeFilter
    );

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

    console.log('Starting upload...', { baseUrl, fileName: selectedFile.name });
    setIsUploading(true);
    const formData = new FormData();
    formData.append('excel_file', selectedFile);

    try {
      const accessToken = localStorage.getItem('accessToken');
      const uploadUrl = `${baseUrl}/school-admin/upload-users/`;
      console.log('Upload URL:', uploadUrl);
      
      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
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
    const headers = ['first_name', 'last_name', 'email', 'grade', 'class', 'parent_name', 'parent_email', 'parent_phone'];
    const sampleData = ['John', 'Doe', 'john.doe@email.com', '10', 'A', 'Jane Doe', 'jane.doe@email.com', '+1234567890'];
    const csvContent = headers.join(',') + '\n' + sampleData.join(',') + '\n';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Template downloaded successfully!');
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
    <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-6 bg-gray-50 min-h-screen">
      {/* Header with actions */}
      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Student Management
          </h1>
          <p className="text-gray-600 mt-1">
            {filteredStudents.length}{" "}
            {filteredStudents.length === 1 ? "student" : "students"} found
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Download template → Fill with student data → Upload Excel/CSV file
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={downloadTemplate}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg text-sm"
          >
            <FiDownload className="text-base" />
            <span>Template</span>
          </button>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg text-sm max-w-48"
          >
            <FiFileText className="text-base" />
            <span className="truncate">{selectedFile ? selectedFile.name : 'Select File'}</span>
          </button>
          
          <button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading || !baseUrl}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg text-sm"
          >
            {isUploading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <FiUpload className="text-base" />
            )}
            <span>{isUploading ? 'Uploading...' : 'Upload'}</span>
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



      {/* Upload Status */}
      {isUploading && (
        <div className="w-full bg-blue-50 border border-blue-200 p-4 rounded-xl mb-6">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <div>
              <p className="text-blue-800 font-medium">Uploading students...</p>
              <p className="text-blue-600 text-sm">Please wait while we process your Excel file</p>
            </div>
          </div>
        </div>
      )}

      {/* Control bar */}
      <div className="w-full bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name..."
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-2 rounded-lg border transition-all ${
              activeFilter === "all"
                ? "bg-indigo-100 border-indigo-300 text-indigo-700"
                : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilter("active")}
            className={`px-4 py-2 rounded-lg border transition-all ${
              activeFilter === "active"
                ? "bg-green-100 border-green-300 text-green-700"
                : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setActiveFilter("inactive")}
            className={`px-4 py-2 rounded-lg border transition-all ${
              activeFilter === "inactive"
                ? "bg-red-100 border-red-300 text-red-700"
                : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            Inactive
          </button>
        </div>
      </div>

      {/* Student cards - full width container */}
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredStudents.map((student) => {
            const initials = `${student.user.first_name[0]}${student.user.last_name[0]}`;
            const avatarClass = getAvatarColor(
              student.user.first_name + student.user.last_name
            );

            return (
              <div
                key={student.id}
                onClick={() =>
                  router.push(`/school_admin/students/details/${student.id}`)
                }
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer"
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      {student.photo ? (
                        <img 
                          src={student.photo} 
                          alt={student.user.first_name + " " + student.user.last_name}
                          className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                            const fallback = (e.target as HTMLImageElement)
                              .nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = "flex";
                          }}
                        />
                      ) : (
                        <div
                          className={`w-14 h-14 rounded-full flex items-center justify-center font-medium text-lg ${avatarClass}`}
                        >
                          {initials}
                        </div>
                      )}
                      <div
                        className={`hidden w-14 h-14 rounded-full items-center justify-center font-medium text-lg ${avatarClass}`}
                        style={{ display: "none" }}
                      >
                        {initials}
                      </div>
                      {student.status === "active" && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {student.user.first_name} {student.user.last_name}
                      </h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <FiBook className="text-gray-400" />
                        Grade {student.grade} - Class {student.class}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <FiMail className="text-gray-400" />
                        <span className="truncate">{student.user.email}</span>
                      </p>
                    </div>

                    <FiChevronRight className="text-gray-400" />
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                          <FiPercent className="text-gray-400" />
                          Attendance
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              student.attendance > 90
                                ? "bg-emerald-500"
                                : student.attendance > 75
                                ? "bg-amber-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${student.attendance}%` }}
                          />
                        </div>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          student.status === "active"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {student.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      {student.enrolled_courses?.length || 0} enrolled courses
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Empty state */}
      {filteredStudents.length === 0 && !isLoading && (
        <div className="w-full bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FiUser className="text-gray-400 text-3xl" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            {searchTerm || activeFilter !== 'all' ? 'No students found' : 'No students yet'}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm
              ? "Try adjusting your search"
              : activeFilter !== 'all'
              ? "No students in this category"
              : "Upload an Excel file to add students"}
          </p>
          {searchTerm || activeFilter !== 'all' ? (
            <button
              onClick={() => {
                setSearchTerm("");
                setActiveFilter("all");
              }}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Reset filters
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <button
                onClick={downloadTemplate}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
              >
                <FiDownload className="text-base" />
                <span>Download Template</span>
              </button>
              <span className="text-gray-400">then</span>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
              >
                <FiFileText className="text-base" />
                <span>Select File</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentsListPage;
