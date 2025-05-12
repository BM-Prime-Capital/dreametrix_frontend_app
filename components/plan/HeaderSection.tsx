import React from 'react';
import { Button } from '../../ui/Button';
import { Edit } from 'lucide-react';

interface HeaderSectionProps {
  teacher: string;
  subject: string;
  grade: string;
  students: string;
  isEditing: boolean;
  onStartEditing: () => void;
  onInputChange: (field: string, value: string) => void;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({
  teacher,
  subject,
  grade,
  students,
  isEditing,
  onStartEditing,
  onInputChange
}) => {
  return (
    <div className="relative">
      {/* Row 1 - LESSON PLAN title */}
      <div className="flex border-b-2 border-white h-16 bg-black text-white">
        <div className="w-full p-2 flex items-center justify-center">
          <h1 className="text-2xl font-bold">LESSON PLAN</h1>
        </div>
      </div>

      {/* Row 2 - Header with 4 columns */}
      <div className="flex border-b-2 border-black h-16 bg-black text-white">
        <div className="w-1/4 p-2 border-r-2 border-white flex items-center gap-2">
          <span><strong>Teacher:</strong></span>
          {isEditing ? (
            <input 
              type="text" 
              value={teacher}
              onChange={(e) => onInputChange('teacher', e.target.value)}
              className="border-none bg-white w-full text-black px-2 rounded-none"
            />
          ) : (
            <div className="bg-gray-100 w-full text-black px-2 py-1">{teacher}</div>
          )}
        </div>
        <div className="w-1/4 p-2 border-r-2 border-white flex items-center gap-2">
          <span><strong>SUBJECT:</strong></span>
          {isEditing ? (
            <input 
              type="text" 
              value={subject}
              onChange={(e) => onInputChange('subject', e.target.value)}
              className="border-none bg-white w-full font-bold text-black px-2 rounded-none"
            />
          ) : (
            <div className="bg-gray-100 w-full font-bold text-black px-2 py-1">{subject}</div>
          )}
        </div>
        <div className="w-1/4 p-2 border-r-2 border-white flex items-center gap-2">
          <span><strong>Grade:</strong></span>
          {isEditing ? (
            <input 
              type="text" 
              value={grade}
              onChange={(e) => onInputChange('grade', e.target.value)}
              className="border-none bg-white w-full text-black px-2 rounded-none"
            />
          ) : (
            <div className="bg-gray-100 w-full text-black px-2 py-1">{grade}</div>
          )}
        </div>
        <div className="w-1/4 p-2 flex items-center gap-2">
          <span><strong># Students:</strong></span>
          {isEditing ? (
            <input 
              type="text" 
              value={students}
              onChange={(e) => onInputChange('students', e.target.value)}
              className="border-none bg-white w-full text-black px-2 rounded-none"
            />
          ) : (
            <div className="bg-gray-100 w-full text-black px-2 py-1">{students}</div>
          )}
        </div>
        
        {!isEditing && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute right-2 top-20 text-white hover:text-white"
            onClick={onStartEditing}
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default HeaderSection;