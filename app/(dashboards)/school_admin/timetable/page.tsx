// app/school-admin/timetables/page.tsx
"use client";
import { useState } from 'react';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiEye, FiClock, FiCalendar } from 'react-icons/fi';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal';
import TimetableModal from '@/components/school_admin/timetables/TimetableModal';

interface Timetable {
  id: string;
  name: string;
  academicYear: string;
  gradeLevel: string;
  effectiveDate: string;
  endDate: string;
  status: 'Draft' | 'Active' | 'Archived';
  periods: {
    startTime: string;
    endTime: string;
    name: string;
  }[];
  schedule: {
    day: string;
    periods: {
      periodId: string;
      subject: string;
      teacher: string;
      room: string;
    }[];
  }[];
}

const TimetablesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentTimetable, setCurrentTimetable] = useState<Timetable | null>(null);
  const [actionType, setActionType] = useState<'view' | 'edit' | 'create'>('create');

  // Données de démonstration
  const timetables: Timetable[] = [
    {
      id: '1',
      name: 'Fall 2023 - Grade 10',
      academicYear: '2023-2024',
      gradeLevel: '10',
      effectiveDate: '2023-09-05',
      endDate: '2023-12-15',
      status: 'Active',
      periods: [
        { startTime: '08:00', endTime: '08:45', name: 'Period 1' },
        { startTime: '08:50', endTime: '09:35', name: 'Period 2' },
        { startTime: '09:40', endTime: '10:25', name: 'Period 3' },
        { startTime: '10:30', endTime: '11:15', name: 'Period 4' },
        { startTime: '11:20', endTime: '12:05', name: 'Period 5' },
        { startTime: '12:05', endTime: '12:50', name: 'Lunch' },
        { startTime: '12:55', endTime: '13:40', name: 'Period 6' },
        { startTime: '13:45', endTime: '14:30', name: 'Period 7' },
      ],
      schedule: [
        {
          day: 'Monday',
          periods: [
            { periodId: '1', subject: 'Mathematics', teacher: 'Mr. Smith', room: 'A101' },
            { periodId: '2', subject: 'English', teacher: 'Ms. Johnson', room: 'B205' },
            { periodId: '3', subject: 'Physics', teacher: 'Dr. Brown', room: 'Science Lab' },
            { periodId: '4', subject: 'History', teacher: 'Mr. Davis', room: 'A102' },
            { periodId: '5', subject: 'Physical Education', teacher: 'Coach Wilson', room: 'Gym' },
            { periodId: '6', subject: 'Lunch', teacher: '', room: 'Cafeteria' },
            { periodId: '7', subject: 'Spanish', teacher: 'Ms. Garcia', room: 'B207' },
            { periodId: '8', subject: 'Study Hall', teacher: 'Mr. Thompson', room: 'Library' },
          ]
        },
        // Autres jours de la semaine...
      ]
    },
    {
      id: '2',
      name: 'Fall 2023 - Grade 11',
      academicYear: '2023-2024',
      gradeLevel: '11',
      effectiveDate: '2023-09-05',
      endDate: '2023-12-15',
      status: 'Active',
      periods: [
        { startTime: '08:00', endTime: '08:50', name: 'Period 1' },
        { startTime: '08:55', endTime: '09:45', name: 'Period 2' },
        { startTime: '09:50', endTime: '10:40', name: 'Period 3' },
        { startTime: '10:45', endTime: '11:35', name: 'Period 4' },
        { startTime: '11:40', endTime: '12:30', name: 'Period 5' },
        { startTime: '12:30', endTime: '13:15', name: 'Lunch' },
        { startTime: '13:20', endTime: '14:10', name: 'Period 6' },
        { startTime: '14:15', endTime: '15:05', name: 'Period 7' },
      ],
      schedule: [
        // Schedule pour le grade 11...
      ]
    },
    {
      id: '3',
      name: 'Winter 2024 - Grade 10',
      academicYear: '2023-2024',
      gradeLevel: '10',
      effectiveDate: '2024-01-08',
      endDate: '2024-03-22',
      status: 'Draft',
      periods: [
        // Périodes pour l'hiver...
      ],
      schedule: [
        // Schedule pour l'hiver...
      ]
    }
  ];

  const filteredTimetables = timetables.filter(timetable =>
    timetable.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    timetable.gradeLevel.toLowerCase().includes(searchTerm.toLowerCase()) ||
    timetable.academicYear.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTimetable = () => {
    setCurrentTimetable(null);
    setActionType('create');
    setIsModalOpen(true);
  };

  const handleEditTimetable = (timetable: Timetable) => {
    setCurrentTimetable(timetable);
    setActionType('edit');
    setIsModalOpen(true);
  };

  const handleViewTimetable = (timetable: Timetable) => {
    setCurrentTimetable(timetable);
    setActionType('view');
    setIsModalOpen(true);
  };

  const handleDeleteTimetable = (timetable: Timetable) => {
    setCurrentTimetable(timetable);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    // Logique de suppression ici
    console.log('Deleting timetable:', currentTimetable);
    setIsDeleteModalOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Draft': return 'bg-yellow-100 text-yellow-800';
      case 'Archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Timetable Management</h1>
          <p className="text-gray-600 mt-1">
            {filteredTimetables.length} {filteredTimetables.length === 1 ? 'timetable' : 'timetables'} found
          </p>
        </div>
        
        <button 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
          onClick={handleAddTimetable}
        >
          <FiPlus className="text-lg" />
          <span>Create Timetable</span>
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
            placeholder="Search by timetable name, grade level or academic year..."
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Timetables grid */}
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTimetables.map(timetable => (
            <div key={timetable.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
              {/* Eye icon in top right corner */}
              <button 
                onClick={() => handleViewTimetable(timetable)}
                className="absolute top-4 right-4 text-gray-400 hover:text-indigo-600 transition-colors"
              >
                <FiEye className="h-5 w-5" />
              </button>
              
              <div className="p-5">
                <div className="flex items-start gap-3 mb-2">
                  <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                    <FiClock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{timetable.name}</h3>
                    <p className="text-sm text-gray-500">Grade {timetable.gradeLevel}</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium">Academic Year:</span> {timetable.academicYear}</p>
                  <p><span className="font-medium">Effective Date:</span> {new Date(timetable.effectiveDate).toLocaleDateString()}</p>
                  <p><span className="font-medium">End Date:</span> {new Date(timetable.endDate).toLocaleDateString()}</p>
                  <p>
                    <span className="font-medium">Status:</span> 
                    <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(timetable.status)}`}>
                      {timetable.status}
                    </span>
                  </p>
                  <p><span className="font-medium">Periods per day:</span> {timetable.periods.length}</p>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end gap-2">
                  <button
                    onClick={() => handleEditTimetable(timetable)}
                    className="p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-full transition-colors"
                    title="Edit"
                  >
                    <FiEdit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteTimetable(timetable)}
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
      {filteredTimetables.length === 0 && (
        <div className="w-full bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FiCalendar className="text-gray-400 text-3xl" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No timetables found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'No matches for your search criteria' : 'Currently no timetables available'}
          </p>
          <button 
            onClick={() => setSearchTerm('')}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            {searchTerm ? 'Clear search' : 'Create a new timetable'}
          </button>
        </div>
      )}

      {/* Timetable Modal */}
      <TimetableModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        timetableData={currentTimetable}
        actionType={actionType}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Timetable"
        message={`Are you sure you want to delete ${currentTimetable?.name}? This action cannot be undone.`}
      />
    </div>
  );
};

export default TimetablesPage;