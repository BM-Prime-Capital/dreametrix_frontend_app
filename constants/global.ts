import { SheetDomain } from "@/types";

export const attendanceLabel = {
  PRESENT: "Present",
  ABSENT: "Absent",
  LATE: "Late",
  HALF_DAY: "Half Day",
};

export const studentClassCharacters = [
  "Integrity",
  "Grit",
  "Emotional Intelligence",
  "Positivity",
  "Self-control",
  "Intellectual curiosity",
  "Decorum",
  "Optimism",
  "Gratitude",
  "Engagement",
];

export const classSubject = {
  MATH: "Math",
  LANGUAGE: "Language",
};

export const allSheetDomains: SheetDomain[] = [
  // Math 3
  {
    subject: classSubject.MATH,
    grade: "3",
    name: "(3.NF) Number And Operations-Fractions",
    specificStandards: [
      "3.NF.1",
      "3.NF.2.a",
      "3.NF.2.b",
      "3.NF.2a",
      "3.NF.2b",
      "3.NF.3.a",
      "3.NF.3.b",
      "3.NF.3a",
      "3.NF.3b",
      "3.NF.3c",
      "3.NF.3d",
      "3.NF.A.1",
      "3.NF.A.2",
      "3.NF.A.2a",
      "3.NF.A.3",
      "3.NF.A.3a",
      "3.NF.A.3b",
      "3.NF.A.3c",
      "3.NF.A.3d",
    ],
  },
  {
    subject: classSubject.MATH,
    grade: "3",
    name: "(3.OA) Operations and Algebraic Thinking",
    specificStandards: [
      "3.OA.1",
      "3.OA.2",
      "3.OA.3",
      "3.OA.4",
      "3.OA.5",
      "3.0A.6",
      "3.0A.7",
      "3.0A.8",
      "3.0A.9",
    ],
  },
  {
    subject: classSubject.MATH,
    grade: "3",
    name: "(3.MD) Measurement and Data",
    specificStandards: [
      "3.MD.1",
      "3.MD.2",
      "3.MD.3",
      "3.MD.4",
      "3.MD.5",
      "3.MD.6",
      "3.MD.7.a",
      "3.0A.8.b",
      "3.0A.9.d",
      "3.0A.9.c",
    ],
  },
  {
    subject: classSubject.MATH,
    grade: "3",
    name: "(3.G) Geometry",
    specificStandards: ["3.G.2", "3.G.A.2"],
  },
  {
    subject: classSubject.MATH,
    grade: "3",
    name: "(3.NBT) Number and Operations in Base Ten",
    specificStandards: ["3.NBT.1", "3.NBT.3"],
  },
  {
    subject: classSubject.MATH,
    grade: "3",
    name: "(4.NBT) Number And Operations In Base Ten",
    specificStandards: ["4.NBT.6"],
  },
  {
    subject: classSubject.MATH,
    grade: "3",
    name: "(4.OA) Operations And Algebraic Thinking",
    specificStandards: ["4.0A.3a"],
  },
  {
    subject: classSubject.MATH,
    grade: "3",
    name: "(4.NF) Number And Operations-Fractions",
    specificStandards: ["4.NF.2"],
  },

  // Math 4
  {
    subject: classSubject.MATH,
    grade: "4",
    name: "(4.NBT) Number and Operations In Base Ten",
    specificStandards: [
      "4.NBT.1",
      "4.NBT.2",
      "4.NBT.3",
      "4.NBT.4",
      "4.NBT.5",
      "4.NBT.6",
    ],
  },
  {
    subject: classSubject.MATH,
    grade: "4",
    name: "(4.G) Geometry",
    specificStandards: [
      "4.G.1",
      "4.G.2",
      "4.G.2a",
      "4.G.2c",
      "4.G.3",
      "4.G.A.1",
      "4.G.A.2",
      "4.G.A.3",
    ],
  },
  {
    subject: classSubject.MATH,
    grade: "4",
    name: "(4.NF) Number And Operations-Fractions",
    specificStandards: [
      "4.NF.1",
      "4.NF.2",
      "4.NF.3.a",
      "4.NF.3.b",
      "4.NF.3.c",
      "4.NF.3.d",
      "4.NF.4.a",
      "4.NF.4.b",
      "4.NF.4.c",
    ],
  },
  {
    subject: classSubject.MATH,
    grade: "4",
    name: "(4.OA) Operations And Algebraic Thinking",
    specificStandards: [
      "4.OA.1",
      "4.OA.2",
      "4.OA.3",
      "4.OA.3.a",
      "4.OA.3.b",
      "4.OA.4",
      "4.OA.5",
      "4.OA.A.1",
      "4.OA.A.2",
      "4.OA.A.3",
      "4.OA.B.4",
      "4.OA.C.5",
    ],
  },
  {
    subject: classSubject.MATH,
    grade: "4",
    name: "(3.MD) Measurement and Data",
    specificStandards: ["3.MD.4", "3.MD.8"],
  },
  {
    subject: classSubject.MATH,
    grade: "4",
    name: "(4.MD) Measurement and Data",
    specificStandards: [
      "4.MD.3",
      "4.MD.4",
      "4.MD.5.a",
      "4.MD.5.b",
      "4.MD.6",
      "4.MD.7",
    ],
  },
  {
    subject: classSubject.MATH,
    grade: "4",
    name: "(3.G) Geometry",
    specificStandards: ["3.G.A.1"],
  },

  // Math 5
  {
    subject: classSubject.MATH,
    grade: "5",
    name: "(5.NF) Number And Operations-Fractions",
    specificStandards: [
      "5.NF.1",
      "5.NF.2",
      "5.NF.3",
      "5.NF.4.a",
      "5.NF.4.b",
      "5.NF.5.a",
      "5.NF.5.b",
      "5.NF.6",
      "5.NF.7.a",
      "5.NF.7.c",
      "5.NF.A.1",
      "5.NF.A.2",
      "5.NF.B.3",
      "5.NF.B.4",
      "5.NF.B.5",
      "5.NF.B.6",
      "5.NF.B.7",
    ],
  },
  {
    subject: classSubject.MATH,
    grade: "5",
    name: "(5.NBT) Number and Operations In Base Ten",
    specificStandards: [
      "5.NBT.1",
      "5.NBT.2",
      "5.NBT.3.a",
      "5.NBT.3.b",
      "5.NBT.6",
      "5.NBT.7",
    ],
  },
  {
    subject: classSubject.MATH,
    grade: "5",
    name: "(5.MD) Measurement And Data",
    specificStandards: [
      "5.MD.1",
      "5.MD.2",
      "5.MD.3.a",
      "5.MD.3.b",
      "5.MD.4",
      "5.MD.5.a",
      "5.MD.5.b",
      "5.MD.5.c",
      "5.MD.A.1",
      "5.MD.B.2",
      "5.MD.C.3",
      "5.MD.C.3.a",
      "5.MD.C.3.b",
      "5.MD.C.4",
      "5.MD.C.5.a",
      "5.MD.C.5.b",
      "5.MD.C.5.c",
    ],
  },
  {
    subject: classSubject.MATH,
    grade: "5",
    name: "(5.OA) Operations And Algebraic Thinking",
    specificStandards: ["5.OA.1", "5.OA.2", "5.OA.A.1", "5.OA.1.A.2"],
  },
  {
    subject: classSubject.MATH,
    grade: "5",
    name: "(5.G) Geometry",
    specificStandards: ["5.G.3", "5.G.4", "5.G.B.3", "5.G.B.4"],
  },
  {
    subject: classSubject.MATH,
    grade: "5",
    name: "(4.NF) Number And Operations-Fractions",
    specificStandards: ["4.NF.5", "4.NF.6", "4.NF.7"],
  },
  {
    subject: classSubject.MATH,
    grade: "5",
    name: "(4.MD) Measurement And Data",
    specificStandards: ["4.MD.2"],
  },

  // TODO(add remaining Math domains)

  // Language
];

// TODO: allClasses should be saved in the redux store
export const initialClasses = [
  {
    subject: classSubject.MATH,
    grade: "3",
    name: "Class 3 - Math",
  },
  {
    subject: classSubject.MATH,
    grade: "4",
    name: "Class 4 - Math",
  },

  {
    subject: classSubject.LANGUAGE,
    grade: "3",
    name: "Class 3 - Language",
  },
  {
    subject: classSubject.LANGUAGE,
    grade: "4",
    name: "Class 4 - Language",
  },
];

export const views = {
  GENERAL_VIEW: "General View",
  FOCUSED_VIEW: "Focused View",
};

export const localStorageKey = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  USER_DATA: "userData",
  TENANT_DATA: "tenantData",
  CURRENT_SELECTED_CLASS: "selectedClass",
  CHARACTERS_LIST: "charractersList",
  ALL_CLASSES: "classes",
};

export const dayOfTheWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];
