"use client";

import { useState, useEffect } from "react";
import { useRequestInfo } from "./useRequestInfo";
import { getClasses } from "@/services/ClassService";
import { getStudents } from "@/services/student-service";
import { getTeachers } from "@/services/TeacherService";

// ---------------- TYPES ----------------
export interface CommunicationClass {
  id: string;
  name: string;
  subject?: string;
  grade?: string;
  description?: string;
  teacher?: {
    id: number;
    full_name: string;
  };
  studentsCount?: number;
}

export interface CommunicationStudent {
  id: string;       // user.id
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
  id: string;       // user.id
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

// ---------------- HOOK ----------------
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
      setError("Missing authentication credentials");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [classesData, studentsData, teachersData] = await Promise.all([
        getClasses(tenantDomain, accessToken, refreshToken),
        getStudents(tenantDomain, accessToken),
        getTeachers(tenantDomain, accessToken, refreshToken),
      ]);

      // ---------------- CLASSES ----------------
      const transformedClasses: CommunicationClass[] = Array.isArray(classesData)
        ? classesData.map((cls: any) => ({
            id: cls.id.toString(),
            name: cls.name?.trim() || `Class ${cls.id}`,
            subject: cls.subject_in_all_letter || cls.subject_in_short,
            grade: cls.grade,
            description: cls.description,
            teacher: cls.teacher,
            studentsCount: cls.students?.length || 0,
          }))
        : [];

      // ---------------- STUDENTS ----------------
      const transformedStudents: CommunicationStudent[] = Array.isArray(studentsData?.results)
        ? studentsData.results.map((student: any) => {
            const name =
              student.user?.full_name?.trim() ||
              `${student.user?.first_name || ""} ${student.user?.last_name || ""}`.trim() ||
              student.full_name ||
              student.username ||
              `Student ${student.id}`;

            // Classe avec fallback
            let className =
              student.current_class?.name?.trim() ||
              student.class_name?.trim() ||
              student.class?.name?.trim() ||
              "No Class";

            if (className === "No Class" && Array.isArray(classesData) && student.enrolled_courses) {
              const match = classesData.find((cls: any) =>
                student.enrolled_courses.includes(cls.id)
              );
              if (match) className = match.name;
            }

            return {
              id: student.user?.id?.toString() || student.id.toString(),
              name,
              class: className,
              avatar: student.avatar || "/assets/images/general/student.png",
            };
          })
        : [];

      // ---------------- TEACHERS ----------------
      const transformedTeachers: CommunicationTeacher[] = Array.isArray(teachersData)
        ? teachersData.map((teacher: any) => ({
            id: teacher.user?.id?.toString() || teacher.id.toString(),
            name:
              teacher.full_name ||
              `${teacher.first_name || ""} ${teacher.last_name || ""}`.trim() ||
              teacher.username ||
              `Teacher ${teacher.id}`,
            email: teacher.email || "",
            avatar: teacher.avatar || "/assets/images/general/teacher.png",
          }))
        : [];

      // ---------------- PARENTS (mockés à partir des étudiants) ----------------
      const transformedParents: CommunicationParent[] = transformedStudents.map((student) => ({
        id: `p${student.id}`,
        name: `Parent of ${student.name}`,
        student: student.name,
        avatar: "/assets/images/general/parent.png",
      }));

      // ---------------- SET STATE ----------------
      setClasses(transformedClasses);
      setStudents(transformedStudents);
      setTeachers(transformedTeachers);
      setParents(transformedParents);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [accessToken, tenantDomain, refreshToken]);

  return { classes, students, parents, teachers, loading, error, refetch: fetchData };
}
