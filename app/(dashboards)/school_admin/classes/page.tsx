// app/school-admin/classes/page.tsx
"use client";
import ClassModal from '@/components/school_admin/classes/ClassModal';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal';
import { useState } from 'react';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiEye, FiBook } from 'react-icons/fi';

interface Class {
  id: string;
  name: string;
  gradeLevel: string;
  teacher: string;
  studentCount: number;
  schedule: string;
}

const ClassesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentClass, setCurrentClass] = useState<Class | null>(null);
  const [actionType, setActionType] = useState<'view' | 'edit' | 'create'>('create');

  // Données de démonstration
  const classes: Class[] = [
    {
      id: '1',
      name: 'Mathematics 101',
      gradeLevel: '10',
      teacher: 'John Smith',
      studentCount: 24,
      schedule: 'Mon/Wed 9:00-10:30'
    },
    {
      id: '2',
      name: 'English Literature',
      gradeLevel: '11',
      teacher: 'Emily Johnson',
      studentCount: 18,
      schedule: 'Tue/Thu 11:00-12:30'
    },
    {
      id: '3',
      name: 'Physics Advanced',
      gradeLevel: '12',
      teacher: 'Michael Brown',
      studentCount: 15,
      schedule: 'Mon/Fri 13:00-14:30'
    }
  ];

  const filteredClasses = classes.filter(cls =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.teacher.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClass = () => {
    setCurrentClass(null);
    setActionType('create');
    setIsModalOpen(true);
  };

  const handleEditClass = (cls: Class) => {
    setCurrentClass(cls);
    setActionType('edit');
    setIsModalOpen(true);
  };

  const handleViewClass = (cls: Class) => {
    setCurrentClass(cls);
    setActionType('view');
    setIsModalOpen(true);
  };

  const handleDeleteClass = (cls: Class) => {
    setCurrentClass(cls);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    // Logique de suppression ici
    console.log('Deleting class:', currentClass);
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Classes Management</h1>
          <p className="text-gray-600 mt-1">
            {filteredClasses.length} {filteredClasses.length === 1 ? 'class' : 'classes'} found
          </p>
        </div>
        
        <button 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
          onClick={handleAddClass}
        >
          <FiPlus className="text-lg" />
          <span>Add Class</span>
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
            placeholder="Search by class name or teacher..."
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Classes grid */}
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredClasses.map(cls => (
            <div key={cls.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
              {/* Eye icon in top right corner */}
              <button 
                onClick={() => handleViewClass(cls)}
                className="absolute top-4 right-4 text-gray-400 hover:text-indigo-600 transition-colors"
              >
                <FiEye className="h-5 w-5" />
              </button>
              
              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{cls.name}</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium">Grade:</span> {cls.gradeLevel}</p>
                  <p><span className="font-medium">Teacher:</span> {cls.teacher}</p>
                  <p><span className="font-medium">Students:</span> {cls.studentCount}</p>
                  <p><span className="font-medium">Schedule:</span> {cls.schedule}</p>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end gap-2">
                  <button
                    onClick={() => handleEditClass(cls)}
                    className="p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-full transition-colors"
                    title="Edit"
                  >
                    <FiEdit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteClass(cls)}
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
      {filteredClasses.length === 0 && (
        <div className="w-full bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FiBook className="text-gray-400 text-3xl" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No classes found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'No matches for your search criteria' : 'Currently no classes available'}
          </p>
          <button 
            onClick={() => setSearchTerm('')}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            {searchTerm ? 'Clear search' : 'Add a new class'}
          </button>
        </div>
      )}

      {/* Class Modal */}
      <ClassModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        classData={currentClass}
        actionType={actionType}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Class"
        message={`Are you sure you want to delete ${currentClass?.name}? This action cannot be undone.`}
      />
    </div>
  );
};

export default ClassesPage;