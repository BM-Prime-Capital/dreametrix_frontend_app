"use client";
import React from 'react';
import { 
  FiUsers, FiBook, FiFileText, FiCheckCircle, 
  FiClock, FiTrendingUp, FiCalendar, FiMail
} from 'react-icons/fi';
import Link from 'next/link';
import { useDashboard } from '@/hooks/SchoolAdmin/use-dashboard';

const SchoolAdminDashboard = () => {
  const { data, loading, error } = useDashboard();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6 w-full">
        <div className="animate-pulse space-y-6">
          <div className="h-12 bg-gray-200 rounded-lg w-80"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6 w-full">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
          Error loading dashboard: {error}
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6 w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          School Dashboard
        </h1>
        <p className="text-gray-600">Welcome back! Here's what's happening at your school today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link href="/school_admin/students" className="group">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200 group-hover:scale-105" data-tour="students-card">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiUsers className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{data.overview.total_students}</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Students</h3>
            <p className="text-sm text-gray-500">Total enrolled</p>
          </div>
        </Link>

        <Link href="/school_admin/teachers" className="group">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200 group-hover:scale-105" data-tour="teachers-card">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <FiUsers className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{data.overview.total_teachers}</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Teachers</h3>
            <p className="text-sm text-gray-500">Active faculty</p>
          </div>
        </Link>

        <Link href="/school_admin/classes" className="group">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200 group-hover:scale-105" data-tour="classes-card">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiBook className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{data.overview.total_courses}</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Courses</h3>
            <p className="text-sm text-gray-500">Active courses</p>
          </div>
        </Link>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <FiFileText className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{data.overview.total_assessments}</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Assessments</h3>
          <p className="text-sm text-gray-500">Total created</p>
        </div>
      </div>

      {/* Submissions Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <FiClock className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{data.overview.pending_submissions}</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Pending</h3>
          <p className="text-sm text-gray-500">Awaiting review</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <FiCheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{data.overview.graded_submissions}</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Graded</h3>
          <p className="text-sm text-gray-500">Completed reviews</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FiUsers className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{data.overview.present_today}</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Present Today</h3>
          <p className="text-sm text-gray-500">Students in school</p>
        </div>
      </div>

      {/* Course Performance */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FiTrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Course Performance</h2>
        </div>
        <div className="space-y-4">
          {data.course_averages.slice(0, 6).map((course, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-900">{course.course__name}</span>
              <div className="flex items-center gap-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${Math.min(course.class_average, 100)}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-gray-700 w-12 text-right">
                  {course.class_average.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <FiCalendar className="w-5 h-5 text-purple-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/school_admin/students" className="group">
            <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group-hover:scale-105">
              <div className="flex items-center gap-3">
                <FiUsers className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900">Manage Students</span>
              </div>
            </div>
          </Link>
          <Link href="/school_admin/teachers" className="group">
            <div className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all duration-200 group-hover:scale-105">
              <div className="flex items-center gap-3">
                <FiUsers className="w-5 h-5 text-green-600" />
                <span className="font-medium text-gray-900">Manage Teachers</span>
              </div>
            </div>
          </Link>
          <Link href="/school_admin/classes" className="group">
            <div className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 group-hover:scale-105">
              <div className="flex items-center gap-3">
                <FiBook className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-gray-900">View Classes</span>
              </div>
            </div>
          </Link>
          <div className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 cursor-pointer">
            <div className="flex items-center gap-3">
              <FiMail className="w-5 h-5 text-orange-600" />
              <span className="font-medium text-gray-900">Send Message</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Students */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiUsers className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Recent Students</h2>
          </div>
          <div className="space-y-4">
            {data.recent_students.map((student) => (
              <div key={student.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">
                    {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{student.name}</p>
                  <p className="text-sm text-gray-500">Grade {student.grade}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">{new Date(student.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Assessments */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-100 rounded-lg">
              <FiFileText className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Recent Assessments</h2>
          </div>
          <div className="space-y-4">
            {data.recent_assessments.map((assessment) => (
              <div key={assessment.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{assessment.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    assessment.published 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {assessment.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{assessment.course}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{assessment.type}</span>
                  <span>Due: {new Date(assessment.due_date).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolAdminDashboard;