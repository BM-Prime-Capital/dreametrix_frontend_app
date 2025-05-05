"use server";


export async function getAttendances(
  params: { date: string; class_id: number; teacher_id: number },
  tenantPrimaryDomain: string,
  accessToken: string,
  refreshToken: string
) {
  const url = `${tenantPrimaryDomain}/attendances/get-attendances/?class_id=${params.class_id}&date=${params.date}`;
  
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    }
  });

  if (!response.ok) {
    const errorData = await response.json(); // Pour voir l'erreur détaillée du backend
    console.error("Erreur du backend:", errorData);
    throw new Error(errorData.message || "Erreur lors de la récupération des présences");
  }

  const responseData = await response.json();
  console.log("Réponse du backend:", responseData); // Affiche toute la réponse

  return responseData.attendances; // Retourne uniquement le tableau des présences
}

export async function initializeAttendances(
  params: { 
    date: string; 
    class_id: number; 
    teacher_id: number;
    status: string; // 'present' | 'absent' | 'late' | 'half_day'
  },
  tenantPrimaryDomain: string,
  accessToken: string,
  refreshToken: string
) {
  const url = `${tenantPrimaryDomain}/attendances/initialize-attendance/`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(params)
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Erreur du backend:", errorData);
    throw new Error(errorData.error || "Erreur lors de la création des présences");
  }

  const responseData = await response.json();
  return responseData; // Retourne la liste des présences créées
}

export const updateAttendances = async (
  data: {
    date: string;
    student_ids: string[];
    status: 'present' | 'absent' | 'late' | 'excused';
  },
  tenantDomain: string,
  accessToken: string,
  refreshToken: string
) => {
  const response = await fetch(
    `${tenantDomain}/api/attendances/bulk-update`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'X-Refresh-Token': refreshToken,
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to update attendances');
  }

  return response.json();
};


export async function getClassStudents(
  classId: number,
  tenantPrimaryDomain: string,
  accessToken: string,
  refreshToken: string
) {
  const url = `${tenantPrimaryDomain}/api/courses/${classId}/enrolled_students/`;
  
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      'X-Refresh-Token': refreshToken,
    }
  });

  if (!response.ok) {
    throw new Error('Failed to load class students');
  }

  return await response.json();
}

export async function getStudentAttendanceStats(
  studentId: number,
  tenantPrimaryDomain: string,
  accessToken: string,
  refreshToken: string
) {
  const url = `${tenantPrimaryDomain}/students/${studentId}/stats/`;
  
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'X-Refresh-Token': refreshToken,
      }
    });

    if (!response.ok) {
      // Handle 401 Unauthorized specifically
      if (response.status === 401) {
        throw new Error("You don't have permission to view these statistics");
      }
      
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to load attendance statistics");
    }

    const data = await response.json();
    console.log("Student Attendance Stats:", data); // Log the data for debugging
   
    return {
      present: data.present_days || 0,
      absent: data.absent_days || 0,
      late: data.late_days || 0,
      half_day: data.half_day_days || 0,
      total: data.total_days || 0
    };
  } catch (error) {
    console.error("Error fetching attendance stats:", error);
    // Return default values if there's an error
    return {
      present: 0,
      absent: 0,
      late: 0,
      half_day: 0,
      total: 0
    };
  }
}

export async function updateMultipleAttendances(
  data: { updates: Array<{ attendance_id: number; status: string; notes: string }> },
  tenantPrimaryDomain: string,
  accessToken: string,
  refreshToken: string
) {
  try {
    const url = `${tenantPrimaryDomain}/attendances/update-attendances/`;
    let response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const data: any = await response.json();
      console.log("PUT Multiple Attendances data => ", data);
      return "ok";
    } else {
      console.log("PUT Multiple Attendances Failed => ", response);
      throw new Error("Multiple attendances modification failed");
    }
  } catch (error) {
    console.log("Error => ", error);
    throw error;
  }
}


export async function updateAttendance(
  attendance: any,
  tenantPrimaryDomain: string,
  accessToken: string,
  refreshToken: string
) {
  try {
    const data = {
      updates: [
        {
          attendance_id: attendance.attendance_id,
          status: attendance.status,
          notes: "Not Applicable",
        },
      ],
    };
    const url = `${tenantPrimaryDomain}/attendances/update-attendances/`;
    let response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const data: any = await response.json();
      console.log("PUT Attendance data => ", data);
      return "ok";
    } else {
      console.log("PUT Attendance Failed => ", response);
      throw new Error("Attendance modification failed");
    }
  } catch (error) {
    console.log("Error => ", error);
  }
}

export async function getAttendanceGeneralView(
  tenantPrimaryDomain: string,
  accessToken: string,
  refreshToken: string
) {
  if (!accessToken) {
    throw new Error("Vous n'êtes pas connecté. Veuillez vous reconnecter.");
  }
  const url = `${tenantPrimaryDomain}/attendances/general-view`;
  let response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    console.log("Error response => ", response);
    if (response.status === 403) {
      throw new Error("Vous n'avez pas la permission d'accéder aux data.");
    } else {
      throw new Error("Erreur lors de la récupération des attendances.");
    }
  }

  const data = await response.json();

  return data;
}