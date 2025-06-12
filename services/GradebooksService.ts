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
  const url = `${tenantPrimaryDomain}/gradebooks/classes/`;
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
  const url = `${tenantPrimaryDomain}/gradebooks/classes/${id}`;
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
  submissionId: number, // Changed from studentId to submissionId
  assessmentType: string,
  assessmentIndex: number,
  grade: number,
  refreshToken: string
) {
  if (!accessToken) {
    throw new Error("You are not logged in. Please log in again.");
  }

  try {
    console.log("🔄 Updating grade for submission:", {
      submissionId,
      assessmentType,
      assessmentIndex,
      grade,
    });

    const url = `${tenantPrimaryDomain}/submissions/${submissionId}/`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Refresh-Token": refreshToken,
      },
      body: JSON.stringify({
        grade: grade,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Backend error:", errorData);

      if (response.status === 403) {
        throw new Error("You don't have permission to update grades.");
      } else if (response.status === 404) {
        throw new Error("Submission not found.");
      } else {
        throw new Error(
          errorData.detail || `Error updating grade. Status: ${response.status}`
        );
      }
    }

    const data = await response.json();

    console.log("✅ Grade updated successfully:", data);

    return {
      success: true,
      message: "Grade updated successfully",
      data: data,
    };
  } catch (error) {
    console.error("❌ Network error updating grade:", error);
    throw error;
  }
}

export async function saveVoiceRecording(
  tenantPrimaryDomain: string,
  accessToken: string,
  submissionId: number, // Changed from studentId to submissionId
  assessmentType: string,
  assessmentIndex: number,
  audioBase64: string, // Accept base64 string from client
  refreshToken: string
) {
  if (!accessToken) {
    throw new Error("You are not logged in. Please log in again.");
  }

  try {
    console.log("🎙️ Saving voice recording for submission:", {
      submissionId,
      assessmentType,
      assessmentIndex,
      audioSize: audioBase64.length + " characters (base64)",
    });

    // Convert base64 to Blob for FormData
    const base64Data = audioBase64.split(",")[1]; // Remove data:audio/webm;base64, prefix
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const audioBlob = new Blob([byteArray], { type: "audio/webm" });

    const url = `${tenantPrimaryDomain}/submissions/${submissionId}/`;

    // Create FormData for file upload
    const formData = new FormData();
    formData.append("voice_notes", audioBlob, "voice_recording.webm");

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Refresh-Token": refreshToken,
        // Don't set Content-Type header - let browser set it for FormData
      },
      body: formData, // Send FormData with the file
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Backend error:", errorData);

      if (response.status === 403) {
        throw new Error("You don't have permission to save voice recordings.");
      } else if (response.status === 404) {
        throw new Error("Submission not found.");
      } else {
        throw new Error(
          errorData.detail ||
            `Error saving voice recording. Status: ${response.status}`
        );
      }
    }

    const data = await response.json();

    console.log("✅ Voice recording saved successfully:", data);

    return {
      success: true,
      message: "Voice recording saved successfully",
      data: data,
      voice_notes_url: data.voice_notes, // Return the voice_notes URL from the response
    };
  } catch (error) {
    console.error("❌ Network error saving voice recording:", error);
    throw error;
  }
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
