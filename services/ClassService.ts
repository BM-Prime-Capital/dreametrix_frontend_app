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
    // Vérifier et formater les étudiants
    const students = Array.isArray(classData.students)
      ? classData.students
          .map((student: any) => {
            if (typeof student === "number") return student;
            if (student?.id) return student.id;
            return null;
          })
          .filter((id: any) => id !== null)
      : [];

    // Vérifier le teacher
    const teacher =
      typeof classData.teacher === "number"
        ? classData.teacher
        : classData.teacher?.id;

    if (!teacher) {
      throw new Error("Teacher ID is required");
    }

    const data = {
      ...classData,
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
      const errorData = await response.json(); // Utilisez .json() au lieu de .text()
      console.error("PUT Class Failed - Detailed Error:", {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        error: errorData,
      });
      throw new Error(JSON.stringify(errorData));
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
