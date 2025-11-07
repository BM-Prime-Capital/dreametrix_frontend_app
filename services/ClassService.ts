import { ISchoolClass } from "@/types";

interface ScheduleItem {
  date?: string;
  start_time: string;
  end_time: string;
}

interface ClassSchedule {
  [key: string]: ScheduleItem[];
}

// Normalize time strings to HH:mm:ss; supports "HH:mm", "HH:mm:ss", and "h:mm AM/PM"
const normalizeTimeString = (time: string | undefined): string | undefined => {
  if (!time) return undefined;
  const trimmed = time.trim();
  const ampmMatch = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (ampmMatch) {
    let hours = parseInt(ampmMatch[1], 10);
    const minutes = ampmMatch[2];
    const period = ampmMatch[3].toUpperCase();
    if (period === "PM" && hours < 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    return `${hours.toString().padStart(2, "0")}:${minutes}:00`;
  }
  if (/^\d{1,2}:\d{2}$/.test(trimmed)) return `${trimmed}:00`;
  if (/^\d{1,2}:\d{2}:\d{2}$/.test(trimmed)) return trimmed;
  return trimmed;
};

export async function getClasses(
  tenantPrimaryDomain: string,
  accessToken: string,
  _refreshToken: string
) {
  void _refreshToken;
  if (!accessToken) {
    throw new Error("Vous n'êtes pas connecté. Veuillez vous reconnecter.");
  }
  const url = `${tenantPrimaryDomain}/classes/`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Session expired. Please log in again.");
    } else if (response.status === 403) {
      throw new Error("Vous n'avez pas la permission d'accéder aux classes.");
    } else {
      throw new Error("Erreur lors de la récupération des classes.");
    }
  }

  const data = await response.json();
  return data.results;
}

type LooseSchedule = Partial<ScheduleItem> & { date?: string };

type StudentInput = number | { id: number };

export async function createClass(
  classData: ISchoolClass,
  tenantPrimaryDomain: string,
  accessToken: string,
  _refreshToken: string
) {
  void _refreshToken;
  try {
    const url = `${tenantPrimaryDomain}/classes/`;

    // Format schedule data
    const formattedSchedule: ClassSchedule = {};
    const scheduleMap = classData
      .hours_and_dates_of_course_schedule as unknown as Record<string, LooseSchedule | LooseSchedule[]>;
    Object.entries(scheduleMap).forEach(([day, schedules]) => {
      const scheduleArray = Array.isArray(schedules) ? schedules : [schedules];
      formattedSchedule[day] = scheduleArray.map((schedule) => ({
        date: schedule.date || new Date().toISOString().split("T")[0],
        start_time: normalizeTimeString(schedule.start_time) as string,
        end_time: normalizeTimeString(schedule.end_time) as string,
      }));
    });

    // Normalize teacher to an ID
    const teacherField: number | { id: number } | undefined = (classData as unknown as { teacher?: number | { id: number } }).teacher;
    const teacherId = typeof teacherField === "number" ? teacherField : teacherField?.id;

    // Ensure students is an array of IDs as expected by backend
    const rawStudents = (classData as unknown as { students?: StudentInput[] }).students ?? [];
    const studentIds = rawStudents
      .map((student) => (typeof student === "number" ? student : student.id))
      .filter((id): id is number => typeof id === "number");

    const data = {
      name:
        classData.name ||
        `Class ${classData.grade} - ${classData.subject_in_short}`,
      subject_in_all_letter: classData.subject_in_all_letter,
      subject_in_short: classData.subject_in_short,
      hours_and_dates_of_course_schedule: formattedSchedule,
      description:
        classData.description ||
        `Class ${classData.grade} - ${classData.subject_in_short}`,
      grade: classData.grade,
      teacher: teacherId,
      students: studentIds,
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      return await response.json();
    } else {
      console.error("POST Class Failed:", await response.json());
      return null;
    }
  } catch (error) {
    console.error("Error creating class:", error);
    return null;
  }
}

export async function updateClass(
  classData: ISchoolClass & { id: number },
  tenantPrimaryDomain: string,
  accessToken: string,
  _refreshToken: string
) {
  void _refreshToken;
  try {
    // Helper to normalize time to HH:mm:ss
    const normalizeTime = normalizeTimeString;

    // Map students to IDs (allow empty array)
    const students = Array.isArray(classData.students)
      ? (classData.students as StudentInput[])
          .map((student) => (typeof student === "number" ? student : student.id))
          .filter((id): id is number => typeof id === "number")
      : [];

    // Normalize teacher to ID
    let teacher: number | undefined;
    const teacherRaw: unknown = (classData as unknown as { teacher?: number | { id: number } }).teacher;
    if (typeof teacherRaw === "number") {
      teacher = teacherRaw;
    } else if (teacherRaw && typeof (teacherRaw as { id?: unknown }).id === "number") {
      teacher = (teacherRaw as { id: number }).id;
    }

    if (!teacher) {
      throw new Error("Teacher ID is required");
    }

    // Normalize schedule structure and times
    const formattedSchedule: ClassSchedule = {};
    const updateScheduleMap = classData
      .hours_and_dates_of_course_schedule as unknown as Record<string, LooseSchedule | LooseSchedule[]>;
    if (updateScheduleMap && typeof updateScheduleMap === "object") {
      Object.entries(updateScheduleMap).forEach(([day, schedules]) => {
        const scheduleArray = Array.isArray(schedules) ? schedules : [schedules];
        formattedSchedule[day] = scheduleArray
          .filter((s) => Boolean(s))
          .map((s) => ({
            date: s.date || new Date().toISOString().split("T")[0],
            start_time: normalizeTime(s.start_time) as string,
            end_time: normalizeTime(s.end_time) as string,
          }));
      });
    }

    const data = {
      name: classData.name,
      subject_in_all_letter: classData.subject_in_all_letter,
      subject_in_short: classData.subject_in_short,
      hours_and_dates_of_course_schedule: formattedSchedule,
      description: classData.description,
      grade: classData.grade,
      teacher: teacher,
      students: students,
    };

    console.log("UPDATING Class payload => ", data);

    const url = `${tenantPrimaryDomain}/classes/${classData.id}/`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("PUT Class Failed - Detailed Error:", {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        error: errorData,
      });
      // Extract first friendly message
      let friendly = "Failed to update class.";
      if (errorData && typeof errorData === "object") {
        // Look for common fields
        const firstKey = Object.keys(errorData)[0];
        const firstVal = firstKey ? errorData[firstKey] : null;
        if (Array.isArray(firstVal) && firstVal.length > 0 && typeof firstVal[0] === "string") {
          friendly = firstVal[0];
        } else if (typeof errorData.detail === "string") {
          friendly = errorData.detail;
        }
        // Specific friendly copy for empty students when grade has none
        if ((String(friendly).toLowerCase().includes("student") && String(friendly).toLowerCase().includes("none"))|| String(friendly).toLowerCase().includes("this list may")) {
          friendly = "No students available for this grade. Add students or choose another grade.";
        }
      }
      throw new Error(friendly);
    }

    return await response.json();
  } catch (error) {
    console.error("Unhandled Error in updateClass:", error);
    throw error;
  }
}

export async function deleteClass(
  classId: number,
  tenantPrimaryDomain: string,
  accessToken: string,
  _refreshToken: string
) {
  void _refreshToken;
  try {
    const url = `${tenantPrimaryDomain}/classes/${classId}/`;
    console.log("deleteClass url:", url);
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const responseData = await response.json(); // Toujours parser la réponse JSON

    if (!response.ok) {
      console.error("DELETE Class Failed:", response.status, responseData);
      throw new Error(responseData.message || "Failed to delete class");
    }

    // Retourner true si le message indique un succès
    return responseData.message === "Class deleted successfully.";
  } catch (error) {
    console.error("Error deleting class:", error);
    throw error;
  }
}
