"use client";
import { useState, useEffect } from 'react';
import { 
  FiSearch, FiPlus, FiChevronRight, FiAward, 
  FiUsers, FiEdit2, FiAlertCircle, FiEdit,
  FiX, FiBook, FiUser, FiMail, FiTrendingUp
} from 'react-icons/fi';
import AddGradeModal from './add-grade-modal';
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import EditGradeModal from './EditGradeModal';

interface Grade {
  id: string;
  name: string;
  code: string;
  level: 'Elementary' | 'Middle' | 'High';
  students_count: number;
  teachers_count: number;
  courses: string[];
  head_teacher: {
    name: string;
    email: string;
  };
  average_grade?: number;
  attendance_rate?: number;
}

const defaultGrades: Grade[] = [
  {
    id: 'g1',
    name: 'Grade 10',
    code: 'G10',
    level: 'High',
    students_count: 125,
    teachers_count: 8,
    courses: ['Mathematics', 'Physics', 'Chemistry', 'Literature'],
    head_teacher: {
      name: 'Sarah Johnson',
      email: 's.johnson@school.edu'
    },
    average_grade: 85.2,
    attendance_rate: 94.5
  },
  {
    id: 'g2',
    name: 'Grade 6',
    code: 'G6',
    level: 'Middle',
    students_count: 95,
    teachers_count: 5,
    courses: ['Mathematics', 'Science', 'English', 'History'],
    head_teacher: {
      name: 'Michael Brown',
      email: 'm.brown@school.edu'
    },
    average_grade: 78.9,
    attendance_rate: 96.2
  },
  {
    id: 'g3',
    name: 'Grade 2',
    code: 'G2',
    level: 'Elementary',
    students_count: 80,
    teachers_count: 4,
    courses: ['Reading', 'Writing', 'Arithmetic', 'Science Basics'],
    head_teacher: {
      name: 'Emily Davis',
      email: 'e.davis@school.edu'
    },
    average_grade: 88.7,
    attendance_rate: 98.1
  },
  {
    id: 'g4',
    name: 'Grade 11',
    code: 'G11',
    level: 'High',
    students_count: 110,
    teachers_count: 9,
    courses: ['Advanced Math', 'Biology', 'Chemistry', 'World Literature'],
    head_teacher: {
      name: 'Robert Wilson',
      email: 'r.wilson@school.edu'
    },
    average_grade: 82.4,
    attendance_rate: 92.8
  }
];

