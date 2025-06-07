/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
 // DialogTrigger,
} from "@/components/ui/dialog";



//import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
//import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { teacherImages } from "@/constants/images";
import Image from "next/image";
import { SeatingCondition } from "@/types";

interface StudentSeatingConditionsDialogProps {
  studentClassName?: string;
  conditions: SeatingCondition[];
  setConditions: (conditions: SeatingCondition[]) => void;
  students: Array<{ studentId: string; studentName: string }>;
}

export const StudentSeatingConditionsDialog: React.FC<StudentSeatingConditionsDialogProps> = ({
  studentClassName,
  conditions,
  setConditions,
  students,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newCondition, setNewCondition] = useState<Partial<SeatingCondition>>({
    type: 'separate',
    studentIds: [],
  });

  const handleAddCondition = () => {
    if (!newCondition.type || newCondition.studentIds?.length === 0) return;
    
    setConditions([
      ...conditions,
      {
        id: `cond-${Date.now()}`,
        type: newCondition.type,
        studentIds: newCondition.studentIds || [],
        priority: newCondition.priority,
        studentId: newCondition.studentIds?.[0] || '', // Assuming the first student ID is used
        condition: newCondition.type, // Assuming the condition matches the type
      }
    ]);
    
    setNewCondition({
      type: 'separate',
      studentIds: [],
    });
  };

  const handleRemoveCondition = (id: string) => {
    setConditions(conditions.filter(cond => cond.id !== id));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button
        onClick={() => setIsOpen(true)}
        className={studentClassName}
      >
        <Image
          src={teacherImages.conditions}
          alt="conditions"
          width={24}
          height={24}
          className="w-5 h-5"
        />
        <span>Seating Conditions</span>
      </Button>
      
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Seating Conditions</DialogTitle>
          <DialogDescription>
            Define rules for automatically placing students
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Condition Type</label>
              <select
                value={newCondition.type}
                onChange={(e) => setNewCondition({
                  ...newCondition,
                  type: e.target.value as any,
                })}
                className="w-full p-2 border rounded"
              >
                <option value="separate">Separate students</option>
                <option value="group">Group students</option>
                <option value="front">Place at front</option>
                <option value="back">Place at back</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Priority (1-10)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={newCondition.priority || ''}
                onChange={(e) => setNewCondition({
                  ...newCondition,
                  priority: parseInt(e.target.value) || undefined,
                })}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Select Students</label>
            <select
              multiple
              value={newCondition.studentIds || []}
              onChange={(e) => {
                const options = Array.from(e.target.selectedOptions, option => option.value);
                setNewCondition({
                  ...newCondition,
                  studentIds: options,
                });
              }}
              className="w-full h-32 p-2 border rounded"
            >
              {students.map(student => (
                <option key={student.studentId} value={student.studentId}>
                  {student.studentName}
                </option>
              ))}
            </select>
          </div>
          
          <Button
            onClick={handleAddCondition}
            className="mt-2"
            variant='primary'
          >
            Add Condition
          </Button>
        </div>
        
        <div className="mt-6">
          <h3 className="font-medium mb-2">Active Conditions</h3>
          {conditions.length === 0 ? (
            <p className="text-sm text-gray-500">No conditions defined</p>
          ) : (
            <ul className="space-y-2">
              {conditions.map(condition => (
                <li key={condition.id} className="flex justify-between items-center p-2 border rounded">
                  <div>
                    <span className="font-medium capitalize">{condition.type}</span>: 
                    {condition.studentIds.map(id => {
                      const student = students.find(s => s.studentId === id);
                      return student ? ` ${student.studentName},` : '';
                    })}
                    {condition.priority && ` (Priority: ${condition.priority})`}
                  </div>
                  <Button
                    variant="destructive"
                    className="h-6"
                    size="sm"
                    onClick={() => handleRemoveCondition(condition.id)}
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <DialogFooter>
          <Button variant='primary' className="" onClick={() => setIsOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
