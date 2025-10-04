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
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const { teachers, isLoading, error, refetch } = useTeachers();
  const { baseUrl } = useBaseUrl();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const enhancedTeachers = (teachers || []).map(teacher => ({
    ...teacher,
    photo: '',
    status: 'active',
    subjects: ['Subject'],
    grade_levels: ['10'],
    years_experience: 5
  }));

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

  const downloadTemplate = () => {
    const headers = ['first_name', 'last_name', 'email', 'phone_number', 'subjects', 'grade_levels'];
    const sampleData = ['John', 'Smith', 'john.smith@email.com', '+1234567890', 'Mathematics,Physics', '10,11'];
    const csvContent = headers.join(',') + '\n' + sampleData.join(',') + '\n';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'teachers_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Template downloaded successfully!');
  };

  const filteredTeachers = enhancedTeachers
    .filter(teacher => 
      `${teacher.user.first_name} ${teacher.user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(teacher => 
      activeFilter === 'all' || teacher.status === activeFilter
    );

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
    <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-6 bg-gray-50 min-h-screen">
      {/* Header with actions */}
      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teacher Management</h1>
          <p className="text-gray-600 mt-1">
            {filteredTeachers.length} {filteredTeachers.length === 1 ? 'teacher' : 'teachers'} found
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Download template → Fill with teacher data → Upload Excel/CSV file
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
              <p className="text-blue-800 font-medium">Uploading teachers...</p>
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
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-lg border transition-all ${activeFilter === 'all' ? 'bg-indigo-100 border-indigo-300 text-indigo-700' : 'border-gray-200 hover:bg-gray-50'}`}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilter('active')}
            className={`px-4 py-2 rounded-lg border transition-all ${activeFilter === 'active' ? 'bg-green-100 border-green-300 text-green-700' : 'border-gray-200 hover:bg-gray-50'}`}
          >
            Active
          </button>
          <button
            onClick={() => setActiveFilter('inactive')}
            className={`px-4 py-2 rounded-lg border transition-all ${activeFilter === 'inactive' ? 'bg-red-100 border-red-300 text-red-700' : 'border-gray-200 hover:bg-gray-50'}`}
          >
            Inactive
          </button>
        </div>
      </div>

      {/* Teachers grid */}
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredTeachers.map((teacher) => {
            const initials = `${teacher.user.first_name[0]}${teacher.user.last_name[0]}`;
            const avatarClass = getAvatarColor(teacher.user.first_name + teacher.user.last_name);
            
            return (
              <div 
                key={teacher.id}
                onClick={() => router.push(`/school_admin/teachers/details/${teacher.id}`)}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer"
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center font-medium text-lg ${avatarClass}`}>
                        {initials}
                      </div>
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {teacher.user.first_name} {teacher.user.last_name}
                      </h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <FiAward className="text-gray-400" />
                        {teacher.subjects.join(', ')}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <FiMail className="text-gray-400" />
                        <span className="truncate">{teacher.user.email}</span>
                      </p>
                    </div>
                    
                    <FiChevronRight className="text-gray-400" />
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                          <FiClock className="text-gray-400" />
                          Experience
                        </p>
                        <p className="text-sm font-medium">
                          {teacher.years_experience} years
                        </p>
                      </div>
                      
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        Active
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Teaching grades: {teacher.grade_levels.join(', ')}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Empty state */}
      {filteredTeachers.length === 0 && !isLoading && (
        <div className="w-full bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FiUser className="text-gray-400 text-3xl" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            {searchTerm || activeFilter !== 'all' ? 'No teachers found' : 'No teachers yet'}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm
              ? "Try adjusting your search"
              : activeFilter !== 'all'
              ? "No teachers in this category"
              : "Upload an Excel file to add teachers"}
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

export default TeachersList;