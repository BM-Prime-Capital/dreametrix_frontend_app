"use client";
import { FiX } from 'react-icons/fi';


export interface Grade {
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
  
interface EditGradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  grade: Grade | null;
  onSave: (updatedGrade: Grade) => void;
}

const EditGradeModal = ({ isOpen, onClose, grade, onSave }: EditGradeModalProps) => {
  if (!isOpen || !grade) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(grade);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Edit Grade</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX className="text-xl" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grade Name
                </label>
                <input
                  type="text"
                  defaultValue={grade.name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grade Code
                </label>
                <input
                  type="text"
                  defaultValue={grade.code}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* Ajoutez ici les autres champs à éditer */}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700 transition-all"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditGradeModal;