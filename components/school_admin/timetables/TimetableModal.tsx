// components/school_admin/timetables/TimetableModal.tsx
"use client";
import { useState, useEffect } from 'react';
import { FiX, FiSave, FiClock } from 'react-icons/fi';

interface TimetableModalProps {
  isOpen: boolean;
  onClose: () => void;
  timetableData: any;
  actionType: 'view' | 'edit' | 'create';
}

const TimetableModal = ({ isOpen, onClose, timetableData, actionType }: TimetableModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    academicYear: '',
    gradeLevel: '',
    effectiveDate: '',
    endDate: '',
    status: 'Draft',
    periods: [{ startTime: '08:00', endTime: '08:45', name: 'Period 1' }]
  });

  useEffect(() => {
    if (timetableData) {
      setFormData({
        name: timetableData.name,
        academicYear: timetableData.academicYear,
        gradeLevel: timetableData.gradeLevel,
        effectiveDate: timetableData.effectiveDate,
        endDate: timetableData.endDate,
        status: timetableData.status,
        periods: timetableData.periods
      });
    } else {
      setFormData({
        name: '',
        academicYear: '',
        gradeLevel: '',
        effectiveDate: '',
        endDate: '',
        status: 'Draft',
        periods: [{ startTime: '08:00', endTime: '08:45', name: 'Period 1' }]
      });
    }
  }, [timetableData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePeriodChange = (index: number, field: string, value: string) => {
    const updatedPeriods = [...formData.periods];
    updatedPeriods[index] = { ...updatedPeriods[index], [field]: value };
    setFormData(prev => ({ ...prev, periods: updatedPeriods }));
  };

  const addPeriod = () => {
    const newPeriodNumber = formData.periods.length + 1;
    setFormData(prev => ({
      ...prev,
      periods: [...prev.periods, { 
        startTime: '00:00', 
        endTime: '00:00', 
        name: `Period ${newPeriodNumber}` 
      }]
    }));
  };

  const removePeriod = (index: number) => {
    if (formData.periods.length > 1) {
      const updatedPeriods = formData.periods.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, periods: updatedPeriods }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique de sauvegarde ici
    console.log('Form submitted:', formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-900">
            {actionType === 'create' ? 'Create New Timetable' : 
             actionType === 'edit' ? 'Edit Timetable' : 'Timetable Details'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <FiX className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Timetable Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={actionType === 'view'}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="academicYear" className="block text-sm font-medium text-gray-700 mb-1">
                Academic Year
              </label>
              <input
                type="text"
                id="academicYear"
                name="academicYear"
                value={formData.academicYear}
                onChange={handleChange}
                disabled={actionType === 'view'}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g. 2023-2024"
                required
              />
            </div>
            
            <div>
              <label htmlFor="gradeLevel" className="block text-sm font-medium text-gray-700 mb-1">
                Grade Level
              </label>
              <select
                id="gradeLevel"
                name="gradeLevel"
                value={formData.gradeLevel}
                onChange={handleChange}
                disabled={actionType === 'view'}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Select Grade</option>
                <option value="9">Grade 9</option>
                <option value="10">Grade 10</option>
                <option value="11">Grade 11</option>
                <option value="12">Grade 12</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={actionType === 'view'}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="Draft">Draft</option>
                <option value="Active">Active</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="effectiveDate" className="block text-sm font-medium text-gray-700 mb-1">
                Effective Date
              </label>
              <input
                type="date"
                id="effectiveDate"
                name="effectiveDate"
                value={formData.effectiveDate}
                onChange={handleChange}
                disabled={actionType === 'view'}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                disabled={actionType === 'view'}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <FiClock className="text-indigo-600" />
                <span>Periods Configuration</span>
              </h3>
              {actionType !== 'view' && (
                <button
                  type="button"
                  onClick={addPeriod}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  + Add Period
                </button>
              )}
            </div>
            
            <div className="space-y-4">
              {formData.periods.map((period, index) => (
                <div key={index} className="grid grid-cols-12 gap-3 items-center">
                  <div className="col-span-3">
                    <input
                      type="text"
                      value={period.name}
                      onChange={(e) => handlePeriodChange(index, 'name', e.target.value)}
                      disabled={actionType === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="time"
                      value={period.startTime}
                      onChange={(e) => handlePeriodChange(index, 'startTime', e.target.value)}
                      disabled={actionType === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="time"
                      value={period.endTime}
                      onChange={(e) => handlePeriodChange(index, 'endTime', e.target.value)}
                      disabled={actionType === 'view'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  {actionType !== 'view' && formData.periods.length > 1 && (
                    <div className="col-span-3">
                      <button
                        type="button"
                        onClick={() => removePeriod(index)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {actionType !== 'view' && (
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center gap-2"
              >
                <FiSave className="h-4 w-4" />
                {actionType === 'create' ? 'Create Timetable' : 'Save Changes'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default TimetableModal;