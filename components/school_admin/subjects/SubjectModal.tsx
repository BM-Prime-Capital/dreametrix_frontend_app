// components/school-admin/subjects/SubjectModal.tsx
"use client";
import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

interface SubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjectData: any;
  actionType: 'view' | 'edit' | 'create';
}

const departments = ['Mathematics', 'English', 'Science', 'History', 'Foreign Languages', 'Arts'];
const gradeLevels = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

const SubjectModal = ({ isOpen, onClose, subjectData, actionType }: SubjectModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    department: '',
    gradeLevels: [] as string[],
    creditHours: 1,
    description: ''
  });

  const isViewMode = actionType === 'view';

  useEffect(() => {
    if (subjectData) {
      setFormData({
        name: subjectData.name,
        code: subjectData.code,
        department: subjectData.department,
        gradeLevels: subjectData.gradeLevels,
        creditHours: subjectData.creditHours,
        description: subjectData.description
      });
    } else {
      setFormData({
        name: '',
        code: '',
        department: '',
        gradeLevels: [],
        creditHours: 1,
        description: ''
      });
    }
  }, [subjectData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGradeLevelChange = (grade: string) => {
    setFormData(prev => {
      const newGradeLevels = prev.gradeLevels.includes(grade)
        ? prev.gradeLevels.filter(g => g !== grade)
        : [...prev.gradeLevels, grade];
      
      return {
        ...prev,
        gradeLevels: newGradeLevels
      };
    });
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
            {isViewMode ? 'Subject Details' : actionType === 'edit' ? 'Edit Subject' : 'Create New Subject'}
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
                Subject Name *
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
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                Subject Code *
              </label>
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                required
                disabled={isViewMode}
                className={`w-full px-3 py-2 border rounded-md ${isViewMode ? 'bg-gray-100' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-200`}
              />
            </div>
            
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                Department *
              </label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                disabled={isViewMode}
                className={`w-full px-3 py-2 border rounded-md ${isViewMode ? 'bg-gray-100' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-200`}
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="creditHours" className="block text-sm font-medium text-gray-700 mb-1">
                Credit Hours *
              </label>
              <select
                id="creditHours"
                name="creditHours"
                value={formData.creditHours}
                onChange={handleChange}
                required
                disabled={isViewMode}
                className={`w-full px-3 py-2 border rounded-md ${isViewMode ? 'bg-gray-100' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-200`}
              >
                {[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4].map(hours => (
                  <option key={hours} value={hours}>{hours}</option>
                ))}
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grade Levels *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {gradeLevels.map(grade => (
                  <label key={grade} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.gradeLevels.includes(grade)}
                      onChange={() => handleGradeLevelChange(grade)}
                      disabled={isViewMode}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm">Grade {grade}</span>
                  </label>
                ))}
              </div>
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
                {actionType === 'edit' ? 'Update Subject' : 'Create Subject'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SubjectModal;