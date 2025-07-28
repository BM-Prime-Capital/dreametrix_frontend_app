"use client";

import { useState, useEffect } from "react";
import { useRequestInfo } from "./useRequestInfo";
import { getClasses } from "@/services/ClassService";
import { getStudents } from "@/services/student-service";
import { getTeachers } from "@/services/TeacherService";

// Types for the communication data
export interface CommunicationClass {
  id: string;
  name: string;
}

export interface CommunicationStudent {
  id: string;
  name: string;
  class: string;
  avatar?: string;
}

export interface CommunicationParent {
  id: string;
  name: string;
  student: string;
  avatar?: string;
}

export interface CommunicationTeacher {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface UseCommunicationDataReturn {
  classes: CommunicationClass[];
  students: CommunicationStudent[];
  parents: CommunicationParent[];
  teachers: CommunicationTeacher[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useCommunicationData(): UseCommunicationDataReturn {
  const [classes, setClasses] = useState<CommunicationClass[]>([]);
  const [students, setStudents] = useState<CommunicationStudent[]>([]);
  const [parents, setParents] = useState<CommunicationParent[]>([]);
  const [teachers, setTeachers] = useState<CommunicationTeacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { accessToken, refreshToken, tenantDomain } = useRequestInfo();

  const fetchData = async () => {
    if (!accessToken || !tenantDomain) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch classes, students, and teachers in parallel
      const [classesData, studentsData, teachersData] = await Promise.all([
        getClasses(tenantDomain, accessToken, refreshToken),
        getStudents(tenantDomain, accessToken),
        getTeachers(tenantDomain, accessToken, refreshToken),
      ]);

      // Debug logging to understand the API responses
      console.log("🔍 DEBUG API Responses:", {
        classesData: classesData,
        studentsData: studentsData,
        teachersData: teachersData,
        classesIsArray: Array.isArray(classesData),
        studentsResultsIsArray: Array.isArray(studentsData?.results),
        teachersIsArray: Array.isArray(teachersData),
      });

      // Transform classes data
      const transformedClasses: CommunicationClass[] = Array.isArray(
        classesData
      )
        ? classesData.map((cls: any) => ({
            id: cls.id.toString(),
            name: cls.name || `Class ${cls.id}`,
          }))
        : [];

      // Transform students data
      const transformedStudents: CommunicationStudent[] = Array.isArray(
        studentsData?.results
      )
        ? studentsData.results.map((student: any) => ({
            id: student.id.toString(),
            name:
              student.full_name ||
              `${student.first_name} ${student.last_name}`.trim() ||
              `Student ${student.id}`,
            class: student.current_class?.name || "No Class",
            avatar: student.avatar || "/assets/images/general/student.png",
          }))
        : [];

      // Transform teachers data
      const transformedTeachers: CommunicationTeacher[] = Array.isArray(
        teachersData
      )
        ? teachersData.map((teacher: any) => ({
            id: teacher.id.toString(),
            name:
              teacher.full_name ||
              `${teacher.first_name} ${teacher.last_name}`.trim() ||
              teacher.username ||
              `Teacher ${teacher.id}`,
            email: teacher.email || "",
            avatar: teacher.avatar || "/assets/images/general/teacher.png",
          }))
        : [];

      // Log transformation results
      console.log("🔍 DEBUG Transformed Data:", {
        classesCount: transformedClasses.length,
        studentsCount: transformedStudents.length,
        teachersCount: transformedTeachers.length,
        sampleStudent: transformedStudents[0],
        sampleClass: transformedClasses[0],
        sampleTeacher: transformedTeachers[0],
      });

      // Generate mock parents based on students (since there's no direct parent API)
      const transformedParents: CommunicationParent[] = transformedStudents.map(
        (student) => ({
          id: `p${student.id}`,
          name: `Parent of ${student.name}`,
          student: student.name,
          avatar: "/assets/images/general/parent.png",
        })
      );

      setClasses(transformedClasses);
      setStudents(transformedStudents);
      setTeachers(transformedTeachers);
      setParents(transformedParents);
    } catch (err) {
      console.error("Error fetching communication data:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [accessToken, tenantDomain, refreshToken]);

  const refetch = async () => {
    await fetchData();
  };

  return {
    classes,
    students,
    parents,
    teachers,
    loading,
    error,
    refetch,
  };
}
