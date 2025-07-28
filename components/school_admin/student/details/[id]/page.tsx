"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  FiArrowLeft,  FiBook,
  FiUsers,  FiEdit2, FiMessageSquare,
  FiDollarSign, FiClipboard, FiAward, FiAlertCircle,
  FiUser
} from 'react-icons/fi';
import { Loader } from "@/components/ui/loader";

interface StudentDetail {
  id: number;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    full_name: string;
    role: string;
  };
  school: {
    id: number;
    name: string;
    email: string;
    phone_number: string;
  };
  academic_info: {
    grade: string;
    class: string;
    enrollment_date: string;
    academic_year: string;
    homeroom_teacher: string;
  };
  contact_info: {
    address: string;
    parent_name: string;
    parent_phone: string;
    parent_email: string;
    emergency_contact: string;
  };
  financial_info: {
    tuition_status: 'paid' | 'partial' | 'unpaid';
    last_payment_date: string;
    balance_due: number;
  };
  performance: {
    attendance_rate: number;
    average_grade: string;
    last_evaluation: string;
  };
  enrolled_courses: {
    id: number;
    name: string;
    teacher: string;
    schedule: string;
    current_grade: string;
  }[];
  documents: {
    id: number;
    name: string;
    type: string;
    upload_date: string;
  }[];
}

const StudentDetailsPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        // Remplacez par votre appel API réel
        const response = await fetch(`/api/school-admin/students/${params.id}`);
        const data = await response.json();

        if (!response.ok) throw new Error(data.message || 'Failed to fetch student data');

        setStudent(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentData();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center p-6 bg-white rounded-lg shadow">
          <div className="text-red-500 mb-4">
            <FiAlertCircle className="inline text-2xl" />
          </div>
          <h3 className="text-lg font-medium mb-2">Error Loading Student</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Student not found</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 min-h-screen p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with back button */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FiArrowLeft className="mr-2" />
            Back to Students List
          </button>
        </div>

        {/* Student Profile Header */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center">
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                {student.user.first_name[0]}{student.user.last_name[0]}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{student.user.full_name}</h1>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="text-gray-600">
                    {student.academic_info.grade} - Class {student.academic_info.class}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    student.performance.attendance_rate > 90 ? 'bg-green-100 text-green-800' : 
                    student.performance.attendance_rate > 75 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                  }`}>
                    Attendance: {student.performance.attendance_rate}%
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    student.financial_info.tuition_status === 'paid' ? 'bg-green-100 text-green-800' :
                    student.financial_info.tuition_status === 'partial' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                  }`}>
                    Tuition: {student.financial_info.tuition_status}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center">
                <FiEdit2 className="mr-2" />
                Edit
              </button>
              <button className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700 flex items-center">
                <FiMessageSquare className="mr-2" />
                Message
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Personal Info */}
          <div className="space-y-6">
            {/* Personal Information Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiUser className="text-gray-400 mr-2" />
                Personal Information
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-sm font-medium">{student.user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Enrollment Date</p>
                  <p className="text-sm font-medium">
                    {new Date(student.academic_info.enrollment_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Academic Year</p>
                  <p className="text-sm font-medium">{student.academic_info.academic_year}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Homeroom Teacher</p>
                  <p className="text-sm font-medium">{student.academic_info.homeroom_teacher}</p>
                </div>
              </div>
            </div>

            {/* Contact Information Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiUsers className="text-gray-400 mr-2" />
                Contact Information
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="text-sm font-medium">{student.contact_info.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Parent/Guardian</p>
                  <p className="text-sm font-medium">{student.contact_info.parent_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Parent Phone</p>
                  <p className="text-sm font-medium">{student.contact_info.parent_phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Parent Email</p>
                  <p className="text-sm font-medium">{student.contact_info.parent_email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Emergency Contact</p>
                  <p className="text-sm font-medium">{student.contact_info.emergency_contact}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column - Academic Info */}
          <div className="space-y-6">
            {/* Academic Performance Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiAward className="text-gray-400 mr-2" />
                Academic Performance
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Attendance Rate</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${
                        student.performance.attendance_rate > 90 ? 'bg-green-500' : 
                        student.performance.attendance_rate > 75 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${student.performance.attendance_rate}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-right">
                    {student.performance.attendance_rate}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Average Grade</p>
                  <p className="text-sm font-medium">{student.performance.average_grade}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Evaluation</p>
                  <p className="text-sm font-medium">{student.performance.last_evaluation}</p>
                </div>
              </div>
            </div>

            {/* Enrolled Courses Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiBook className="text-gray-400 mr-2" />
                Enrolled Courses ({student.enrolled_courses.length})
              </h2>
              <div className="space-y-3">
                {student.enrolled_courses.map((course) => (
                  <div key={course.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{course.name}</p>
                        <p className="text-sm text-gray-500 mt-1">Teacher: {course.teacher}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded block mb-1">
                          {course.schedule}
                        </span>
                        <span className="text-xs font-medium">
                          Grade: {course.current_grade}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Financial & Documents */}
          <div className="space-y-6">
            {/* Financial Information Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiDollarSign className="text-gray-400 mr-2" />
                Financial Information
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Tuition Status</p>
                  <p className={`text-sm font-medium ${
                    student.financial_info.tuition_status === 'paid' ? 'text-green-600' :
                    student.financial_info.tuition_status === 'partial' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {student.financial_info.tuition_status.toUpperCase()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Payment Date</p>
                  <p className="text-sm font-medium">
                    {student.financial_info.last_payment_date ?
                      new Date(student.financial_info.last_payment_date).toLocaleDateString() :
                      'No payments recorded'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Balance Due</p>
                  <p className="text-sm font-medium">
                    ${student.financial_info.balance_due.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Documents Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiClipboard className="text-gray-400 mr-2" />
                Student Documents ({student.documents.length})
              </h2>
              <div className="space-y-3">
                {student.documents.length > 0 ? (
                  student.documents.map((doc) => (
                    <div key={doc.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">{doc.name}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {doc.type} • Uploaded: {new Date(doc.upload_date).toLocaleDateString()}
                        </p>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No documents uploaded</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailsPage;
