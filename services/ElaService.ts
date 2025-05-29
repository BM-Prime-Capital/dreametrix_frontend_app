// ELA Service - Fake API for ELA-specific data
// This will be replaced with real API calls later

export interface ElaData {
  standards: string[];
  strands: string[];
  specificStandards: string[];
}

export async function fetchElaData(
  subject: string,
  grade: string
): Promise<ElaData> {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Grade-specific ELA data
    const gradeInt = parseInt(grade);

    const baseData: ElaData = {
      standards: [
        "Reading Literature",
        "Reading Informational Text",
        "Writing",
        "Speaking and Listening",
        "Language",
      ],
      strands: [
        "Key Ideas and Details",
        "Craft and Structure",
        "Integration of Knowledge and Ideas",
        "Range of Reading and Level of Text Complexity",
      ],
      specificStandards: [],
    };

    // Generate grade-appropriate specific standards
    if (gradeInt <= 2) {
      baseData.specificStandards = [
        `RL.${grade}.1 - Ask and answer questions about key details`,
        `RL.${grade}.2 - Retell stories and demonstrate understanding`,
        `RL.${grade}.3 - Describe characters, settings, and major events`,
        `RI.${grade}.1 - Ask and answer questions about key details in text`,
        `RI.${grade}.2 - Identify the main topic and retell key details`,
        `W.${grade}.1 - Write opinion pieces`,
        `W.${grade}.2 - Write informative texts`,
        `SL.${grade}.1 - Participate in collaborative conversations`,
      ];
    } else if (gradeInt <= 5) {
      baseData.specificStandards = [
        `RL.${grade}.1 - Quote accurately when explaining text`,
        `RL.${grade}.2 - Determine theme and summarize text`,
        `RL.${grade}.3 - Compare and contrast characters`,
        `RI.${grade}.1 - Quote accurately when explaining text`,
        `RI.${grade}.2 - Determine main ideas and supporting details`,
        `W.${grade}.1 - Write opinion pieces with clear structure`,
        `W.${grade}.2 - Write informative texts with facts and details`,
        `SL.${grade}.1 - Engage effectively in collaborative discussions`,
      ];
    } else {
      baseData.specificStandards = [
        `RL.${grade}.1 - Cite textual evidence to support analysis`,
        `RL.${grade}.2 - Determine central theme and analyze development`,
        `RL.${grade}.3 - Analyze how characters develop over course of text`,
        `RI.${grade}.1 - Cite textual evidence to support analysis`,
        `RI.${grade}.2 - Determine central ideas and analyze development`,
        `W.${grade}.1 - Write arguments to support claims with reasoning`,
        `W.${grade}.2 - Write informative texts with relevant evidence`,
        `SL.${grade}.1 - Engage effectively in range of collaborative discussions`,
      ];
    }

    console.log(`Fake ELA API call for ${subject} grade ${grade}:`, baseData);
    return baseData;
  } catch (error) {
    console.error("Error in fake ELA API call:", error);
    return { standards: [], strands: [], specificStandards: [] };
  }
}

export async function fetchElaDomains(
  subject: string,
  grade: string,
  standard: string,
  strand: string,
  specificStandard: string
): Promise<string[]> {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Generate domains based on the selected ELA components
    const domains = [
      "Reading Comprehension",
      "Literary Analysis",
      "Text Structure and Organization",
      "Vocabulary and Language Use",
      "Writing Process and Techniques",
      "Research and Inquiry",
    ];

    console.log(
      `Fake ELA domains for grade ${grade}, standard: ${standard}:`,
      domains
    );
    return domains;
  } catch (error) {
    console.error("Error fetching ELA domains:", error);
    return [];
  }
}
