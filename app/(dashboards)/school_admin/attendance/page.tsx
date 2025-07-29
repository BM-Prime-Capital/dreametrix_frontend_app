"use client";
import { useState } from 'react';
import { 
  FiCheck, FiX, FiCalendar, FiUser, FiClock, 
  FiEdit2, FiFilter, FiChevronDown, FiPlus, FiTrash2 
} from 'react-icons/fi';

interface Student {
  id: string;
  name: string;
  email: string;
  class: string;
}

interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  checkInTime?: string;
  notes?: string;
}

// Different avatar background colors
const avatarColors = [
  'bg-indigo-100 text-indigo-600',
  'bg-blue-100 text-blue-600',
  'bg-green-100 text-green-600',
  'bg-purple-100 text-purple-600',
  'bg-pink-100 text-pink-600',
  'bg-yellow-100 text-yellow-600'
];

const getAvatarColor = (id: string) => {
  // Simple hash function to get consistent color for each student
  const hash = id.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
  return avatarColors[hash % avatarColors.length];
};

const AttendanceTable = () => {
  // Sample data
  const sampleStudents: Student[] = [
    { id: 's1', name: 'John Smith', email: 'john.smith@example.com', class: 'Grade 10A' },
    { id: 's2', name: 'Emily Johnson', email: 'emily.johnson@example.com', class: 'Grade 10A' },
    { id: 's3', name: 'Michael Brown', email: 'michael.brown@example.com', class: 'Grade 10B' },
    { id: 's4', name: 'Sarah Davis', email: 'sarah.davis@example.com', class: 'Grade 10B' },
  ];

  const sampleAttendance: AttendanceRecord[] = [
    { id: 'a1', studentId: 's1', date: '2023-05-01', status: 'present', checkInTime: '08:15', notes: 'On time' },
    { id: 'a2', studentId: 's2', date: '2023-05-01', status: 'late', checkInTime: '09:30', notes: 'Traffic delay' },
    { id: 'a3', studentId: 's3', date: '2023-05-01', status: 'absent', notes: 'Sick leave' },
    { id: 'a4', studentId: 's4', date: '2023-05-01', status: 'present', checkInTime: '08:05', notes: 'Early arrival' },
  ];

  // State
  const [students] = useState<Student[]>(sampleStudents);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(sampleAttendance);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [editRecord, setEditRecord] = useState<AttendanceRecord | null>(null);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [filterClass, setFilterClass] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [newNote, setNewNote] = useState<string>('');

  // Handle status change
  const handleStatusChange = (studentId: string, newStatus: AttendanceRecord['status']) => {
    const existingRecordIndex = attendance.findIndex(
      record => record.studentId === studentId && record.date === selectedDate
    );

    if (existingRecordIndex >= 0) {
      const updatedAttendance = [...attendance];
      updatedAttendance[existingRecordIndex] = {
        ...updatedAttendance[existingRecordIndex],
        status: newStatus,
        checkInTime: newStatus === 'present' || newStatus === 'late' 
          ? updatedAttendance[existingRecordIndex].checkInTime || '08:00' 
          : undefined
      };
      setAttendance(updatedAttendance);
    } else {
      const newRecord: AttendanceRecord = {
        id: `new-${Date.now()}`,
        studentId,
        date: selectedDate,
        status: newStatus,
        checkInTime: newStatus === 'present' || newStatus === 'late' ? '08:00' : undefined
      };
      setAttendance([...attendance, newRecord]);
    }
  };

  // Toggle row expansion
  const toggleRow = (studentId: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesClass = filterClass === 'all' || student.class === filterClass;
    if (filterStatus === 'all') return matchesClass;
    
    const record = attendance.find(
      r => r.studentId === student.id && r.date === selectedDate
    );
    return matchesClass && record?.status === filterStatus;
  });

  // Get unique classes for filter
  const uniqueClasses = [...new Set(students.map(student => student.class))];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FiCalendar className="text-indigo-600" />
          Attendance Management
        </h2>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <label className="sr-only">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="p-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2">
          <FiFilter className="text-gray-500" />
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="p-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All Classes</option>
            {uniqueClasses.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <FiFilter className="text-gray-500" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All Statuses</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="late">Late</option>
            <option value="excused">Excused</option>
          </select>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Class
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Check-in Time
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => {
                const record = attendance.find(
                  r => r.studentId === student.id && r.date === selectedDate
                );
                const status = record?.status || 'absent';
                const isExpanded = expandedRows[student.id];
                const avatarColor = getAvatarColor(student.id);

                return (
                  <>
                    <tr key={student.id} className="hover:bg-gray-50 bg-white">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${avatarColor}`}>
                            <FiUser className="text-lg" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                            <div className="text-sm text-gray-500">{student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.class}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={status}
                          onChange={(e) => handleStatusChange(
                            student.id, 
                            e.target.value as AttendanceRecord['status']
                          )}
                          className={`p-1 rounded border text-sm ${
                            status === 'present' ? 'bg-green-50 text-green-800 border-green-100' :
                            status === 'absent' ? 'bg-red-50 text-red-800 border-red-100' :
                            status === 'late' ? 'bg-yellow-50 text-yellow-800 border-yellow-100' :
                            'bg-blue-50 text-blue-800 border-blue-100'
                          }`}
                        >
                          <option value="present">Present</option>
                          <option value="absent">Absent</option>
                          <option value="late">Late</option>
                          <option value="excused">Excused</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(status === 'present' || status === 'late') && (
                          <div className="flex items-center gap-2">
                            <span>{record?.checkInTime}</span>
                            <button 
                              onClick={() => record && setEditRecord(record)}
                              className="text-gray-400 hover:text-indigo-600"
                            >
                              <FiEdit2 size={14} />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleStatusChange(student.id, 'present')}
                            className={`p-1 rounded ${status === 'present' ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}
                            title="Mark as present"
                          >
                            <FiCheck />
                          </button>
                          <button
                            onClick={() => handleStatusChange(student.id, 'absent')}
                            className={`p-1 rounded ${status === 'absent' ? 'bg-red-100 text-red-800' : 'bg-gray-100'}`}
                            title="Mark as absent"
                          >
                            <FiX />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => toggleRow(student.id)}
                          className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1"
                        >
                          {isExpanded ? 'Less' : 'More'}
                          <FiChevronDown className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr className="bg-white">
                        <td colSpan={6} className="px-6 py-4 border-t">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-medium mb-2 flex items-center gap-2">
                                <FiClock className="text-indigo-500" />
                                Attendance Details
                              </h4>
                              <div className="space-y-2">
                                <p>
                                  <span className="font-medium">Status:</span> {status}
                                </p>
                                {(status === 'present' || status === 'late') && (
                                  <p>
                                    <span className="font-medium">Check-in Time:</span> {record?.checkInTime}
                                  </p>
                                )}
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-2">Notes</h4>
                              {record?.notes ? (
                                <p className="text-sm text-gray-600">{record.notes}</p>
                              ) : (
                                <p className="text-sm text-gray-400">No notes added</p>
                              )}
                              <div className="mt-3 flex gap-2">
                                <input
                                  type="text"
                                  value={newNote}
                                  onChange={(e) => setNewNote(e.target.value)}
                                  placeholder="Add a note..."
                                  className="p-2 border border-gray-300 rounded-md text-sm flex-1"
                                />
                                <button
                                  onClick={() => {
                                    if (newNote.trim()) {
                                      const updatedAttendance = attendance.map(a => 
                                        a.id === record?.id 
                                          ? {...a, notes: newNote} 
                                          : a
                                      );
                                      setAttendance(updatedAttendance);
                                      setNewNote('');
                                    }
                                  }}
                                  className="px-3 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
                                >
                                  Add
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No students match the current filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Time Modal */}
      {isEditing && editRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <FiEdit2 className="text-indigo-600" />
              Edit Check-in Time
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Check-in Time
              </label>
              <input
                type="time"
                value={editRecord.checkInTime || '08:00'}
                onChange={(e) => setEditRecord({
                  ...editRecord,
                  checkInTime: e.target.value
                })}
                className="p-2 border border-gray-300 rounded-md w-full"
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const updatedAttendance = attendance.map(a => 
                    a.id === editRecord.id ? editRecord : a
                  );
                  setAttendance(updatedAttendance);
                  setIsEditing(false);
                }}
                className="px-4 py-2 bg-indigo-600 rounded-md text-white hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceTable;