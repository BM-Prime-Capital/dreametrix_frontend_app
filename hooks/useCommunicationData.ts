/* eslint-disable @typescript-eslint/no-explicit-any */
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
      console.log("🔍 Missing credentials:", {
        accessToken: !!accessToken,
        tenantDomain: !!tenantDomain,
      });
      setLoading(false);
      setError("Missing authentication credentials");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log("🔍 Fetching communication data with:", {
        tenantDomain,
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
      });

      // Fetch classes, students, and teachers in parallel
      const [classesData, studentsData, teachersData] = await Promise.all([
        getClasses(tenantDomain, accessToken, refreshToken),
        getStudents(tenantDomain, accessToken),
        getTeachers(tenantDomain, accessToken),
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

      // Log the EXACT structure of each data type
      console.log("📊 DETAILED DATA STRUCTURE:");

      // Classes structure
      console.log("🏫 CLASSES STRUCTURE:", {
        type: typeof classesData,
        isArray: Array.isArray(classesData),
        length: Array.isArray(classesData) ? classesData.length : "N/A",
        firstClass:
          Array.isArray(classesData) && classesData.length > 0
            ? classesData[0]
            : null,
        classKeys:
          Array.isArray(classesData) && classesData.length > 0
            ? Object.keys(classesData[0])
            : [],
        sample3Classes: Array.isArray(classesData)
          ? classesData.slice(0, 3)
          : classesData,
        fullClassesData: classesData,
      });

      // Students structure
      console.log("👨‍🎓 STUDENTS STRUCTURE:", {
        type: typeof studentsData,
        hasResults: !!studentsData?.results,
        resultsIsArray: Array.isArray(studentsData?.results),
        resultsLength: Array.isArray(studentsData?.results)
          ? studentsData.results.length
          : "N/A",
        firstStudent:
          Array.isArray(studentsData?.results) &&
          studentsData.results.length > 0
            ? studentsData.results[0]
            : null,
        studentKeys:
          Array.isArray(studentsData?.results) &&
          studentsData.results.length > 0
            ? Object.keys(studentsData.results[0])
            : [],
        sample3Students: Array.isArray(studentsData?.results)
          ? studentsData.results.slice(0, 3)
          : studentsData?.results,
        fullStudentsData: studentsData,
      });

      // Teachers structure
      console.log("👨‍🏫 TEACHERS STRUCTURE:", {
        type: typeof teachersData,
        isArray: Array.isArray(teachersData),
        length: Array.isArray(teachersData) ? teachersData.length : "N/A",
        firstTeacher:
          Array.isArray(teachersData) && teachersData.length > 0
            ? teachersData[0]
            : null,
        teacherKeys:
          Array.isArray(teachersData) && teachersData.length > 0
            ? Object.keys(teachersData[0])
            : [],
        sample3Teachers: Array.isArray(teachersData)
          ? teachersData.slice(0, 3)
          : teachersData,
      });

      // Transform classes data
      const transformedClasses: CommunicationClass[] = Array.isArray(
        classesData
      )
        ? classesData.map((cls: any) => {
            // Use the actual structure: classes are directly in array
            let className = "Unknown Class";

            if (cls.name && cls.name.trim()) {
              className = cls.name.trim();
            } else if (cls.id) {
              className = `Class ${cls.id}`;
            }

            console.log("🔍 Processing class:", {
              id: cls.id,
              allAvailableKeys: Object.keys(cls),
              name: cls.name,
              subject_in_all_letter: cls.subject_in_all_letter,
              subject_in_short: cls.subject_in_short,
              grade: cls.grade,
              description: cls.description,
              teacher: cls.teacher,
              students_count: cls.students?.length || 0,
              originalData: cls,
              processedName: className,
            });

            return {
              id: cls.id.toString(),
              name: className,
              subject: cls.subject_in_all_letter || cls.subject_in_short,
              grade: cls.grade,
              description: cls.description,
              teacher: cls.teacher,
              studentsCount: cls.students?.length || 0,
            };
          })
        : [];

      // Transform students data
      let transformedStudents: CommunicationStudent[] = [];

      // Try to get students from the students API first
      if (Array.isArray(studentsData?.results)) {
        transformedStudents = studentsData.results.map((student: any) => {
          // More robust name handling - look in student.user for actual user data
          let studentName = "Unknown Student";

          // Check in student.user first (this is where the actual user data is)
          if (student.user?.full_name && student.user.full_name.trim()) {
            studentName = student.user.full_name.trim();
          } else if (student.user?.first_name || student.user?.last_name) {
            const firstName = student.user?.first_name || "";
            const lastName = student.user?.last_name || "";
            const combinedName = `${firstName} ${lastName}`.trim();
            if (combinedName) {
              studentName = combinedName;
            }
          } else if (student.full_name && student.full_name.trim()) {
            studentName = student.full_name.trim();
          } else if (student.first_name || student.last_name) {
            const firstName = student.first_name || "";
            const lastName = student.last_name || "";
            const combinedName = `${firstName} ${lastName}`.trim();
            if (combinedName) {
              studentName = combinedName;
            }
          } else if (student.username && student.username.trim()) {
            studentName = student.username.trim();
          } else if (student.name && student.name.trim()) {
            studentName = student.name.trim();
          } else if (student.id) {
            studentName = `Student ${student.id}`;
          }

          // More robust class handling - check enrolled_courses to match with classes
          let className = "No Class";
          if (
            student.current_class?.name &&
            student.current_class.name.trim()
          ) {
            className = student.current_class.name.trim();
          } else if (student.class_name && student.class_name.trim()) {
            className = student.class_name.trim();
          } else if (student.class?.name && student.class.name.trim()) {
            className = student.class.name.trim();
          } else if (Array.isArray(classesData) && student.enrolled_courses) {
            // Check if this student appears in any class using enrolled_courses
            const foundInClass = classesData.find((cls: any) =>
              student.enrolled_courses.includes(cls.id)
            );
            if (foundInClass) {
              className = foundInClass.name;
            }
          }

          console.log("🔍 Processing student:", {
            id: student.id,
            allAvailableKeys: Object.keys(student),
            user: student.user,
            user_full_name: student.user?.full_name,
            user_first_name: student.user?.first_name,
            user_last_name: student.user?.last_name,
            full_name: student.full_name,
            first_name: student.first_name,
            last_name: student.last_name,
            username: student.username,
            name: student.name,
            enrolled_courses: student.enrolled_courses,
            current_class: student.current_class,
            class_name: student.class_name,
            class: student.class,
            originalData: student,
            processedName: studentName,
            processedClass: className,
          });

          return {
            id: student.id.toString(),
            name: studentName,
            class: className,
            avatar: student.avatar || "/assets/images/general/student.png",
          };
        });
      }

      // Fallback: If no students from API, extract from classes data
      else if (Array.isArray(classesData)) {
        console.log("🔄 Using fallback: extracting students from classes data");
        const studentsMap = new Map();

        classesData.forEach((cls: any) => {
          if (cls.students && Array.isArray(cls.students)) {
            cls.students.forEach((student: any) => {
              if (!studentsMap.has(student.id)) {
                studentsMap.set(student.id, {
                  id: student.id.toString(),
                  name: student.full_name || `Student ${student.id}`,
                  class: cls.name,
                  avatar: "/assets/images/general/student.png",
                });
              }
            });
          }
        });

        transformedStudents = Array.from(studentsMap.values());
        console.log("🔄 Extracted students from classes:", transformedStudents);
      }

      // Transform teachers data
      const  transformedTeachers: CommunicationTeacher[] = Array.isArray(
        teachersData
      )
        ? teachersData.map((teacher: any) => {
            console.log("🔍 Processing teacher:", {
              id: teacher.id,
              allAvailableKeys: Object.keys(teacher),
              full_name: teacher.full_name,
              first_name: teacher.first_name,
              last_name: teacher.last_name,
              username: teacher.username,
              name: teacher.name,
              email: teacher.email,
              originalData: teacher,
            });

            return {
              id: teacher.id.toString(),
              name:
                teacher.full_name ||
                `${teacher.first_name} ${teacher.last_name}`.trim() ||
                teacher.username ||
                `Teacher ${teacher.id}`,
              email: teacher.email || "",
              avatar: teacher.avatar || "/assets/images/general/teacher.png",
            };
          })
        : [];

      // If teachers API failed, try to extract teachers from classes data
      if (transformedTeachers.length === 0 && Array.isArray(classesData)) {
        console.log("🔄 Using fallback: extracting teachers from classes data");
        const teachersMap = new Map();

        classesData.forEach((cls: any) => {
          if (cls.teacher && cls.teacher.id && cls.teacher.full_name) {
            if (!teachersMap.has(cls.teacher.id)) {
              teachersMap.set(cls.teacher.id, {
                id: cls.teacher.id.toString(),
                name: cls.teacher.full_name,
                email: "", // Not available in classes data
                avatar: "/assets/images/general/teacher.png",
              });
            }
          }
        });

        if (teachersMap.size > 0) {
          transformedTeachers.push(...Array.from(teachersMap.values()));
          console.log(
            "🔄 Extracted teachers from classes:",
            transformedTeachers
          );
        }
      }

      // Log transformation results
      console.log("🔍 DEBUG Transformed Data:", {
        classesCount: transformedClasses.length,
        studentsCount: transformedStudents.length,
        teachersCount: transformedTeachers.length,
        sampleStudent: transformedStudents[0],
        sampleClass: transformedClasses[0],
        sampleTeacher: transformedTeachers[0],
      });

      // Final summary log
      console.log("✅ FINAL TRANSFORMATION SUMMARY:");
      console.log("🏫 Classes:", transformedClasses);
      console.log("👨‍🎓 Students:", transformedStudents);
      console.log("👨‍🏫 Teachers:", transformedTeachers);

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
      console.error("❌ ERROR fetching communication data:");
      console.error("Error object:", err);
      console.error(
        "Error message:",
        err instanceof Error ? err.message : "Unknown error"
      );
      console.error(
        "Error stack:",
        err instanceof Error ? err.stack : "No stack trace"
      );
      console.error("API credentials check:", {
        hasAccessToken: !!accessToken,
        hasTenantDomain: !!tenantDomain,
        hasRefreshToken: !!refreshToken,
        tenantDomain: tenantDomain,
      });

      setError(err instanceof Error ? err.message : "Failed to fetch data");

      // If it's a network error, let's provide some fallback data for development
      if (process.env.NODE_ENV === "development") {
        console.log("🔧 Using fallback data for development");
        setClasses([
          { id: "1", name: "Class 1A" },
          { id: "2", name: "Class 1B" },
          { id: "3", name: "Class 2A" },
        ]);
        setStudents([
          {
            id: "1",
            name: "John Doe",
            class: "Class 1A",
            avatar: "/assets/images/general/student.png",
          },
          {
            id: "2",
            name: "Jane Smith",
            class: "Class 1A",
            avatar: "/assets/images/general/student.png",
          },
          {
            id: "3",
            name: "Bob Johnson",
            class: "Class 1B",
            avatar: "/assets/images/general/student.png",
          },
          {
            id: "4",
            name: "Alice Brown",
            class: "Class 2A",
            avatar: "/assets/images/general/student.png",
          },
        ]);
        setTeachers([
          {
            id: "1",
            name: "Prof. Wilson",
            email: "wilson@school.edu",
            avatar: "/assets/images/general/teacher.png",
          },
          {
            id: "2",
            name: "Dr. Anderson",
            email: "anderson@school.edu",
            avatar: "/assets/images/general/teacher.png",
          },
        ]);
      }
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
