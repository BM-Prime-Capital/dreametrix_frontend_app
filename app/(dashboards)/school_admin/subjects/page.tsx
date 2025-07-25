// app/school-admin/subjects/page.tsx
"use client";
import { useState } from 'react';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiEye, FiBook } from 'react-icons/fi';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal';
import SubjectModal from '@/components/school_admin/subjects/SubjectModal';

interface Subject {
  id: string;
  name: string;
  code: string;
  department: string;
  gradeLevels: string[];
  creditHours: number;
  description: string;
}

const SubjectsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentSubject, setCurrentSubject] = useState<Subject | null>(null);
  const [actionType, setActionType] = useState<'view' | 'edit' | 'create'>('create');

  // Données de démonstration
  const subjects: Subject[] = [
    {
      id: '1',
      name: 'Algebra II',
      code: 'MATH-201',
      department: 'Mathematics',
      gradeLevels: ['10', '11'],
      creditHours: 1,
      description: 'Advanced algebraic concepts including quadratic equations and polynomials'
    },
    {
      id: '2',
      name: 'American Literature',
      code: 'ENG-202',
      department: 'English',
      gradeLevels: ['11', '12'],
      creditHours: 1,
      description: 'Survey of American literary works from colonial period to present'
    },
    {
      id: '3',
      name: 'Physics Honors',
      code: 'SCI-301',
      department: 'Science',
      gradeLevels: ['11', '12'],
      creditHours: 1.5,
      description: 'Advanced study of mechanics, thermodynamics, and electromagnetism'
    }
  ];

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSubject = () => {
    setCurrentSubject(null);
    setActionType('create');
    setIsModalOpen(true);
  };

  const handleEditSubject = (subject: Subject) => {
    setCurrentSubject(subject);
    setActionType('edit');
    setIsModalOpen(true);
  };

  const handleViewSubject = (subject: Subject) => {
    setCurrentSubject(subject);
    setActionType('view');
    setIsModalOpen(true);
  };

  const handleDeleteSubject = (subject: Subject) => {
    setCurrentSubject(subject);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    // Logique de suppression ici
    console.log('Deleting subject:', currentSubject);
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subject Management</h1>
          <p className="text-gray-600 mt-1">
            {filteredSubjects.length} {filteredSubjects.length === 1 ? 'subject' : 'subjects'} found
          </p>
        </div>
        
        <button 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
          onClick={handleAddSubject}
        >
          <FiPlus className="text-lg" />
          <span>Add Subject</span>
        </button>
      </div>

      {/* Search bar */}
      <div className="w-full bg-white p-4 rounded-xl shadow-sm mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by subject name, code or department..."
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Subjects grid */}
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSubjects.map(subject => (
            <div key={subject.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
              {/* Eye icon in top right corner */}
              <button 
                onClick={() => handleViewSubject(subject)}
                className="absolute top-4 right-4 text-gray-400 hover:text-indigo-600 transition-colors"
              >
                <FiEye className="h-5 w-5" />
              </button>
              
              <div className="p-5">
                <div className="flex items-start gap-3 mb-2">
                  <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                    <FiBook className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{subject.name}</h3>
                    <p className="text-sm text-gray-500">{subject.code}</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium">Department:</span> {subject.department}</p>
                  <p><span className="font-medium">Grade Levels:</span> {subject.gradeLevels.join(', ')}</p>
                  <p><span className="font-medium">Credit Hours:</span> {subject.creditHours}</p>
                  <p className="line-clamp-2"><span className="font-medium">Description:</span> {subject.description}</p>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end gap-2">
                  <button
                    onClick={() => handleEditSubject(subject)}
                    className="p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-full transition-colors"
                    title="Edit"
                  >
                    <FiEdit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteSubject(subject)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors"
                    title="Delete"
                  >
                    <FiTrash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty state */}
      {filteredSubjects.length === 0 && (
        <div className="w-full bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FiBook className="text-gray-400 text-3xl" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No subjects found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'No matches for your search criteria' : 'Currently no subjects available'}
          </p>
          <button 
            onClick={() => setSearchTerm('')}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            {searchTerm ? 'Clear search' : 'Add a new subject'}
          </button>
        </div>
      )}

      {/* Subject Modal */}
      <SubjectModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        subjectData={currentSubject}
        actionType={actionType}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Subject"
        message={`Are you sure you want to delete ${currentSubject?.name}? This action cannot be undone.`}
      />
    </div>
  );
};

export default SubjectsPage;