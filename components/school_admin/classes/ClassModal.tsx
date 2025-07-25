// components/school-admin/classes/ClassModal.tsx
"use client";
import { useState } from 'react';
import { FiX } from 'react-icons/fi';

interface ClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  classData: any;
  actionType: 'view' | 'edit' | 'create';
}

const ClassModal = ({ isOpen, onClose, classData, actionType }: ClassModalProps) => {
  const [formData, setFormData] = useState({
    name: classData?.name || '',
    gradeLevel: classData?.gradeLevel || '',
    teacher: classData?.teacher || '',
    schedule: classData?.schedule || '',
    description: classData?.description || ''
  });

  const isViewMode = actionType === 'view';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique de soumission ici
    console.log('Form submitted:', formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-gray-200 p-5 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-900">
            {isViewMode ? 'Class Details' : actionType === 'edit' ? 'Edit Class' : 'Create New Class'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Class Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isViewMode}
                className={`w-full px-3 py-2 border rounded-md ${isViewMode ? 'bg-gray-100' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-200`}
              />
            </div>
            
            <div>
              <label htmlFor="gradeLevel" className="block text-sm font-medium text-gray-700 mb-1">
                Grade Level *
              </label>
              <select
                id="gradeLevel"
                name="gradeLevel"
                value={formData.gradeLevel}
                onChange={handleChange}
                required
                disabled={isViewMode}
                className={`w-full px-3 py-2 border rounded-md ${isViewMode ? 'bg-gray-100' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-200`}
              >
                <option value="">Select Grade</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="teacher" className="block text-sm font-medium text-gray-700 mb-1">
                Teacher *
              </label>
              <input
                type="text"
                id="teacher"
                name="teacher"
                value={formData.teacher}
                onChange={handleChange}
                required
                disabled={isViewMode}
                className={`w-full px-3 py-2 border rounded-md ${isViewMode ? 'bg-gray-100' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-200`}
              />
            </div>
            
            <div>
              <label htmlFor="schedule" className="block text-sm font-medium text-gray-700 mb-1">
                Schedule *
              </label>
              <input
                type="text"
                id="schedule"
                name="schedule"
                value={formData.schedule}
                onChange={handleChange}
                required
                disabled={isViewMode}
                className={`w-full px-3 py-2 border rounded-md ${isViewMode ? 'bg-gray-100' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-200`}
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                disabled={isViewMode}
                className={`w-full px-3 py-2 border rounded-md ${isViewMode ? 'bg-gray-100' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-200`}
              />
            </div>
          </div>
          
          {!isViewMode && (
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 rounded-md text-sm font-medium text-white hover:bg-indigo-700"
              >
                {actionType === 'edit' ? 'Update Class' : 'Create Class'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ClassModal;