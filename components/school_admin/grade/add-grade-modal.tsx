"use client";
import { useState } from 'react';
import { 
  FiX, FiAward, FiUser, 
  FiAlertTriangle, FiPlus, FiBook
} from 'react-icons/fi';


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

const AddGradeModal = ({ isOpen, onClose, onGradeAdded }: { 
  isOpen: boolean, 
  onClose: () => void, 
  onGradeAdded: (newGrade: Grade) => void;
}) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    level: 'Elementary',
    head_teacher_name: '',
    head_teacher_email: '',
    courses: ['']
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCourseChange = (index: number, value: string) => {
    const newCourses = [...formData.courses];
    newCourses[index] = value;
    setFormData(prev => ({
      ...prev,
      courses: newCourses
    }));
  };

  const addCourse = () => {
    setFormData(prev => ({
      ...prev,
      courses: [...prev.courses, '']
    }));
  };

  const removeCourse = (index: number) => {
    if (formData.courses.length > 1) {
      const newCourses = [...formData.courses];
      newCourses.splice(index, 1);
      setFormData(prev => ({
        ...prev,
        courses: newCourses
      }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name) newErrors.name = 'Grade name is required';
    if (!formData.code) newErrors.code = 'Grade code is required';
    if (!formData.head_teacher_name) newErrors.head_teacher_name = 'Head teacher name is required';
    if (!formData.head_teacher_email) newErrors.head_teacher_email = 'Head teacher email is required';
    
    formData.courses.forEach((course, index) => {
      if (!course) newErrors[`course_${index}`] = 'Course name is required';
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      //onGradeAdded();
      setFormData({
        name: '',
        code: '',
        level: 'Elementary',
        head_teacher_name: '',
        head_teacher_email: '',
        courses: ['']
      });
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Add New Grade</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <FiX className="text-xl" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Grade Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <FiAward className="text-indigo-500" />
                  Grade Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Grade Name*</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all ${
                        errors.name ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="Grade 10"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <FiAlertTriangle className="mr-1" /> {errors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Grade Code*</label>
                    <input
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleChange}
                      className={`block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all ${
                        errors.code ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="G10"
                    />
                    {errors.code && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <FiAlertTriangle className="mr-1" /> {errors.code}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">School Level*</label>
                    <select
                      name="level"
                      value={formData.level}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
                    >
                      <option value="Elementary">Elementary</option>
                      <option value="Middle">Middle</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Head Teacher */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <FiUser className="text-indigo-500" />
                  Head Teacher
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name*</label>
                    <input
                      type="text"
                      name="head_teacher_name"
                      value={formData.head_teacher_name}
                      onChange={handleChange}
                      className={`block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all ${
                        errors.head_teacher_name ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="John Doe"
                    />
                    {errors.head_teacher_name && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <FiAlertTriangle className="mr-1" /> {errors.head_teacher_name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                    <input
                      type="email"
                      name="head_teacher_email"
                      value={formData.head_teacher_email}
                      onChange={handleChange}
                      className={`block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all ${
                        errors.head_teacher_email ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="teacher@school.edu"
                    />
                    {errors.head_teacher_email && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <FiAlertTriangle className="mr-1" /> {errors.head_teacher_email}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Courses */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <FiBook className="text-indigo-500" />
                  Courses
                </h3>
                <div className="space-y-4">
                  {formData.courses.map((course, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Course {index + 1}*</label>
                        <input
                          type="text"
                          value={course}
                          onChange={(e) => handleCourseChange(index, e.target.value)}
                          className={`block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all ${
                            errors[`course_${index}`] ? 'border-red-300' : 'border-gray-200'
                          }`}
                          placeholder="Mathematics"
                        />
                        {errors[`course_${index}`] && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <FiAlertTriangle className="mr-1" /> {errors[`course_${index}`]}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeCourse(index)}
                        className="mt-6 px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addCourse}
                    className="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all flex items-center gap-2"
                  >
                    <FiPlus /> Add Another Course
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700 transition-all flex items-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  'Saving...'
                ) : (
                  <>
                    <FiPlus /> Add Grade
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddGradeModal;