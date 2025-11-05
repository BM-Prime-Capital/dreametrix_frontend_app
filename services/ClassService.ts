import { ISchoolClass } from "@/types";

interface ScheduleItem {
  date?: string;
  start_time: string;
  end_time: string;
}

interface ClassSchedule {
  [key: string]: ScheduleItem[];
}

export async function getClasses(
  tenantPrimaryDomain: string,
  accessToken: string,
  refreshToken: string
) {
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

export async function createClass(
  classData: ISchoolClass,
  tenantPrimaryDomain: string,
  accessToken: string,
  refreshToken: string
) {
  try {
    const url = `${tenantPrimaryDomain}/classes/`;

    // Format schedule data
    const formattedSchedule: ClassSchedule = {};
    Object.entries(classData.hours_and_dates_of_course_schedule).forEach(
      ([day, schedules]) => {
        const scheduleArray = Array.isArray(schedules)
          ? schedules
          : [schedules];
        formattedSchedule[day] = scheduleArray.map((schedule: any) => ({
          date: schedule.date || new Date().toISOString().split("T")[0],
          start_time: schedule.start_time,
          end_time: schedule.end_time,
        }));
      }
    );

    // Normalize teacher to an ID
    const teacherId =
      typeof (classData as any).teacher === "number"
        ? (classData as any).teacher
        : (classData as any).teacher?.id;

    // Ensure students is an array of IDs as expected by backend
    const studentIds = Array.isArray((classData as any).students)
      ? (classData as any).students
          .map((student: any) => {
            if (typeof student === "number") return student;
            if (student?.id) return student.id;
            return null;
          })
          .filter((id: any) => id !== null)
      : [];

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
  classData: any,
  tenantPrimaryDomain: string,
  accessToken: string,
  refreshToken: string
) {
  try {
    // Helper to normalize time to HH:mm:ss
    const normalizeTime = (time: string | undefined): string | undefined => {
      if (!time) return undefined;
      // Accept values like "09:00" or "09:00:00" or with AM/PM
      const trimmed = time.trim();
      // If contains AM/PM, convert to 24h
      const ampmMatch = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
      if (ampmMatch) {
        let hours = parseInt(ampmMatch[1], 10);
        const minutes = ampmMatch[2];
        const period = ampmMatch[3].toUpperCase();
        if (period === "PM" && hours < 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0;
        return `${hours.toString().padStart(2, "0")}:${minutes}:00`;
      }
      // If HH:mm
      const hhmm = trimmed.match(/^\d{1,2}:\d{2}$/);
      if (hhmm) return `${trimmed}:00`;
      // If HH:mm:ss assume valid
      const hhmmss = trimmed.match(/^\d{1,2}:\d{2}:\d{2}$/);
      if (hhmmss) return trimmed;
      return trimmed; // fallback without alteration
    };

    // Map students to IDs (allow empty array)
    const students = Array.isArray(classData.students)
      ? classData.students
          .map((student: any) => {
            if (typeof student === "number") return student;
            if (student?.id) return student.id;
            return null;
          })
          .filter((id: any) => id !== null)
      : [];

    // Normalize teacher to ID
    const teacher =
      typeof classData.teacher === "number"
        ? classData.teacher
        : classData.teacher?.id;

    if (!teacher) {
      throw new Error("Teacher ID is required");
    }

    // Normalize schedule structure and times
    const formattedSchedule: ClassSchedule = {};
    if (classData.hours_and_dates_of_course_schedule && typeof classData.hours_and_dates_of_course_schedule === "object") {
      Object.entries(classData.hours_and_dates_of_course_schedule).forEach(([day, schedules]) => {
        const scheduleArray = Array.isArray(schedules) ? schedules : [schedules];
        formattedSchedule[day] = scheduleArray
          .filter((s: any) => s)
          .map((s: any) => ({
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
  refreshToken: string
) {
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
