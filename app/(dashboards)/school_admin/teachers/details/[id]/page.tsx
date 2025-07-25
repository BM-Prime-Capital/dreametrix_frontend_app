"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FiArrowLeft, FiUser, FiBook, FiAward, FiDollarSign, 
  FiClipboard, FiHome, FiMail, FiPhone,
  FiUsers, FiEdit2, FiMessageSquare, FiBarChart2, FiCalendar, FiClock
} from 'react-icons/fi';

interface TeacherDetail {
  id: number;
  user: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
  professional: {
    department: string;
    position: string;
    hire_date: string;
    qualification: string;
    specialization: string;
  };
  contact: {
    address: string;
    emergency_contact: string;
    emergency_phone: string;
  };
  schedule: {
    days: string[];
    hours: string;
    office_hours: string;
  };
  courses: {
    name: string;
    grade: string;
    schedule: string;
    students: number;
  }[];
  documents: {
    name: string;
    type: string;
    date: string;
  }[];
}

const TeacherDetailsPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  // Test data
  const teacher: TeacherDetail = {
    id: Number(params.id),
    user: {
      first_name: "Sarah",
      last_name: "Johnson",
      email: "sarah.johnson@school.edu",
      phone: "+1555987654"
    },
    professional: {
      department: "Mathematics",
      position: "Senior Teacher",
      hire_date: "2018-08-15",
      qualification: "M.Ed in Mathematics Education",
      specialization: "Algebra & Calculus"
    },
    contact: {
      address: "456 Oak Avenue, Boston",
      emergency_contact: "Michael Johnson",
      emergency_phone: "+1555123789"
    },
    schedule: {
      days: ["Monday", "Wednesday", "Friday"],
      hours: "8:00 AM - 3:30 PM",
      office_hours: "Monday/Wednesday 2:00-3:00 PM"
    },
    courses: [
      {
        name: "Advanced Calculus",
        grade: "12",
        schedule: "Mon/Wed 10:00-11:30",
        students: 24
      },
      {
        name: "Algebra II",
        grade: "10",
        schedule: "Tue/Thu 9:00-10:30",
        students: 28
      },
      {
        name: "Geometry",
        grade: "9",
        schedule: "Mon/Fri 1:00-2:30",
        students: 22
      }
    ],
    documents: [
      {
        name: "Teaching Certificate",
        type: "Professional",
        date: "2018-07-20"
      },
      {
        name: "Degree Transcript",
        type: "Academic",
        date: "2018-08-01"
      },
      {
        name: "Background Check",
        type: "Administrative",
        date: "2018-08-10"
      }
    ]
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US');
  };

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
                  {teacher.professional.position}, {teacher.professional.department}
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
                    <p className="text-sm font-medium">{teacher.user.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="text-sm font-medium">{teacher.contact.address}</p>
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
                    <p className="text-sm font-medium">{teacher.contact.emergency_contact}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Contact Phone</p>
                    <p className="text-sm font-medium">{teacher.contact.emergency_phone}</p>
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
                    <p className="text-sm font-medium">{teacher.professional.department}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Position</p>
                    <p className="text-sm font-medium">{teacher.professional.position}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Hire Date</p>
                    <p className="text-sm font-medium">{formatDate(teacher.professional.hire_date)}</p>
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
                      {teacher.courses.reduce((sum, course) => sum + course.students, 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Specialization</p>
                    <p className="text-sm font-medium">{teacher.professional.specialization}</p>
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
                      <p className="text-sm font-medium">{teacher.professional.department}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Position</p>
                      <p className="text-sm font-medium">{teacher.professional.position}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Hire Date</p>
                      <p className="text-sm font-medium">{formatDate(teacher.professional.hire_date)}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Qualification</p>
                      <p className="text-sm font-medium">{teacher.professional.qualification}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Specialization</p>
                      <p className="text-sm font-medium">{teacher.professional.specialization}</p>
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
                      <p className="text-sm font-medium">{teacher.user.phone}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="text-sm font-medium">{teacher.contact.address}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Emergency Contact</p>
                      <p className="text-sm font-medium">{teacher.contact.emergency_contact} ({teacher.contact.emergency_phone})</p>
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
                      <p className="text-sm font-medium">{teacher.schedule.days.join(', ')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Working Hours</p>
                      <p className="text-sm font-medium">{teacher.schedule.hours}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Office Hours</p>
                    <p className="text-sm font-medium">{teacher.schedule.office_hours}</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Weekly Schedule
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {teacher.courses.map((course, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {course.schedule.split(' ')[0].includes('Mon') ? 'Monday' : 
                             course.schedule.split(' ')[0].includes('Tue') ? 'Tuesday' :
                             course.schedule.split(' ')[0].includes('Wed') ? 'Wednesday' :
                             course.schedule.split(' ')[0].includes('Thu') ? 'Thursday' : 'Friday'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {course.schedule.split(' ')[1]}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Grade {course.grade}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
                <div className="space-y-3">
                  {teacher.courses.map((course, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{course.name}</p>
                          <p className="text-sm text-gray-500 mt-1">Grade {course.grade} • {course.students} students</p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded block mb-1">
                            {course.schedule}
                          </span>
                          <button className="text-blue-600 hover:text-blue-800 text-sm">
                            View Roster
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
                      {teacher.courses.reduce((sum, course) => sum + course.students, 0)}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                    <p className="text-sm text-gray-500">Years Teaching</p>
                    <p className="text-2xl font-semibold">
                      {new Date().getFullYear() - new Date(teacher.professional.hire_date).getFullYear()}
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
                  Professional Documents ({teacher.documents.length})
                </h2>
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
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDetailsPage;