"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FiArrowLeft, FiUser, FiBook, FiAward, FiDollarSign, 
  FiClipboard, FiHome, FiMail, FiPhone,
  FiUsers, FiEdit2, FiMessageSquare, FiBarChart2,
  FiHeart, FiDroplet, FiThermometer, FiAlertCircle
} from 'react-icons/fi';
import { getStudentData } from '@/services/admin-service';
import { useRequestInfo } from '@/hooks/useRequestInfo';

interface StudentDetail {
  id: number;
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
  academic: {
    grade: string;
    class?: string;
    enrollment_date: string;
    homeroom_teacher?: string;
  };
  contact?: {
    address: string;
    parent_name: string;
    parent_phone: string;
    parent_email: string;
  };
  financial?: {
    tuition_status: 'paid' | 'partial' | 'unpaid';
    last_payment: string;
    balance: number;
  };
  performance?: {
    attendance: number;
    average: string;
    last_eval: string;
  };
  health?: {
    blood_type: string;
    allergies: string[];
    medications: string[];
    conditions: string[];
    last_checkup: string;
    emergency_contact: {
      name: string;
      phone: string;
      relation: string;
    };
  };
  courses: {
    name: string;
    teacher?: string;
    grade?: string;
    schedule?: string;
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
  grade?: number;
  created_at?: string;
  last_update?: string;
  extra_data?: any;
}

const StudentDetailsPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const { tenantDomain, accessToken } = useRequestInfo();
  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getStudentProfile = async () => {
      try {
        console.log("fetching data...");
        setIsLoading(true);
        const result = await getStudentData(accessToken, tenantDomain, params.id);
        console.log("result", result);
        
        if (result.success && result.data) {
          // Transform API data to match our interface
          const studentData: StudentDetail = {
            id: result.data.id,
            user: {
              first_name: result.data.user.first_name,
              last_name: result.data.user.last_name,
              email: result.data.user.email
            },
            academic: {
              grade: result.data.grade?.toString() || "Not specified",
              class: "Not specified",
              enrollment_date: result.data.created_at || new Date().toISOString(),
              homeroom_teacher: "Not specified"
            },
            contact: {
              address: "Not specified",
              parent_name: "Not specified",
              parent_phone: result.data.school?.phone_number || "Not specified",
              parent_email: result.data.school?.email || "Not specified"
            },
            financial: {
              tuition_status: "unpaid",
              last_payment: result.data.created_at || new Date().toISOString(),
              balance: 0
            },
            performance: {
              attendance: 0,
              average: "Not available",
              last_eval: "No evaluation yet"
            },
            health: {
              blood_type: "Not specified",
              allergies: [],
              medications: [],
              conditions: [],
              last_checkup: result.data.created_at || new Date().toISOString(),
              emergency_contact: {
                name: "Not specified",
                phone: result.data.school?.phone_number || "Not specified",
                relation: "Not specified"
              }
            },
            courses: result.data.enrolled_courses || [],
            documents: [
              {
                name: "Enrollment Form",
                type: "Administrative",
                date: result.data.created_at || new Date().toISOString()
              }
            ],
            school: result.data.school,
            grade: result.data.grade,
            created_at: result.data.created_at,
            last_update: result.data.last_update,
            extra_data: result.data.extra_data
          };
          setStudent(studentData);
        }
      } catch (error) {
        console.error("Error fetching student profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getStudentProfile();
  }, [accessToken, tenantDomain, params.id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US');
  };

  const getGradeValue = (grade: string) => {
    switch(grade) {
      case 'A': return 4.0;
      case 'A-': return 3.7;
      case 'B+': return 3.3;
      case 'B': return 3.0;
      case 'B-': return 2.7;
      case 'C+': return 2.3;
      case 'C': return 2.0;
      case 'C-': return 1.7;
      case 'D+': return 1.3;
      case 'D': return 1.0;
      default: return 0;
    }
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
              {[1, 2, 3, 4, 5, 6].map((item) => (
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

  if (!student) {
    return (
      <div className="w-full bg-light min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Student Not Found</h2>
          <p className="text-gray-600 mb-4">The requested student could not be loaded.</p>
          <button
            onClick={() => router.back()}
            className="flex items-center text-blue-600 hover:text-blue-800 mx-auto"
          >
            <FiArrowLeft className="mr-2" />
            Back to Students
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
              Back to Students
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
                {student.user.first_name[0]}{student.user.last_name[0]}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{student.user.first_name} {student.user.last_name}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="text-gray-600">
                  Grade {student.academic.grade} {student.academic.class && `- Class ${student.academic.class}`}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  (student.performance?.attendance || 0) > 90 ? 'bg-green-100 text-green-800' : 
                  (student.performance?.attendance || 0) > 75 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                }`}>
                  Attendance: {student.performance?.attendance || 0}%
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
              onClick={() => setActiveTab('academic')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'academic' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <FiBook className="mr-2" />
              Academics
            </button>
            <button
              onClick={() => setActiveTab('performance')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'performance' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <FiBarChart2 className="mr-2" />
              Performance
            </button>
            <button
              onClick={() => setActiveTab('health')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'health' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <FiHeart className="mr-2" />
              Health
            </button>
            <button
              onClick={() => setActiveTab('financial')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'financial' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <FiDollarSign className="mr-2" />
              Financial
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
                    <p className="text-sm font-medium">{student.user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Enrollment Date</p>
                    <p className="text-sm font-medium">
                      {student.academic.enrollment_date ? formatDate(student.academic.enrollment_date) : "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Homeroom Teacher</p>
                    <p className="text-sm font-medium">{student.academic.homeroom_teacher || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="text-sm font-medium">{student.contact?.address || "Not specified"}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information Card */}
              <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiUsers className="text-gray-400 mr-2" />
                  Contact Information
                </h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Parent/Guardian</p>
                    <p className="text-sm font-medium">{student.contact?.parent_name || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Parent Phone</p>
                    <p className="text-sm font-medium">{student.contact?.parent_phone || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Parent Email</p>
                    <p className="text-sm font-medium">{student.contact?.parent_email || "Not specified"}</p>
                  </div>
                  <div className="flex space-x-4 pt-2">
                    <button className="flex items-center text-blue-600 hover:text-blue-800 text-sm">
                      <FiMail className="mr-1" /> Email Parent
                    </button>
                    <button className="flex items-center text-blue-600 hover:text-blue-800 text-sm">
                      <FiPhone className="mr-1" /> Call Parent
                    </button>
                  </div>
                </div>
              </div>

              {/* Performance Summary Card */}
              <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiAward className="text-gray-400 mr-2" />
                  Performance Summary
                </h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm text-gray-500">Attendance Rate</p>
                      <span className={`text-xs font-medium ${
                        (student.performance?.attendance || 0) > 90 ? 'text-green-600' : 
                        (student.performance?.attendance || 0) > 75 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {student.performance?.attendance || 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          (student.performance?.attendance || 0) > 90 ? 'bg-green-500' : 
                          (student.performance?.attendance || 0) > 75 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${student.performance?.attendance || 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Average Grade</p>
                      <p className="text-xl font-semibold">{student.performance?.average || "N/A"}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Courses Taken</p>
                      <p className="text-xl font-semibold">{student.courses.length}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Top Grade</p>
                      <p className="text-xl font-semibold text-green-600">
                        {student.courses.length > 0 && student.courses.some(c => c.grade) 
                          ? Math.max(...student.courses.filter(c => c.grade).map(c => getGradeValue(c.grade!)))
                          : "N/A"
                        }
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">Latest Evaluation</p>
                    <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                      <p className="text-sm text-gray-700">{student.performance?.last_eval || "No evaluation available"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Status Card */}
              <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiDollarSign className="text-gray-400 mr-2" />
                  Financial Status
                </h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm text-gray-500">Tuition Status</p>
                      <span className={`text-xs font-medium ${
                        student.financial?.tuition_status === 'paid' ? 'text-green-600' :
                        student.financial?.tuition_status === 'partial' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {(student.financial?.tuition_status || 'unpaid').charAt(0).toUpperCase() + (student.financial?.tuition_status || 'unpaid').slice(1)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          student.financial?.tuition_status === 'paid' ? 'bg-green-500' :
                          student.financial?.tuition_status === 'partial' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ 
                          width: student.financial?.tuition_status === 'paid' ? '100%' :
                                 student.financial?.tuition_status === 'partial' ? '50%' : '10%'
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Balance Due</p>
                      <p className="text-xl font-semibold">
                        ${(student.financial?.balance || 0).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Payment</p>
                      <p className="text-sm font-medium">
                        {student.financial?.last_payment ? formatDate(student.financial.last_payment) : "Not available"}
                      </p>
                      {student.financial?.last_payment && (
                        <p className="text-xs text-gray-500 mt-1">
                          {Math.floor((new Date().getTime() - new Date(student.financial.last_payment).getTime()) / (1000 * 60 * 60 * 24))} days ago
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-1">Payment Schedule</p>
                    <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Term 1</span>
                        <span className={`font-medium ${
                          (student.financial?.balance || 0) < 1000 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {(student.financial?.balance || 0) < 1000 ? 'Paid' : 'Pending'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-600">Term 2</span>
                        <span className="text-gray-400">Due in 45 days</span>
                      </div>
                    </div>
                  </div>

                  <button className="w-full mt-2 px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700 flex items-center justify-center">
                    <FiDollarSign className="mr-2" />
                    Make a Payment
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Academics Tab */}
          {activeTab === 'academic' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiBook className="text-gray-400 mr-2" />
                  Academic Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Grade Level</p>
                      <p className="text-sm font-medium">Grade {student.academic.grade}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Class</p>
                      <p className="text-sm font-medium">{student.academic.class || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Enrollment Date</p>
                      <p className="text-sm font-medium">
                        {student.academic.enrollment_date ? formatDate(student.academic.enrollment_date) : "Not specified"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Homeroom Teacher</p>
                    <p className="text-sm font-medium">{student.academic.homeroom_teacher || "Not specified"}</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Enrolled Courses ({student.courses.length})
                </h2>
                {student.courses.length > 0 ? (
                  <div className="space-y-3">
                    {student.courses.map((course, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">{course.name}</p>
                            <p className="text-sm text-gray-500 mt-1">
                              Teacher: {course.teacher || "Not assigned"}
                            </p>
                          </div>
                          <div className="text-right">
                            {course.schedule && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded block mb-1">
                                {course.schedule}
                              </span>
                            )}
                            {course.grade && (
                              <span className={`text-xs font-medium ${
                                course.grade === 'A' || course.grade === 'A-' ? 'text-green-600' :
                                course.grade === 'B+' || course.grade === 'B' ? 'text-blue-600' :
                                course.grade === 'C+' || course.grade === 'C' ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                Grade: {course.grade}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No courses enrolled.</p>
                )}
              </div>
            </div>
          )}

          {/* Performance Tab */}
          {activeTab === 'performance' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiBarChart2 className="text-gray-400 mr-2" />
                  Academic Performance
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Attendance Rate</p>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${
                            (student.performance?.attendance || 0) > 90 ? 'bg-green-500' : 
                            (student.performance?.attendance || 0) > 75 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${student.performance?.attendance || 0}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1 text-right">
                        {student.performance?.attendance || 0}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Average Grade</p>
                      <p className="text-sm font-medium">{student.performance?.average || "Not available"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Evaluation</p>
                      <p className="text-sm font-medium">{student.performance?.last_eval || "No evaluation yet"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Course Grades
                </h2>
                {student.courses.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {student.courses.map((course, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{course.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.teacher || "Not assigned"}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {course.grade ? (
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  course.grade === 'A' || course.grade === 'A-' ? 'bg-green-100 text-green-800' :
                                  course.grade === 'B+' || course.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                                  course.grade === 'C+' || course.grade === 'C' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {course.grade}
                                </span>
                              ) : (
                                <span className="text-gray-400">No grade</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.schedule || "Not scheduled"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500">No courses enrolled.</p>
                )}
              </div>
            </div>
          )}

          {/* Health Tab */}
          {activeTab === 'health' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiHeart className="text-gray-400 mr-2" />
                  Health Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Medical Information */}
                  <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                    <h3 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                      <FiThermometer className="text-gray-400 mr-2" />
                      Medical Details
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Blood Type</p>
                        <p className="text-sm font-medium">{student.health?.blood_type || "Not specified"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Last Checkup</p>
                        <p className="text-sm font-medium">
                          {student.health?.last_checkup ? formatDate(student.health.last_checkup) : "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                    <h3 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                      <FiAlertCircle className="text-gray-400 mr-2" />
                      Emergency Contact
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="text-sm font-medium">{student.health?.emergency_contact.name || "Not specified"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="text-sm font-medium flex items-center gap-1">
                          <FiPhone className="text-gray-400" />
                          {student.health?.emergency_contact.phone || "Not specified"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Relation</p>
                        <p className="text-sm font-medium">{student.health?.emergency_contact.relation || "Not specified"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Allergies */}
                  <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                    <h3 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                      <FiAlertCircle className="text-gray-400 mr-2" />
                      Allergies
                    </h3>
                    {student.health?.allergies && student.health.allergies.length > 0 ? (
                      <ul className="space-y-2">
                        {student.health.allergies.map((allergy, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-red-500 mt-0.5">•</span>
                            <span className="text-sm">{allergy}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">No known allergies</p>
                    )}
                  </div>

                  {/* Medications */}
                  <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                    <h3 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                      <FiDroplet className="text-gray-400 mr-2" />
                      Medications
                    </h3>
                    {student.health?.medications && student.health.medications.length > 0 ? (
                      <ul className="space-y-2">
                        {student.health.medications.map((med, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-blue-500 mt-0.5">•</span>
                            <span className="text-sm">{med}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">No current medications</p>
                    )}
                  </div>

                  {/* Medical Conditions */}
                  <div className="bg-white p-6 rounded-lg shadow border border-gray-200 md:col-span-2">
                    <h3 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                      <FiThermometer className="text-gray-400 mr-2" />
                      Medical Conditions
                    </h3>
                    {student.health?.conditions && student.health.conditions.length > 0 ? (
                      <ul className="space-y-2">
                        {student.health.conditions.map((condition, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-purple-500 mt-0.5">•</span>
                            <span className="text-sm">{condition}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">No medical conditions</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Financial Tab */}
          {activeTab === 'financial' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiDollarSign className="text-gray-400 mr-2" />
                  Financial Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Tuition Status</p>
                      <p className={`text-sm font-medium ${
                        student.financial?.tuition_status === 'paid' ? 'text-green-600' :
                        student.financial?.tuition_status === 'partial' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {(student.financial?.tuition_status || 'unpaid').charAt(0).toUpperCase() + (student.financial?.tuition_status || 'unpaid').slice(1)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Payment Date</p>
                      <p className="text-sm font-medium">
                        {student.financial?.last_payment ? formatDate(student.financial.last_payment) : "Not available"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Balance Due</p>
                      <p className="text-sm font-medium">${(student.financial?.balance || 0).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Payment History
                </h2>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-500 text-center">
                    Payment history will be displayed here
                  </p>
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
                  Student Documents ({student.documents?.length || 0})
                </h2>
                {student.documents && student.documents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {student.documents.map((doc, index) => (
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

export default StudentDetailsPage;