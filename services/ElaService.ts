export async function fetchElaStandards(
  subject: string,
  grade: string,
  tenantPrimaryDomain: string,
  accessToken: string,
  refreshToken: string
) {
  if (!accessToken) {
    throw new Error("You are not logged in. Please log in again.");
  }

  const url = `${tenantPrimaryDomain}/digital_library/standards_ela/${subject}/${grade}/`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("ELA Standards Response:", {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error("You don't have permission to access this data.");
      } else {
        throw new Error("Error while fetching ELA standards.");
      }
    }

    const data = await response.json();
    console.log("ELA Standards Data:", data);

    // Extract the standards array from the response object
    const standards = data.standards || [];
    console.log("Extracted Standards:", standards);

    return standards;
  } catch (error) {
    console.error("Error fetching ELA standards:", error);
    throw error;
  }
}

export async function fetchElaStrands(
  subject: string,
  grade: string,
  standardsEla: string,
  tenantPrimaryDomain: string,
  accessToken: string,
  refreshToken: string
) {
  if (!accessToken) {
    throw new Error("You are not logged in. Please log in again.");
  }

  const url = `${tenantPrimaryDomain}/digital_library/strands/${subject}/${grade}/${encodeURIComponent(
    standardsEla
  )}/`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("ELA Strands Response:", {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error("You don't have permission to access this data.");
      } else {
        throw new Error("Error while fetching ELA strands.");
      }
    }

    const data = await response.json();
    console.log("ELA Strands Data:", data);

    // Extract the strands array from the response object
    const strands = data.strands || [];
    console.log("Extracted Strands:", strands);

    return strands;
  } catch (error) {
    console.error("Error fetching ELA strands:", error);
    throw error;
  }
}

export async function fetchElaSpecificStandards(
  subject: string,
  grade: string,
  standardsEla: string,
  strand: string,
  tenantPrimaryDomain: string,
  accessToken: string,
  refreshToken: string
) {
  if (!accessToken) {
    throw new Error("You are not logged in. Please log in again.");
  }

  const url = `${tenantPrimaryDomain}/digital_library/specific_standards/${subject}/${grade}/${encodeURIComponent(
    standardsEla
  )}/${encodeURIComponent(strand)}/`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error("You don't have permission to access this data.");
      } else {
        throw new Error("Error while fetching ELA specific standards.");
      }
    }

    const data = await response.json();
    console.log("ELA Specific Standards Data:", data);

    const specificStandards =
      data.specifique_standards || data.standards || data;
    console.log("Extracted Specific Standards:", specificStandards);

    return specificStandards;
  } catch (error) {
    console.error("Error fetching ELA specific standards:", error);
    throw error;
  }
}

export async function fetchElaQuestionLinks(
  subject: string,
  grade: string,
  standardsEla: string,
  strands: string,
  specificStandards: string,
  kind: string,
  tenantPrimaryDomain: string,
  accessToken: string,
  refreshToken: string
) {
  if (!accessToken) {
    throw new Error("You are not logged in. Please log in again.");
  }

  const url = `${tenantPrimaryDomain}/digital_library/links_ela/${subject}/${grade}/${standardsEla}/${strands}/${specificStandards}/${kind}/`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("ELA Question Links Response:", {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error("You don't have permission to access this data.");
      } else {
        throw new Error("Error while fetching ELA question links.");
      }
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching ELA question links:", error);
    throw error;
  }
}

export async function generateElaPdf(
  pdfData: {
    subject: string;
    grade: string;
    standards_ela: string;
    strands: string;
    specifique_standards: string;
    kind: string;
    selected_class: string;
    generate_answer_sheet: boolean;
    teacher_name: string;
    student_id: any;
    assignment_type: string;
    number_of_questions: number;
  },
  tenantPrimaryDomain: string,
  accessToken: string,
  refreshToken: string
) {
  if (!accessToken) {
    throw new Error("You are not logged in. Please log in again.");
  }

  const url = `${tenantPrimaryDomain}/digital_library/ela_generate-pdf/`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(pdfData),
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error("You don't have permission to generate the PDF.");
      } else {
        throw new Error("Error while generating ELA PDF.");
      }
    }

    // Return the blob for PDF download
    const blob = await response.blob();
    return blob;
  } catch (error) {
    throw error;
  }
}