"use client";
import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
import { FiSearch, FiUpload, FiChevronRight, FiUser, FiMail, FiAlertCircle, FiAward, FiClock, FiDownload, FiFileText } from 'react-icons/fi';
import { useTeachers } from '@/hooks/SchoolAdmin/use-teachers';
import { useBaseUrl } from '@/hooks/SchoolAdmin/use-base-url';
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { toast } from 'react-toastify';

const avatarColors = [
  'bg-blue-100 text-blue-600',
  'bg-green-100 text-green-600',
  'bg-yellow-100 text-yellow-600',
  'bg-purple-100 text-purple-600',
  'bg-pink-100 text-pink-600',
  'bg-indigo-100 text-indigo-600',
  'bg-teal-100 text-teal-600',
  'bg-orange-100 text-orange-600'
];

const getAvatarColor = (name: string) => {
  const charCode = name.charCodeAt(0) + (name.length > 1 ? name.charCodeAt(1) : 0);
  return avatarColors[charCode % avatarColors.length];
};

const TeachersList = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { teachers, isLoading, error, refetch } = useTeachers();
  const { baseUrl } = useBaseUrl();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  console.log('Teachers from hook:', teachers);
  console.log('Teachers length:', teachers?.length);
  console.log('Is loading:', isLoading);
  console.log('Error:', error);

  const enhancedTeachers = (teachers || []);

  console.log('Enhanced teachers:', enhancedTeachers);

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

    setIsUploading(true);
    const formData = new FormData();
    formData.append('excel_file', selectedFile);

    try {
      const accessToken = localStorage.getItem('accessToken');
      
      const response = await fetch(`${baseUrl}/school-admin/upload-users/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const result = await response.json();
      const message = result.created_count 
        ? `Successfully uploaded ${result.created_count} teachers`
        : 'File processed successfully';
      toast.success(message);
      refetch();
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast.error('Failed to upload teachers. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // const downloadTemplate = () => {
  //   const headers = ['first_name', 'last_name', 'email', 'phone_number', 'subjects', 'grade_levels'];
  //   const sampleData = ['John', 'Smith', 'john.smith@email.com', '+1234567890', 'Mathematics,Physics', '10,11'];
  //   const csvContent = headers.join(',') + '\n' + sampleData.join(',') + '\n';
  //   const blob = new Blob([csvContent], { type: 'text/csv' });
  //   const url = window.URL.createObjectURL(blob);
  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.download = 'teachers_template.csv';
  //   a.click();
  //   window.URL.revokeObjectURL(url);
  //   toast.success('Template downloaded successfully!');
  // };

const downloadTemplate = () => {
  // Format CORRECT pour l'importation
  const headers = ['first_name', 'last_name', 'email', 'role', 'grade_levels', 'subjects'];
  const sampleTeacher = ['John', 'Smith', 'john.smith@email.com', 'teacher', '10,11', 'Mathematics'];
  const sampleStudent = ['Jane', 'Doe', 'jane.doe@email.com', 'student', '9', ''];
  
  let csvContent = headers.join(',') + '\n';
  csvContent += sampleTeacher.join(',') + '\n';
  csvContent += sampleStudent.join(',') + '\n';
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'users_import_template.csv';
  a.click();
  window.URL.revokeObjectURL(url);
  toast.success('Template downloaded successfully!');
};

  const filteredTeachers = enhancedTeachers
    .filter((teacher: any) => {
      const fullName = `${teacher.user.first_name || ''} ${teacher.user.last_name || ''}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase()) || teacher.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    });

  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTeachers = filteredTeachers.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  console.log('Filtered teachers:', filteredTeachers);

  if (isLoading) {
    return (
      <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-6 bg-gray-50 min-h-screen">
        <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-10 w-36 bg-gray-200 rounded-lg animate-pulse" />
        </div>
        <div className="w-full bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse" />
          <div className="flex gap-2">
            <div className="h-10 w-20 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-10 w-20 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-10 w-20 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </div>
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
            {error || "Failed to load teacher data"}
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-8 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Teacher Management</h1>
            <p className="text-blue-100">
              {filteredTeachers.length} {filteredTeachers.length === 1 ? 'teacher' : 'teachers'} found
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={downloadTemplate}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg text-sm"
            >
              <FiDownload className="text-base" />
              <span>Template</span>
            </button>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg text-sm max-w-48"
            >
              <FiFileText className="text-base" />
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
      </div>



      {/* Upload Status */}
      {isUploading && (
        <div className="w-full bg-blue-50 border border-blue-200 p-4 rounded-xl mb-6">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <div>
              <p className="text-blue-800 font-medium">Uploading teachers...</p>
              <p className="text-blue-600 text-sm">Please wait while we process your Excel file</p>
            </div>
          </div>
        </div>
      )}

      {/* Search bar */}
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200/50 mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400 text-lg" />
          </div>
          <input
            type="text"
            placeholder="Search by name or email..."
            className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-lg"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Teachers grid */}
      <div className="w-full">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-dark">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Teacher Name</th>
                  <th className="px-6 py-4 text-left font-semibold">Email</th>
                  <th className="px-6 py-4 text-left font-semibold">School</th>
                  <th className="px-6 py-4 text-left font-semibold">Role</th>
                  <th className="px-6 py-4 text-left font-semibold">Joined</th>
                  <th className="px-6 py-4 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedTeachers.map((teacher: any) => {
                  const initials = `${teacher.user.first_name[0] || ''}${teacher.user.last_name[0] || ''}`;
                  const avatarClass = getAvatarColor(teacher.user.first_name + teacher.user.last_name);
                  
                  return (
                    <tr key={teacher.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm ${avatarClass}`}>
                            {initials}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {teacher.user.first_name} {teacher.user.last_name}
                            </div>
                            <div className="text-sm text-gray-500">Teacher</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-900">{teacher.user.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-900">{teacher.school?.name || 'Not assigned'}</div>
                        <div className="text-sm text-gray-500">{teacher.school?.phone_number || ''}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                          {teacher.user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(teacher.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => router.push(`/school_admin/teachers/details/${teacher.id}`)}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all"
                            title="View Details"
                          >
                            <FiChevronRight className="h-4 w-4" />
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 px-4">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredTeachers.length)} of {filteredTeachers.length} teachers
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
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
      </div>

      {/* Empty state */}
      {filteredTeachers.length === 0 && !isLoading && (
        <div className="w-full bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FiUser className="text-gray-400 text-3xl" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            {searchTerm ? 'No teachers found' : 'No teachers yet'}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm
              ? "Try adjusting your search"
              : "Upload an Excel file to add teachers"}
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

export default TeachersList;