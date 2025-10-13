/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FiArrowLeft, FiUser, FiBook, FiAward, 
  FiClipboard, FiHome, FiPhone,
  FiUsers, FiEdit2, FiMessageSquare, FiCalendar
} from 'react-icons/fi';
import { getTeacherData } from '@/services/admin-service';
import { useRequestInfo } from '@/hooks/useRequestInfo';

interface TeacherDetail {
  id: number;
  user: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
  };
  professional?: {
    department: string;
    position: string;
    hire_date: string;
    qualification: string;
    specialization: string;
  };
  contact?: {
    address: string;
    emergency_contact: string;
    emergency_phone: string;
  };
  schedule?: {
    days: string[];
    hours: string;
    office_hours: string;
  };
  courses: {
    id: number;
    name: string;
    grade?: string;
    schedule?: string;
    students?: number;
  }[];
  documents?: {
    name: string;
    type: string;
    date: string;
  }[];
  school?: {
    name: string;
    email: string;
    phone_number: string;
    code: string;
    is_active: boolean;
  };
  uuid?: string;
  created_at?: string;
  last_update?: string;
  extra_data?: any;
}

const TeacherDetailsPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const { tenantDomain, accessToken } = useRequestInfo();
  const [teacher, setTeacher] = useState<TeacherDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getTeacherProfile = async () => {
      try {
        console.log("fetching data...");
        setIsLoading(true);
        const result = await getTeacherData(accessToken, tenantDomain, params.id);
        console.log("result", result);
        
        if (result.success && result.data) {
          // Transform API data to match our interface
          const teacherData: TeacherDetail = {
            id: result.data.id,
            user: {
              first_name: result.data.user.first_name,
              last_name: result.data.user.last_name,
              email: result.data.user.email,
              phone: result.data.school?.phone_number
            },
            professional: {
              department: result.data.school?.name || "Not specified",
              position: "Teacher",
              hire_date: result.data.created_at || new Date().toISOString(),
              qualification: "Not specified",
              specialization: result.data.courses.map((c: any) => c.name).join(', ') || "Not specified"
            },
            contact: {
              address: "Not specified",
              emergency_contact: "Not specified",
              emergency_phone: "Not specified"
            },
            schedule: {
              days: ["Monday", "Wednesday", "Friday"],
              hours: "8:00 AM - 3:30 PM",
              office_hours: "Monday/Wednesday 2:00-3:00 PM"
            },
            courses: result.data.courses || [],
            documents: [
              {
                name: "Teaching Certificate",
                type: "Professional",
                date: result.data.created_at || new Date().toISOString()
              }
            ],
            school: result.data.school,
            uuid: result.data.uuid,
            created_at: result.data.created_at,
            last_update: result.data.last_update,
            extra_data: result.data.extra_data
          };
          setTeacher(teacherData);
        }
      } catch (error) {
        console.error("Error fetching teacher profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getTeacherProfile();
  }, [accessToken, tenantDomain, params.id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US');
  };

  // Skeleton Loader Component
  const SkeletonLoader = ({ className = "" }: { className?: string }) => (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
  );

  if (isLoading) {
    return (
      <div className="w-full bg-light min-h-screen">
        {/* Header Skeleton */}
        <div className="bg-white py-6 rounded-lg shadow border border-gray-100">
          <div className="w-full mx-auto p-0 sm:px-6">
            <div className="mb-6 flex justify-between items-center">
              <SkeletonLoader className="w-32 h-6" />
              <div className="flex gap-2">
                <SkeletonLoader className="w-20 h-9" />
                <SkeletonLoader className="w-24 h-9" />
              </div>
            </div>
            <div className="flex items-center">
              <SkeletonLoader className="w-16 h-16 rounded-full" />
              <div className="ml-4">
                <SkeletonLoader className="w-48 h-7 mb-2" />
                <SkeletonLoader className="w-32 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Body Skeleton */}
        <div className="mt-8 mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-white p-6 rounded-lg shadow border border-gray-100">
          {/* Tabs Skeleton */}
          <div className="mb-6 border-b border-gray-200">
            <div className="flex space-x-8">
              {[1, 2, 3, 4, 5].map((item) => (
                <SkeletonLoader key={item} className="w-24 h-12" />
              ))}
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <SkeletonLoader className="w-32 h-6 mb-4" />
                <div className="space-y-3">
                  {[1, 2, 3].map((subItem) => (
                    <div key={subItem}>
                      <SkeletonLoader className="w-20 h-4 mb-1" />
                      <SkeletonLoader className="w-full h-5" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="w-full bg-light min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Teacher Not Found</h2>
          <p className="text-gray-600 mb-4">The requested teacher could not be loaded.</p>
          <button
            onClick={() => router.back()}
            className="flex items-center text-blue-600 hover:text-blue-800 mx-auto"
          >
            <FiArrowLeft className="mr-2" />
            Back to Teachers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-light min-h-screen">
      {/* Header Section */}
      <div className="bg-white py-6 rounded-lg shadow border border-gray-100">
        <div className="w-full mx-auto p-0 sm:px-6">
          <div className="mb-6 flex justify-between items-center">
            <button
              onClick={() => router.back()}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <FiArrowLeft className="mr-2" />
              Back to Teachers
            </button>
            <div className="flex gap-2">
              <button className="px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center">
                <FiEdit2 className="mr-2" />
                Edit
              </button>
              <button className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700 flex items-center">
                <FiMessageSquare className="mr-2" />
                Message
              </button>
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mr-4">
              <span className="text-xl font-medium text-blue-600">
                {teacher.user.first_name[0]}{teacher.user.last_name[0]}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{teacher.user.first_name} {teacher.user.last_name}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="text-gray-600">
                  {teacher.professional?.position}, {teacher.professional?.department}
                </span>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body Section */}
      <div className=" mt-8 mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-white p-6 rounded-lg shadow border border-gray-100">
        {/* Tabs Navigation */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'overview' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <FiHome className="mr-2" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('professional')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'professional' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <FiUser className="mr-2" />
              Professional
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'schedule' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <FiCalendar className="mr-2" />
              Schedule
            </button>
            <button
              onClick={() => setActiveTab('courses')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'courses' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <FiBook className="mr-2" />
              Courses
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'documents' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <FiClipboard className="mr-2" />
              Documents
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information Card */}
              <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiUser className="text-gray-400 mr-2" />
                  Personal Information
                </h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-sm font-medium">{teacher.user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-sm font-medium">{teacher.user.phone || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="text-sm font-medium">{teacher.contact?.address || "Not specified"}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information Card */}
              <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiUsers className="text-gray-400 mr-2" />
                  Emergency Contact
                </h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Contact Name</p>
                    <p className="text-sm font-medium">{teacher.contact?.emergency_contact || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Contact Phone</p>
                    <p className="text-sm font-medium">{teacher.contact?.emergency_phone || "Not specified"}</p>
                  </div>
                  <div className="flex space-x-4 pt-2">
                    <button className="flex items-center text-blue-600 hover:text-blue-800 text-sm">
                      <FiPhone className="mr-1" /> Call Emergency
                    </button>
                  </div>
                </div>
              </div>

              {/* Professional Summary Card */}
              <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiAward className="text-gray-400 mr-2" />
                  Professional Summary
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="text-sm font-medium">{teacher.professional?.department || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Position</p>
                    <p className="text-sm font-medium">{teacher.professional?.position || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Hire Date</p>
                    <p className="text-sm font-medium">
                      {teacher.professional?.hire_date ? formatDate(teacher.professional.hire_date) : "Not specified"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Teaching Status Card */}
              <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiBook className="text-gray-400 mr-2" />
                  Teaching Status
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Courses Teaching</p>
                    <p className="text-xl font-semibold">{teacher.courses.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Students</p>
                    <p className="text-xl font-semibold">
                      {teacher.courses.reduce((sum, course) => sum + (course.students || 0), 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Specialization</p>
                    <p className="text-sm font-medium">{teacher.professional?.specialization || "Not specified"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Professional Tab */}
          {activeTab === 'professional' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiUser className="text-gray-400 mr-2" />
                  Professional Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Department</p>
                      <p className="text-sm font-medium">{teacher.professional?.department || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Position</p>
                      <p className="text-sm font-medium">{teacher.professional?.position || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Hire Date</p>
                      <p className="text-sm font-medium">
                        {teacher.professional?.hire_date ? formatDate(teacher.professional.hire_date) : "Not specified"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Qualification</p>
                      <p className="text-sm font-medium">{teacher.professional?.qualification || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Specialization</p>
                      <p className="text-sm font-medium">{teacher.professional?.specialization || "Not specified"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-sm font-medium">{teacher.user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-sm font-medium">{teacher.user.phone || "Not specified"}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="text-sm font-medium">{teacher.contact?.address || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Emergency Contact</p>
                      <p className="text-sm font-medium">
                        {teacher.contact?.emergency_contact || "Not specified"} 
                        {teacher.contact?.emergency_phone && ` (${teacher.contact.emergency_phone})`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Schedule Tab */}
          {activeTab === 'schedule' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiCalendar className="text-gray-400 mr-2" />
                  Teaching Schedule
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Working Days</p>
                      <p className="text-sm font-medium">
                        {teacher.schedule?.days?.join(', ') || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Working Hours</p>
                      <p className="text-sm font-medium">{teacher.schedule?.hours || "Not specified"}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Office Hours</p>
                    <p className="text-sm font-medium">{teacher.schedule?.office_hours || "Not specified"}</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Weekly Schedule
                </h2>
                {teacher.courses.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {teacher.courses.map((course, index) => (
                          <tr key={course.id || index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{course.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {course.schedule || "Not specified"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {course.grade ? `Grade ${course.grade}` : "Not specified"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500">No courses assigned</p>
                )}
              </div>
            </div>
          )}

          {/* Courses Tab */}
          {activeTab === 'courses' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Teaching Courses ({teacher.courses.length})
                </h2>
                {teacher.courses.length > 0 ? (
                  <div className="space-y-3">
                    {teacher.courses.map((course, index) => (
                      <div key={course.id || index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">{course.name}</p>
                            <p className="text-sm text-gray-500 mt-1">
                              {course.grade ? `Grade ${course.grade}` : ""} 
                              {course.students ? ` • ${course.students} students` : ""}
                            </p>
                          </div>
                          <div className="text-right">
                            {course.schedule && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded block mb-1">
                                {course.schedule}
                              </span>
                            )}
                            <button className="text-blue-600 hover:text-blue-800 text-sm">
                              View Roster
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No courses assigned to this teacher.</p>
                )}
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Teaching Summary
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                    <p className="text-sm text-gray-500">Total Courses</p>
                    <p className="text-2xl font-semibold">{teacher.courses.length}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                    <p className="text-sm text-gray-500">Total Students</p>
                    <p className="text-2xl font-semibold">
                      {teacher.courses.reduce((sum, course) => sum + (course.students || 0), 0)}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                    <p className="text-sm text-gray-500">Years Teaching</p>
                    <p className="text-2xl font-semibold">
                      {teacher.professional?.hire_date 
                        ? new Date().getFullYear() - new Date(teacher.professional.hire_date).getFullYear()
                        : "N/A"
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiClipboard className="text-gray-400 mr-2" />
                  Professional Documents ({teacher.documents?.length || 0})
                </h2>
                {teacher.documents && teacher.documents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {teacher.documents.map((doc, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-200 transition-colors">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{doc.name}</p>
                            <p className="text-sm text-gray-500 mt-1">{doc.type}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              Uploaded on {formatDate(doc.date)}
                            </p>
                          </div>
                          <button className="text-blue-600 hover:text-blue-800 p-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No documents available.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDetailsPage;