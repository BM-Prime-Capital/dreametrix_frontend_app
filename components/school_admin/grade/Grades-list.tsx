"use client";
import { useState, useEffect } from 'react';
import { 
  FiSearch, FiPlus, FiChevronRight, FiAward, 
  FiUsers, FiEdit2, FiAlertCircle,FiEdit,
  FiX, FiBook, FiUser,
  FiMail,
} from 'react-icons/fi';
//import { Loader } from "@/components/ui/loader";
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
    }
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
    }
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
    }
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
    }
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
    // Ici vous devriez mettre à jour votre state ou faire un appel API
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(4)].map((_, index) => (
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
          <p className="text-lg font-medium">Data loading error</p>
          <p className="text-sm text-gray-500 mt-2">
            {error.message || "Failed to load grades information"}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-6 bg-gray-50 min-h-screen">
      {/* Header section */}
      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Grades Management</h1>
          <p className="text-gray-600 mt-1">
            {filteredGrades.length} {filteredGrades.length === 1 ? 'grade' : 'grades'} available
          </p>
        </div>
        
        <button 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
          onClick={() => setIsAddModalOpen(true)}
        >
          <FiPlus className="text-lg" />
          <span>Add New Grade</span>
        </button>
      </div>

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

      {/* Filter and search bar */}
      <div className="w-full bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by grade name, code or head teacher..."
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
            All Grades
          </button>
          <button
            onClick={() => setActiveFilter('Elementary')}
            className={`px-4 py-2 rounded-lg border transition-all ${activeFilter === 'Elementary' ? 'bg-blue-100 border-blue-300 text-blue-700' : 'border-gray-200 hover:bg-gray-50'}`}
          >
            Elementary
          </button>
          <button
            onClick={() => setActiveFilter('Middle')}
            className={`px-4 py-2 rounded-lg border transition-all ${activeFilter === 'Middle' ? 'bg-green-100 border-green-300 text-green-700' : 'border-gray-200 hover:bg-gray-50'}`}
          >
            Middle
          </button>
          <button
            onClick={() => setActiveFilter('High')}
            className={`px-4 py-2 rounded-lg border transition-all ${activeFilter === 'High' ? 'bg-purple-100 border-purple-300 text-purple-700' : 'border-gray-200 hover:bg-gray-50'}`}
          >
            High
          </button>
        </div>
      </div>

      {/* Grades grid */}
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredGrades.map((grade) => (
            <div 
                key={grade.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer relative"
            >
                {/* Bouton d'édition */}
                <button 
                onClick={(e) => {
                    e.stopPropagation();
                    setSelectedGrade(grade);
                    setIsEditModalOpen(true);
                }}
                className="absolute top-3 right-3 p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                aria-label="Edit grade"
                >
                <FiEdit className="text-lg" />
                </button>

                <div 
                onClick={() => handleGradeClick(grade)}
                className="p-5"
                >
                <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${
                    grade.level === 'Elementary' ? 'bg-blue-100 text-blue-600' :
                    grade.level === 'Middle' ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'
                    }`}>
                    <FiAward className="text-2xl" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {grade.name} ({grade.code})
                    </h3>
                    <p className="text-sm text-gray-500 capitalize">
                        {grade.level} School
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <FiUser className="text-gray-400" />
                        {grade.head_teacher.name}
                    </p>
                    </div>
                    
                    <FiChevronRight className="text-gray-400" />
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                    <div>
                        <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <FiUsers className="text-gray-400" />
                        Students
                        </p>
                        <p className="text-sm font-medium">
                        {grade.students_count} enrolled
                        </p>
                    </div>
                    
                    <div>
                        <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <FiBook className="text-gray-400" />
                        Courses
                        </p>
                        <p className="text-sm font-medium">
                        {grade.courses.length} courses
                        </p>
                    </div>
                    </div>
                </div>
                </div>
        </div>
        ))}
        </div>
      </div>

      {/* Detail Modal */}
      {isDetailModalOpen && selectedGrade && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedGrade.name} Details
                </h2>
                <button 
                  onClick={() => setIsDetailModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX className="text-xl" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Grade Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <FiAward className="text-indigo-500" />
                    Grade Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Grade Name</p>
                      <p className="font-medium">{selectedGrade.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Grade Code</p>
                      <p className="font-medium">{selectedGrade.code}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">School Level</p>
                      <p className={`font-medium capitalize ${
                        selectedGrade.level === 'Elementary' ? 'text-blue-600' :
                        selectedGrade.level === 'Middle' ? 'text-green-600' : 'text-purple-600'
                      }`}>
                        {selectedGrade.level}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Head Teacher */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <FiUser className="text-indigo-500" />
                    Head Teacher
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{selectedGrade.head_teacher.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{selectedGrade.head_teacher.email}</p>
                    </div>
                    <button className="mt-2 text-blue-600 hover:text-blue-800 text-sm flex items-center">
                      <FiMail className="mr-1" /> Send Email
                    </button>
                  </div>
                </div>

                {/* Statistics */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <FiUsers className="text-indigo-500" />
                    Statistics
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Students Enrolled</p>
                      <p className="font-medium">{selectedGrade.students_count} students</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Teachers Assigned</p>
                      <p className="font-medium">{selectedGrade.teachers_count} teachers</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Courses Offered</p>
                      <p className="font-medium">{selectedGrade.courses.length} courses</p>
                    </div>
                  </div>
                </div>

                {/* Courses */}
                <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <FiBook className="text-indigo-500" />
                    Courses Offered
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedGrade.courses.map((course, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1 bg-white rounded-full text-sm border border-gray-200"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700 transition-all flex items-center gap-2">
                  <FiEdit2 className="text-lg" />
                  Edit Grade
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {filteredGrades.length === 0 && !isLoading && (
        <div className="w-full bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FiAward className="text-gray-400 text-3xl" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No grades found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'No matches for your search criteria' : 'Currently no grades in this category'}
          </p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setActiveFilter('all');
            }}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default GradesList;