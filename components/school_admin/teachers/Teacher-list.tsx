"use client";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FiSearch, FiPlus, FiChevronRight, FiUser, FiMail, FiAlertCircle, FiAward, FiClock } from 'react-icons/fi';
import { Loader } from "@/components/ui/loader";
import AddTeacherModal from './add-teacher-modal';
import { SkeletonCard } from "@/components/ui/SkeletonCard";

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

// Default teacher data
const defaultTeachers = [
  {
    id: '1',
    user: {
      first_name: 'John',
      last_name: 'Smith',
      email: 'john.smith@school.com'
    },
    subjects: ['Mathematics', 'Physics'],
    grade_levels: ['10', '11'],
    status: 'active',
    years_experience: 8,
    photo: ''
  },
  {
    id: '2',
    user: {
      first_name: 'Emily',
      last_name: 'Johnson',
      email: 'emily.johnson@school.com'
    },
    subjects: ['English', 'Literature'],
    grade_levels: ['9', '10', '11'],
    status: 'active',
    years_experience: 12,
    photo: ''
  },
  {
    id: '3',
    user: {
      first_name: 'Michael',
      last_name: 'Brown',
      email: 'michael.brown@school.com'
    },
    subjects: ['History', 'Geography'],
    grade_levels: ['8', '9', '10'],
    status: 'active',
    years_experience: 5,
    photo: ''
  },
  {
    id: '4',
    user: {
      first_name: 'Sarah',
      last_name: 'Davis',
      email: 'sarah.davis@school.com'
    },
    subjects: ['Biology', 'Chemistry'],
    grade_levels: ['10', '11', '12'],
    status: 'inactive',
    years_experience: 3,
    photo: ''
  },
  {
    id: '5',
    user: {
      first_name: 'David',
      last_name: 'Wilson',
      email: 'david.wilson@school.com'
    },
    subjects: ['Spanish', 'French'],
    grade_levels: ['7', '8', '9'],
    status: 'active',
    years_experience: 7,
    photo: ''
  }
];

const TeachersList = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Simulate loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const enhancedTeachers = defaultTeachers.map(teacher => ({
    ...teacher,
    photo: teacher.photo || '',
    status: teacher.status || (Math.random() > 0.2 ? 'active' : 'inactive')
  }));

  const handleTeacherAdded = () => {
    // In a real app, you would refresh the data here
    // For now, we'll just close the modal
    setIsAddModalOpen(false);
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
          <p className="text-lg font-medium">Data loading error</p>
          <p className="text-sm text-gray-500 mt-2">
            {error.message || "Failed to load teachers information"}
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
          <h1 className="text-3xl font-bold text-gray-900">Teachers Directory</h1>
          <p className="text-gray-600 mt-1">
            {filteredTeachers.length} {filteredTeachers.length === 1 ? 'teacher' : 'teachers'} available
          </p>
        </div>
        
        <button 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
          onClick={() => setIsAddModalOpen(true)}
        >
          <FiPlus className="text-lg" />
          <span>Add New Teacher</span>
        </button>
      </div>

      <AddTeacherModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        onTeacherAdded={handleTeacherAdded}
      />

      {/* Filter and search bar */}
      <div className="w-full bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by teacher name..."
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
            All Teachers
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
                      {teacher.photo ? (
                        <img 
                          src={teacher.photo} 
                          alt={`${teacher.user.first_name} ${teacher.user.last_name}`}
                          className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            const fallback = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                      ) : (
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center font-medium text-lg ${avatarClass}`}>
                          {initials}
                        </div>
                      )}
                      <div 
                        className={`hidden w-14 h-14 rounded-full items-center justify-center font-medium text-lg ${avatarClass}`}
                        style={{ display: 'none' }}
                      >
                        {initials}
                      </div>
                      {teacher.status === 'active' && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
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
                          Teaching Experience
                        </p>
                        <p className="text-sm font-medium">
                          {teacher.years_experience} years
                        </p>
                      </div>
                      
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${teacher.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                        {teacher.status === 'active' ? 'Active' : 'Inactive'}
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
          <h3 className="text-lg font-medium text-gray-900 mb-1">No teachers found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'No matches for your search criteria' : 'Currently no teachers in this category'}
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

export default TeachersList;