const GradesList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'Elementary' | 'Middle' | 'High'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error,] = useState<Error | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleGradeUpdated = (updatedGrade: Grade) => {
    console.log("Grade updated:", updatedGrade);
    setIsEditModalOpen(false);
  };

  const handleGradeClick = (grade: Grade) => {
    setSelectedGrade(grade);
    setIsDetailModalOpen(true);
  };

  const handleGradeAdded = () => {
    setIsAddModalOpen(false);
  };

  const filteredGrades = defaultGrades
    .filter(grade => 
      grade.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grade.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grade.head_teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(grade => 
      activeFilter === 'all' || grade.level === activeFilter
    );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-12 bg-gray-200 rounded-lg w-80"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
          Error loading grades: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-8 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Grades Management</h1>
            <p className="text-blue-100">
              {filteredGrades.length} {filteredGrades.length === 1 ? 'grade' : 'grades'} available
            </p>
          </div>
          
          <button 
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
            onClick={() => setIsAddModalOpen(true)}
          >
            <FiPlus className="text-lg" />
            <span>Add New Grade</span>
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200/50 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400 text-lg" />
            </div>
            <input
              type="text"
              placeholder="Search by grade name, code or head teacher..."
              className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            {['all', 'Elementary', 'Middle', 'High'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter as any)}
                className={`px-4 py-2 rounded-lg border transition-all ${
                  activeFilter === filter 
                    ? 'bg-blue-100 border-blue-300 text-blue-700' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                {filter === 'all' ? 'All Grades' : filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grades Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGrades.map((grade) => (
          <div 
            key={grade.id}
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer relative group"
          >
            {/* Edit Button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setSelectedGrade(grade);
                setIsEditModalOpen(true);
              }}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100"
            >
              <FiEdit className="text-lg" />
            </button>

            <div onClick={() => handleGradeClick(grade)} className="p-6">
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className={`p-3 rounded-xl ${
                  grade.level === 'Elementary' ? 'bg-blue-100 text-blue-600' :
                  grade.level === 'Middle' ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'
                }`}>
                  <FiAward className="text-2xl" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">
                    {grade.name}
                  </h3>
                  <p className="text-sm text-gray-500 capitalize">
                    {grade.level} School • {grade.code}
                  </p>
                </div>
                
                <FiChevronRight className="text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <FiUsers className="text-blue-500 text-sm" />
                    <span className="text-xs text-gray-500">Students</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{grade.students_count}</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <FiBook className="text-green-500 text-sm" />
                    <span className="text-xs text-gray-500">Courses</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{grade.courses.length}</p>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Average Grade</span>
                    <span className="text-sm font-semibold text-gray-900">{grade.average_grade}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${grade.average_grade}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Attendance Rate</span>
                    <span className="text-sm font-semibold text-gray-900">{grade.attendance_rate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${grade.attendance_rate}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Head Teacher */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <FiUser className="text-gray-400 text-sm" />
                  <span className="text-sm text-gray-600">Head Teacher:</span>
                  <span className="text-sm font-medium text-gray-900">{grade.head_teacher.name}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <AddGradeModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        onGradeAdded={handleGradeAdded}
      />
      
      <EditGradeModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        grade={selectedGrade}
        onSave={handleGradeUpdated}
      />

      {/* Detail Modal */}
      {isDetailModalOpen && selectedGrade && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">{selectedGrade.name}</h2>
                  <p className="text-gray-600 capitalize">{selectedGrade.level} School • {selectedGrade.code}</p>
                </div>
                <button 
                  onClick={() => setIsDetailModalOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX className="text-xl" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Performance Overview */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-600 rounded-lg">
                      <FiTrendingUp className="text-white text-lg" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Performance</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Average Grade</p>
                      <p className="text-2xl font-bold text-blue-600">{selectedGrade.average_grade}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Attendance Rate</p>
                      <p className="text-2xl font-bold text-green-600">{selectedGrade.attendance_rate}%</p>
                    </div>
                  </div>
                </div>

                {/* Students & Teachers */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-600 rounded-lg">
                      <FiUsers className="text-white text-lg" />
                    </div>
                    <h3 className="font-semibold text-gray-900">People</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Students</p>
                      <p className="text-2xl font-bold text-green-600">{selectedGrade.students_count}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Teachers</p>
                      <p className="text-2xl font-bold text-green-600">{selectedGrade.teachers_count}</p>
                    </div>
                  </div>
                </div>

                {/* Head Teacher */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-600 rounded-lg">
                      <FiUser className="text-white text-lg" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Head Teacher</h3>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-gray-900">{selectedGrade.head_teacher.name}</p>
                    <p className="text-sm text-gray-600">{selectedGrade.head_teacher.email}</p>
                    <button className="mt-2 text-purple-600 hover:text-purple-800 text-sm flex items-center gap-1">
                      <FiMail className="text-sm" /> Send Email
                    </button>
                  </div>
                </div>
              </div>

              {/* Courses */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FiBook className="text-blue-600" />
                  Courses Offered ({selectedGrade.courses.length})
                </h3>
                <div className="flex flex-wrap gap-3">
                  {selectedGrade.courses.map((course, index) => (
                    <span 
                      key={index} 
                      className="px-4 py-2 bg-white rounded-lg text-sm font-medium border border-gray-200 hover:border-blue-300 transition-colors"
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
                >
                  Close
                </button>
                <button 
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    setIsEditModalOpen(true);
                  }}
                  className="px-6 py-3 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-all flex items-center gap-2"
                >
                  <FiEdit2 className="text-lg" />
                  Edit Grade
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredGrades.length === 0 && !isLoading && (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-12 text-center">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <FiAward className="text-gray-400 text-3xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No grades found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm ? 'No matches for your search criteria' : 'Currently no grades in this category'}
          </p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setActiveFilter('all');
            }}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default GradesList;