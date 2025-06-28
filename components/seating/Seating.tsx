/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card } from "@/components/ui/card";
import PageTitleH1 from "@/components/ui/page-title-h1";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { generalImages, teacherImages } from "@/constants/images";
import PageTitleH2 from "../ui/page-title-h2";
import StudentArrangementItem from "./student-arrangement-item";
import { useEffect, useState } from "react";
import { StudentSeatingConditionsDialog } from "./StudentSeatingConditionsDialog";
import { CreateArrangementDialog } from "./CreateArrangementDialog";
import { SeatingHistory } from "./SeatingHistory";
import { useCallback, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getSeatingArrangements, updateSeatingArrangement, deactivateArrangementEvent } from "@/services/SeatingService";
import { ClassSelector } from "../ui/class-selector";
import { SeatingCondition } from "@/types";

const DEFAULT_SEAT_COUNT = 64;

export default function Seating({
  tenantPrimaryDomain,
  accessToken,
  refreshToken,
  courses,
}: {
  tenantPrimaryDomain: string;
  accessToken: string;
  refreshToken: string;
  courses: any[];
}) {
  const [arrangements, setArrangements] = useState<any[]>([]);
  const [currentArrangement, setCurrentArrangement] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCourse] = useState<number | null>(null);
  const [firstSelectedSeatNumber, setFirstSelectedSeatNumber] = useState(-1);
  const [isSeatingArrangementAuto, setIsSeatingArrangementAuto] = useState(true);
  const [displayStudentsList, setDisplayStudentsList] = useState(true);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [isModified, setIsModified] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [eventToDeactivate, setEventToDeactivate] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentClassId] = useState<string | null>(null);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [seatingConditions, setSeatingConditions] = useState<SeatingCondition[]>([]);
  const [draggedStudent, setDraggedStudent] = useState<any>(null);

  console.log("tenantPrimaryDomain",tenantPrimaryDomain)
  console.log("accessToken",accessToken)

  const loadArrangements = useCallback(async (courseId?: number) => {
    try {
      setLoading(true);
      const data = await getSeatingArrangements(tenantPrimaryDomain, accessToken, courseId);
      const formattedArrangements = formatArrangements(data);
      setArrangements(formattedArrangements);

      if (formattedArrangements.length > 0) {
        setCurrentArrangement(formattedArrangements[0]);
      }
    } catch (error) {
      console.error("Error loading arrangements:", error);
    } finally {
      setLoading(false);
    }
  }, [tenantPrimaryDomain, accessToken]);

  const formatArrangements = useCallback((apiData: any) => {
    const result: any[] = [];
    
    for (const courseName in apiData) {
      const courseData = apiData[courseName];
      
      for (const eventName in courseData) {
        const eventData = courseData[eventName];
        const students: {
          seatNumber: number | null;
          studentImageUrl: string;
          studentName: string;
          studentId: number;
          seatingId: number;
          isSeated: boolean;
        }[] = [];
        
        if (eventData.seating_data && eventData.seating_data.length > 0) {
          eventData.seating_data.forEach((studentData: any) => {
            students.push({
              seatNumber: studentData.site_number,
              studentImageUrl: studentData.student_profile_picture || generalImages.student,
              studentName: studentData.full_name,
              studentId: studentData.student_id,
              seatingId: studentData.seating_arrangement_id,
              isSeated: studentData.site_number !== null
            });
          });
        }
  
        result.push({
          id: eventData.arrangement_event_id.toString(),
          title: eventData.name,
          courseName,
          arrangements: students,
          is_active: eventData.is_active,
          course_id: eventData.course_id,
          isNew: !eventData.seating_data,
          available_place_number: eventData.available_place_number || DEFAULT_SEAT_COUNT
        });
      }
    }
  
    return result;
  }, []);

  const filteredStudents = useMemo(() => {
    if (!currentArrangement) return [];
    if (!searchTerm) return currentArrangement.arrangements;
  
    return currentArrangement.arrangements.filter((student: any) =>
      student.studentName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [currentArrangement, searchTerm]);

  const handleDragStart = useCallback((student: any) => {
    setDraggedStudent(student);
  }, []);

  const handleDrop = useCallback((targetSeatNumber: number) => {
    if (!draggedStudent || !currentArrangement) return;

    const selectedStudent = draggedStudent;
    
    const seatOccupiedBy = currentArrangement.arrangements.find(
      (s: any) => s.seatNumber === targetSeatNumber && s.studentId !== selectedStudent.studentId
    );
    
    let newArrangements;
    
    if (seatOccupiedBy) {
      newArrangements = currentArrangement.arrangements.map((student: any) => {
        if (student.studentId === selectedStudent.studentId) {
          return { ...student, seatNumber: targetSeatNumber };
        }
        if (student.studentId === seatOccupiedBy.studentId) {
          return { ...student, seatNumber: selectedStudent.seatNumber };
        }
        return student;
      });
    } else {
      newArrangements = currentArrangement.arrangements.map((student: any) => {
        if (student.studentId === selectedStudent.studentId) {
          return { ...student, seatNumber: targetSeatNumber };
        }
        return student;
      });
    }
    
    const newCurrentArrangement = {
      ...currentArrangement,
      arrangements: newArrangements,
    };
    
    setCurrentArrangement(newCurrentArrangement);
    setArrangements(
      arrangements.map((arr) =>
        arr.id === currentArrangement.id ? newCurrentArrangement : arr
      )
    );
    setIsModified(true);
    setDraggedStudent(null);
  }, [draggedStudent, currentArrangement, arrangements]);

  const handleSeatClick = useCallback((targetSeatNumber: number) => {
    if (!currentArrangement) return;
  
    if (selectedStudentId !== null) {
      const selectedStudent = currentArrangement.arrangements.find(
        (s: any) => s.studentId === selectedStudentId
      );
      
      if (selectedStudent) {
        const seatOccupiedBy = currentArrangement.arrangements.find(
          (s: any) => s.seatNumber === targetSeatNumber && s.studentId !== selectedStudentId
        );
        
        if (seatOccupiedBy) {
          const newArrangements = currentArrangement.arrangements.map(
            (student: any) => {
              if (student.studentId === selectedStudentId) {
                return { ...student, seatNumber: targetSeatNumber };
              }
              if (student.studentId === seatOccupiedBy.studentId) {
                return { ...student, seatNumber: selectedStudent.seatNumber };
              }
              return student;
            }
          );
          
          const newCurrentArrangement = {
            ...currentArrangement,
            arrangements: newArrangements,
          };
          
          setCurrentArrangement(newCurrentArrangement);
          setArrangements(
            arrangements.map((arr) =>
              arr.id === currentArrangement.id ? newCurrentArrangement : arr
            )
          );
        } else {
          const newArrangements = currentArrangement.arrangements.map(
            (student: any) => {
              if (student.studentId === selectedStudentId) {
                return { ...student, seatNumber: targetSeatNumber };
              }
              return student;
            }
          );
          
          const newCurrentArrangement = {
            ...currentArrangement,
            arrangements: newArrangements,
          };
          
          setCurrentArrangement(newCurrentArrangement);
          setArrangements(
            arrangements.map((arr) =>
              arr.id === currentArrangement.id ? newCurrentArrangement : arr
            )
          );
        }
        
        setIsModified(true);
      }
      setSelectedStudentId(null);
      setFirstSelectedSeatNumber(-1);
      return;
    }
  
    if (firstSelectedSeatNumber === -1) {
      const targetStudent = currentArrangement.arrangements.find(
        (s: any) => s.seatNumber === targetSeatNumber
      );
      
      if (targetStudent) {
        setFirstSelectedSeatNumber(targetSeatNumber);
      }
      return;
    }
    
    if (firstSelectedSeatNumber === targetSeatNumber) {
      setFirstSelectedSeatNumber(-1);
      return;
    }
  
    const firstStudent = currentArrangement.arrangements.find(
      (s: any) => s.seatNumber === firstSelectedSeatNumber
    );
    const secondStudent = currentArrangement.arrangements.find(
      (s: any) => s.seatNumber === targetSeatNumber
    );
  
    const newArrangements = currentArrangement.arrangements.map(
      (student: any) => {
        if (firstStudent && student.studentId === firstStudent.studentId) {
          return { ...student, seatNumber: targetSeatNumber };
        }
        if (secondStudent && student.studentId === secondStudent.studentId) {
          return { ...student, seatNumber: firstSelectedSeatNumber };
        }
        return student;
      }
    );
    
    const newCurrentArrangement = {
      ...currentArrangement,
      arrangements: newArrangements,
    };
    
    setCurrentArrangement(newCurrentArrangement);
    setArrangements(
      arrangements.map((arr) =>
        arr.id === currentArrangement.id ? newCurrentArrangement : arr
      )
    );
    setIsModified(true);
    setFirstSelectedSeatNumber(-1);
  }, [currentArrangement, firstSelectedSeatNumber, arrangements, selectedStudentId]);

  const handleSave = useCallback(async () => {
    if (!currentArrangement || !isModified) return;
  
    try {
      setIsSaving(true);
      const updates = currentArrangement.arrangements.map((student: any) => ({
        seating_id: student.seatingId,
        site_number: student.seatNumber
      }));
      
      await updateSeatingArrangement(
        tenantPrimaryDomain,
        accessToken,
        updates
      );
      
      setIsModified(false);
    } catch (error) {
      console.error("Error saving arrangement:", error);
    } finally {
      setIsSaving(false);
    }
  }, [currentArrangement, isModified, tenantPrimaryDomain, accessToken]);
  
  const confirmDeactivation = useCallback(async () => {
    if (!eventToDeactivate) return;
  
    try {
      setIsDeactivating(true);
      await deactivateArrangementEvent(tenantPrimaryDomain, accessToken, eventToDeactivate);
      await loadArrangements(selectedCourse || undefined);
    } catch (error) {
      console.error("Error deactivating event:", error);
    } finally {
      setIsDeactivating(false);
      setIsConfirmDialogOpen(false);
      setEventToDeactivate(null);
    }
  }, [eventToDeactivate, tenantPrimaryDomain, accessToken, selectedCourse, loadArrangements]);

  const GridComponent = useMemo(() => {
    if (!currentArrangement) return null;
    
    const seats = currentArrangement.available_place_number || DEFAULT_SEAT_COUNT;
    
    return (
      <div className="grid grid-cols-8 gap-2 p-2 border-2 border-gray-200">
        {Array.from({ length: seats }).map((_, index) => {
          const seatNumber = index + 1;
          const student = currentArrangement.arrangements.find(
            (s: any) => s.seatNumber === seatNumber
          );

          return (
            <div
              key={`seat-${seatNumber}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(seatNumber)}
              onClick={() => handleSeatClick(seatNumber)}
              className={`w-full h-[50px] relative ${
                firstSelectedSeatNumber === seatNumber 
                  ? 'bg-blue-50'
                  : 'border-[1px] border-[#eee]'
              } ${student ? 'bg-white' : 'bg-gray-200 hover:border-bgPink'}`}
            >
              {student ? (
                <StudentArrangementItem
                  id={seatNumber}
                  studentImageUrl={student.studentImageUrl}
                  studentName={student.studentName}
                  className="w-full h-full"
                  handleSeatClick={() => handleSeatClick(seatNumber)}
                  maxSeatNumber={seats}
                  isSeatingArrangementAuto={isSeatingArrangementAuto}
                  isSelected={firstSelectedSeatNumber === seatNumber}
                />
              ) : (
                <label className="seat-number font-bold text-xs text-bgPurple absolute top-1 left-1">
                  {seatNumber}
                </label>
              )}
            </div>
          );
        })}
      </div>
    );
  }, [currentArrangement, firstSelectedSeatNumber, handleSeatClick, handleDrop]);

  const handleSeatingArrangementAuto = useCallback(() => {
    if (!currentArrangement) return;
  
    let studentsToPlace = [...currentArrangement.arrangements];
    const placedStudents: any[] = [];
    const availableSeats = Array.from(
      { length: currentArrangement.available_place_number || DEFAULT_SEAT_COUNT }, 
      (_, i) => i + 1
    ); 
  
    const sortedConditions = [...seatingConditions].sort((a, b) => 
      (b.priority || 0) - (a.priority || 0)
    );
  
    for (const condition of sortedConditions) {
      switch (condition.type) {
        case 'separate':
          const studentsToSeparate = studentsToPlace.filter(s => 
            condition.studentIds.includes(s.studentId)
          );
          
          if (studentsToSeparate.length > 0) {
            for (const student of studentsToSeparate) {
              if (availableSeats.length === 0) break;
              
              const randomIndex = Math.floor(Math.random() * availableSeats.length);
              const seatNumber = availableSeats[randomIndex];
              
              placedStudents.push({
                ...student,
                seatNumber
              });
              
              availableSeats.splice(randomIndex, 1);
              const adjacentIndex = availableSeats.indexOf(seatNumber + 1);
              if (adjacentIndex !== -1) availableSeats.splice(adjacentIndex, 1);
              const prevAdjacentIndex = availableSeats.indexOf(seatNumber - 1);
              if (prevAdjacentIndex !== -1) availableSeats.splice(prevAdjacentIndex, 1);
            }
            
            studentsToPlace = studentsToPlace.filter(s => 
              !condition.studentIds.includes(s.studentId)
            );
          }
          break;
  
        case 'group':
          const studentsToGroup = studentsToPlace.filter(s => 
            condition.studentIds.includes(s.studentId)
          );
          
          if (studentsToGroup.length > 0) {
            const groupSize = studentsToGroup.length;
            let foundBlock = false;
            
            for (let i = 0; i <= availableSeats.length - groupSize; i++) {
              const block = availableSeats.slice(i, i + groupSize);
              if (block.every((seat, idx) => 
                idx === 0 || seat === block[idx - 1] + 1
              )) {
                foundBlock = true;
                studentsToGroup.forEach((student, idx) => {
                  placedStudents.push({
                    ...student,
                    seatNumber: block[idx]
                  });
                });
                
                availableSeats.splice(i, groupSize);
                break;
              }
            }
            
            if (!foundBlock) {
              studentsToGroup.forEach(student => {
                if (availableSeats.length === 0) return;
                
                const randomIndex = Math.floor(Math.random() * availableSeats.length);
                const seatNumber = availableSeats[randomIndex];
                
                placedStudents.push({
                  ...student,
                  seatNumber
                });
                
                availableSeats.splice(randomIndex, 1);
              });
            }
            
            studentsToPlace = studentsToPlace.filter(s => 
              !condition.studentIds.includes(s.studentId)
            );
          }
          break;
  
        case 'front':
          const studentsForFront = studentsToPlace.filter(s => 
            condition.studentIds.includes(s.studentId)
          );
          
          const frontSeats = availableSeats.filter(seat => seat <= 8);
          
          studentsForFront.forEach(student => {
            if (frontSeats.length === 0) return;
            
            const randomIndex = Math.floor(Math.random() * frontSeats.length);
            const seatNumber = frontSeats[randomIndex];
            
            placedStudents.push({
              ...student,
              seatNumber
            });
            
            availableSeats.splice(availableSeats.indexOf(seatNumber), 1);
            frontSeats.splice(randomIndex, 1);
          });
          
          studentsToPlace = studentsToPlace.filter(s => 
            !condition.studentIds.includes(s.studentId)
          );
          break;
  
        case 'back':
          const studentsForBack = studentsToPlace.filter(s => 
            condition.studentIds.includes(s.studentId)
          );
          
          const backSeats = availableSeats.filter(seat => 
            seat >= (currentArrangement.available_place_number || DEFAULT_SEAT_COUNT) - 8
          );
          
          studentsForBack.forEach(student => {
            if (backSeats.length === 0) return;
            
            const randomIndex = Math.floor(Math.random() * backSeats.length);
            const seatNumber = backSeats[randomIndex];
            
            placedStudents.push({
              ...student,
              seatNumber
            });
            
            availableSeats.splice(availableSeats.indexOf(seatNumber), 1);
            backSeats.splice(randomIndex, 1);
          });
          
          studentsToPlace = studentsToPlace.filter(s => 
            !condition.studentIds.includes(s.studentId)
          );
          break;
      }
    }
  
    studentsToPlace.forEach(student => {
      if (availableSeats.length === 0) return;
      
      const randomIndex = Math.floor(Math.random() * availableSeats.length);
      const seatNumber = availableSeats[randomIndex];
      
      placedStudents.push({
        ...student,
        seatNumber
      });
      
      availableSeats.splice(randomIndex, 1);
    });
  
    const newCurrentArrangement = {
      ...currentArrangement,
      arrangements: placedStudents,
    };
    
    setCurrentArrangement(newCurrentArrangement);
    setArrangements(
      arrangements.map(arr =>
        arr.id === currentArrangement.id ? newCurrentArrangement : arr
      )
    );
    setIsSeatingArrangementAuto(true);
    setIsModified(true);
  }, [currentArrangement, arrangements, seatingConditions]);


  const handleDeactivateEvent = useCallback(async (eventId: number) => {
    setEventToDeactivate(eventId);
    setIsConfirmDialogOpen(true);
  }, []);
  


  const handleCleanAllSeats = useCallback(() => {
    if (!currentArrangement) return;
  
    const cleanedArrangements = currentArrangement.arrangements.map((student: any) => ({
      ...student,
      seatNumber: null
    }));
  
    const newCurrentArrangement = {
      ...currentArrangement,
      arrangements: cleanedArrangements,
    };
  
    setCurrentArrangement(newCurrentArrangement);
    setArrangements(
      arrangements.map(arr =>
        arr.id === currentArrangement.id ? newCurrentArrangement : arr
      )
    );
    setIsModified(true);
    setSelectedStudentId(null);
    setFirstSelectedSeatNumber(-1);
  }, [currentArrangement, arrangements]);

  const renderStudentList = useMemo(() => {
    return filteredStudents.map((student: any) => (
      <div
        key={student.studentId}
        draggable={student.seatNumber === null} 
        onDragStart={() => student.seatNumber === null && handleDragStart(student)}
        onClick={() => {
          if (student.seatNumber === null) {
            setSelectedStudentId(student.studentId);
            setFirstSelectedSeatNumber(-1);
          } else {
            setFirstSelectedSeatNumber(student.seatNumber);
            setSelectedStudentId(null);
          }
        }}
        className={`whitespace-nowrap text-[14px] ${
          student.seatNumber === null ? 'cursor-pointer' : 'cursor-default'
        } border-b-2 py-1 ${
          selectedStudentId === student.studentId 
            ? "border-blue-500 bg-blue-50" 
            : student.seatNumber !== null && firstSelectedSeatNumber === student.seatNumber
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200"
        } ${student.seatNumber !== null ? 'opacity-50' : ''}`}
      >
        <span className="text-muted-foreground">{student.studentName}</span>
        {student.seatNumber !== null && (
          <>(<span className="text-secondaryBtn">{student.seatNumber}</span>)</>
        )}
      </div>
    ));
  }, [filteredStudents, handleDragStart, firstSelectedSeatNumber, selectedStudentId]);

  useEffect(() => {
    loadArrangements();
  }, [loadArrangements]);



  return (
    <section className="flex flex-col h-full w-full bg-gradient-to-br from-indigo-50/30 to-cyan-50/20">
      {/* Enhanced Header */}
      <div className="flex justify-between items-center bg-[#79bef2] px-8 py-6 shadow-xl rounded-2xl mx-6 mt-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </div>
          <div>
            <PageTitleH1 title="Seating Arrangements" className="text-white font-bold text-2xl" />
            <p className="text-blue-100 text-sm mt-1">Organize classroom seating layouts</p>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2">
          <ClassSelector
            classes={Array.from(new Set(arrangements.map(arr => arr.courseName))).map(courseName => ({
              id: courseName,
              name: courseName
            }))}
            selectedClasses={selectedClasses}
            onSelect={(classIds) => {
              setSelectedClasses(classIds);
            }}
            placeholder="Select classes..."
            multiple={true}
            className="w-[250px]"
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 mx-6 pb-8 space-y-6">

        {/* Enhanced Action Bar */}
        <div className="flex flex-wrap gap-4 items-center bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg mt-2">
          <Button
            onClick={handleSeatingArrangementAuto}
            className={`flex gap-3 items-center text-lg rounded-xl px-6 py-3 shadow-lg transition-all duration-300 ${
              isSeatingArrangementAuto 
                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-blue-200"
                : "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 hover:from-blue-100 hover:to-blue-200 border border-blue-200"
            }`}
          >
            <Image
              src={teacherImages.autogenerate}
              alt="autogenerate"
              width={20}
              height={20}
              className="w-5 h-5"
            />
            <span className="font-medium">Auto Generate</span>
          </Button>

          <Button
            onClick={() => setIsSeatingArrangementAuto(false)}
            className={`flex gap-3 items-center text-lg rounded-xl px-6 py-3 shadow-lg transition-all duration-300 ${
              !isSeatingArrangementAuto 
                ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 shadow-purple-200"
                : "bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 hover:from-purple-100 hover:to-purple-200 border border-purple-200"
            }`}
          >
            <Image
              src={teacherImages.manual}
              alt="manual"
              width={20}
              height={20}
              className="w-5 h-5"
            />
            <span className="font-medium">Manual</span>
          </Button>

          <StudentSeatingConditionsDialog 
            studentClassName="flex gap-3 items-center text-lg text-white rounded-xl px-6 py-3 shadow-lg transition-all duration-300 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 font-medium"
            conditions={seatingConditions}
            setConditions={setSeatingConditions}
            students={currentArrangement?.arrangements?.map((a: any) => ({
              studentId: a.studentId,
              studentName: a.studentName,
            })) || []}
          />

          <CreateArrangementDialog
            courses={courses}
            tenantPrimaryDomain={tenantPrimaryDomain}
            accessToken={accessToken}
            refreshToken={refreshToken}
            onSuccess={() => loadArrangements(selectedCourse || undefined)}
          />

          <Button className="flex gap-3 items-center text-lg bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-xl px-6 py-3 shadow-lg transition-all duration-300 font-medium">
            <Image
              src={generalImages.print}
              alt="print"
              width={20}
              height={20}
              className="w-5 h-5"
            />
            <span>Print Layout</span>
          </Button>
      </div>

        {/* Enhanced Seating Card */}
        <Card className="rounded-2xl shadow-xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center p-4 gap-1">
              <video
                src="/assets/videos/general/drea_metrix_loader.mp4"
                autoPlay
                loop
                muted
                className="w-[150px] h-[150px] object-contain"
              />
              <label className="mt-0 text-sm text-slate-500">Loading data...</label>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap-reverse p-6">
            <div className="flex flex-col gap-6 flex-1">
              <div className="flex justify-between items-center pb-6 border-b border-gray-200">
                <div className="space-y-2">
                  <PageTitleH2 title="Classroom Layout" className="text-gray-800 font-bold" />
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></div>
                    <label className="text-gray-600 font-medium">Interactive Whiteboard</label>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    onClick={handleSave}
                    disabled={!isModified || isSaving}
                    className={`flex gap-3 items-center text-lg rounded-xl px-6 py-3 transition-all duration-300 font-medium ${
                      isModified 
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg shadow-green-200"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                    isLoading={isSaving}
                  >
                    <Image
                      src={teacherImages.save}
                      alt="save"
                      width={20}
                      height={20}
                      className="w-5 h-5"
                    />
                    <span>Save Layout</span>
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-6">
                <div className="w-[20%] flex flex-col gap-4 pr-6">
                  <button
                    title="Toggle Students List"
                    className="flex justify-center items-center h-10 w-10 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 cursor-pointer"
                    onClick={() => setDisplayStudentsList(!displayStudentsList)}
                  >
                    {displayStudentsList ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>

                  {displayStudentsList && currentArrangement && (
                    <div className="flex-1 overflow-auto">
                      <div className="mb-3">
                        <input
                          type="text"
                          placeholder="Search students..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                      {renderStudentList}
                    </div>
                  )}

                  {currentArrangement && (
                    <>
                      <Button
                        onClick={handleCleanAllSeats}
                        className="flex mt-6 gap-3 items-center text-lg bg-gradient-to-r from-red-50 to-red-100 text-red-700 hover:from-red-100 hover:to-red-200 rounded-xl px-6 py-3 shadow-lg transition-all duration-300 border border-red-200 font-medium"
                      >
                        <Image
                          src={teacherImages.delete}
                          alt="clean"
                          width={20}
                          height={20}
                          className="w-5 h-5"
                        />
                        <span>Clear All</span>
                      </Button>

                      <Button
                        className="flex gap-3 items-center text-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl px-6 py-3 shadow-lg transition-all duration-300 mt-4 font-medium"
                        onClick={() => handleDeactivateEvent(parseInt(currentArrangement.id))}
                        isLoading={isDeactivating}
                      >
                        <Image
                          src={teacherImages.delete}
                          alt="delete"
                          width={20}
                          height={20}
                          className="w-5 h-5"
                        />
                        <span>Deactivate</span>
                      </Button>
                    </>
                  )}
                </div>

                <div className="w-[80%] bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-dashed border-gray-300">
                  <div className="mb-4 text-center">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.84L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.84l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                      </svg>
                      Front of Classroom
                    </div>
                  </div>
                  {GridComponent}
                </div>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <SeatingHistory
                arrangements={arrangements.filter(arr => 
                  selectedClasses.length === 0 || selectedClasses.includes(arr.courseName)
                )}
                currentArrangement={currentArrangement}
                setCurrentArrangement={setCurrentArrangement}
                tenantPrimaryDomain={tenantPrimaryDomain}
                accessToken={accessToken}
                refreshToken={refreshToken}
                onReactivate={() => loadArrangements(currentClassId ? parseInt(currentClassId) : undefined)}
                currentClass={currentClassId}
              />
            </div>
          </div>
        )}
        </Card>
      </div>

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deactivation</DialogTitle>
            <DialogDescription>
              Are you sure you want to deactivate this seating arrangement?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsConfirmDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={confirmDeactivation}
              isLoading={isDeactivating}
            >
              Confirm Deactivation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}