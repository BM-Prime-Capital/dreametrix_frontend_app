"use server";

const characterPath = "/characters/initialize-class/";

export async function getGradeBookList(
  tenantPrimaryDomain: string,
  accessToken: string,
  refreshToken: string
) {
  if (!accessToken) {
    throw new Error("Vous n'êtes pas connecté. Veuillez vous reconnecter.");
  }
  const url = `${tenantPrimaryDomain}/gradebooks/`;
  let response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error(
        "Vous n'avez pas la permission d'accéder aux enseignants."
      );
    } else {
      throw new Error("Erreur lors de la récupération des enseignants.");
    }
  }

  const data = await response.json();

  return data;
}

export async function getGradeBookFocusList(
  tenantPrimaryDomain: string,
  accessToken: string,
  id: string,
  refreshToken: string
) {
  if (!accessToken) {
    throw new Error("Vous n'êtes pas connecté. Veuillez vous reconnecter.");
  }
  const url = `${tenantPrimaryDomain}/gradebooks/${id}`;
  let response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error(
        "Vous n'avez pas la permission d'accéder aux enseignants."
      );
    } else {
      throw new Error(
        `Erreur lors de la récupération des enseignants. URL: ${url}`
      );
    }
  }

  const data = await response.json();

  return data;
}
export async function updateStudentGrade(
  tenantPrimaryDomain: string,
  accessToken: string,
  studentId: number,
  assessmentType: string,
  assessmentIndex: number,
  grade: number,
  refreshToken: string
) {
  if (!accessToken) {
    throw new Error("You are not logged in. Please log in again.");
  }

  // MOCK/FAKE API RESPONSE - Remove this when real endpoint is ready
  console.log("MOCK: Updating grade for student:", {
    studentId,
    assessmentType,
    assessmentIndex,
    grade,
  });

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Simulate successful response
  return {
    success: true,
    message: "Grade updated successfully",
    data: {
      student_id: studentId,
      assessment_type: assessmentType,
      assessment_index: assessmentIndex,
      grade: grade,
      updated_at: new Date().toISOString(),
    },
  };

  // REAL API CALL - Uncomment when backend is ready
}

export async function saveVoiceRecording(
  tenantPrimaryDomain: string,
  accessToken: string,
  studentId: number,
  assessmentType: string,
  assessmentIndex: number,
  audioBase64: string, // Changed from Blob to string
  refreshToken: string
) {
  if (!accessToken) {
    throw new Error("You are not logged in. Please log in again.");
  }

  // MOCK/FAKE API RESPONSE - Remove this when real endpoint is ready
  console.log("MOCK: Saving voice recording for:", {
    studentId,
    assessmentType,
    assessmentIndex,
    audioSize: audioBase64.length + " characters (base64)",
  });

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate successful response
  return {
    success: true,
    message: "Voice recording saved successfully",
    data: {
      recording_id: `rec_${Date.now()}`,
      student_id: studentId,
      assessment_type: assessmentType,
      assessment_index: assessmentIndex,
      file_size: audioBase64.length,
      created_at: new Date().toISOString(),
    },
  };

  // REAL API CALL - Uncomment when backend is ready
  /*
  const url = `${tenantPrimaryDomain}/gradebooks/voice-recording/`;
  let response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      student_id: studentId,
      assessment_type: assessmentType,
      assessment_index: assessmentIndex,
      audio_data: audioBase64, // Send base64 string in JSON
      mime_type: "audio/webm"
    })
  });

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("You don't have permission to save voice recordings.");
    } else {
      throw new Error(`Error saving voice recording. URL: ${url}`);
    }
  }

  const data = await response.json();
  return data;
  */
}

export async function getVoiceRecordings(
  tenantPrimaryDomain: string,
  accessToken: string,
  classId: string,
  refreshToken: string
) {
  if (!accessToken) {
    throw new Error("You are not logged in. Please log in again.");
  }

  // MOCK/FAKE API RESPONSE - Remove this when real endpoint is ready
  console.log("MOCK: Getting voice recordings for class:", classId);

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Simulate some existing recordings (you can modify this for testing)
  return {
    success: true,
    recordings: [
      {
        student_id: "1",
        assessment_type: "test",
        assessment_index: 0,
        recording_id: "rec_1",
      },
      {
        student_id: "2",
        assessment_type: "quiz",
        assessment_index: 1,
        recording_id: "rec_2",
      },
      // Add more mock recordings as needed
    ],
  };

  // REAL API CALL - Uncomment when backend is ready
  /*
  const url = `${tenantPrimaryDomain}/gradebooks/${classId}/voice-recordings/`;
  let response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("You don't have permission to access voice recordings.");
    } else {
      throw new Error(`Error fetching voice recordings. URL: ${url}`);
    }
  }

  const data = await response.json();
  return data;
  */
}

export async function getVoiceRecordingAudio(
  tenantPrimaryDomain: string,
  accessToken: string,
  studentId: number,
  assessmentType: string,
  assessmentIndex: number,
  refreshToken: string
) {
  if (!accessToken) {
    throw new Error("You are not logged in. Please log in again.");
  }

  // MOCK/FAKE API RESPONSE - Remove this when real endpoint is ready
  console.log("MOCK: Getting voice recording audio for:", {
    studentId,
    assessmentType,
    assessmentIndex,
  });

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Simply return the audio URL - much more efficient!
  const audioUrl =
    "https://cdn.freesound.org/previews/810/810944_2520418-lq.mp3";

  return {
    success: true,
    audioUrl: audioUrl,
    message: "Voice recording audio URL fetched successfully",
  };

  // REAL API CALL - Uncomment when backend is ready
  /*
  const url = `${tenantPrimaryDomain}/gradebooks/voice-recording/${studentId}/${assessmentType}/${assessmentIndex}/`;
  let response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("You don't have permission to access this voice recording.");
    } else {
      throw new Error(`Error fetching voice recording audio. URL: ${url}`);
    }
  }

  const data = await response.json();
  return data;
  */
}
