"use client";
import ClassModal from '@/components/school_admin/classes/ClassModal';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal';
import { useClasses } from '@/hooks/SchoolAdmin/use-classes';
import { useState } from 'react';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiEye, FiBook, FiAlertCircle } from 'react-icons/fi';
import { SkeletonCard } from '@/components/ui/SkeletonCard';

const ClassesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentClass, setCurrentClass] = useState<any>(null);
  const [actionType, setActionType] = useState<'view' | 'edit' | 'create'>('create');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { classes, isLoading, error, refetch } = useClasses();

  console.log('Classes from hook:', classes);
  console.log('Classes length:', classes?.length);

  const filteredClasses = (classes || []).filter((cls: any) => {
    const teacherName = cls.teacher && typeof cls.teacher === 'object' ? cls.teacher.full_name || '' : cls.teacher || '';
    const subject = cls.subject_in_all_letter || cls.subject_in_short || '';
    return cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           subject.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClasses = filteredClasses.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };



  const handleEditClass = (cls: any) => {
    setCurrentClass(cls);
    setActionType('edit');
    setIsModalOpen(true);
  };

  const handleViewClass = (cls: any) => {
    setCurrentClass(cls);
    setActionType('view');
    setIsModalOpen(true);
  };

  const handleDeleteClass = (cls: any) => {
    setCurrentClass(cls);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!currentClass) return;
    
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/classes/${currentClass.id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      
      if (response.ok) {
        refetch();
        setIsDeleteModalOpen(false);
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-6 bg-gray-50 min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center w-full h-full bg-white z-50">
        <div className="flex flex-col items-center text-red-500">
          <FiAlertCircle className="text-3xl mb-2" />
          <p className="text-lg font-medium">Loading error</p>
          <p className="text-sm text-gray-500 mt-2">
            {error || "Failed to load classes data"}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-8 text-white">
        <div>
          <h1 className="text-4xl font-bold mb-2">Classes Management</h1>
          <p className="text-blue-100">
            {filteredClasses.length} {filteredClasses.length === 1 ? 'class' : 'classes'} found
          </p>
        </div>
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
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Classes table */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Class Name</th>
                <th className="px-6 py-4 text-left font-semibold">Grade</th>
                <th className="px-6 py-4 text-left font-semibold">Subject</th>
                <th className="px-6 py-4 text-left font-semibold">Teacher</th>
                <th className="px-6 py-4 text-left font-semibold">Students</th>
                <th className="px-6 py-4 text-left font-semibold">Created</th>
                <th className="px-6 py-4 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedClasses.map((cls: any) => (
                <tr key={cls.id} className="hover:bg-blue-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{cls.name}</div>
                    <div className="text-sm text-gray-500">{cls.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                      Grade {cls.grade}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{cls.subject_in_all_letter}</div>
                    <div className="text-sm text-gray-500">{cls.subject_in_short}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{cls.teacher && typeof cls.teacher === 'object' ? cls.teacher.full_name : cls.teacher || 'Not assigned'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                      {cls.students?.length || 0} students
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(cls.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleViewClass(cls)}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all"
                        title="View"
                      >
                        <FiEye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditClass(cls)}
                        className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-all"
                        title="Edit"
                      >
                        <FiEdit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClass(cls)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 px-4">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredClasses.length)} of {filteredClasses.length} classes
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-2 text-sm rounded-lg ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

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
        onSuccess={refetch}
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