import * as XLSX from "xlsx";

export type BulkUserRole = "teacher" | "student";

export interface BulkTeacher {
  firstName: string;
  lastName: string;
  email: string;
  role: "teacher";
}

export interface BulkStudent {
  firstName: string;
  lastName: string;
  email: string;
  role: "student";
  grade: number | null;
}

export type BulkUser = BulkTeacher | BulkStudent;

const emailRegex = /\S+@\S+\.\S+/;

function normaliseRow(row: any): Record<string, any> {
  const normalised: Record<string, any> = {};
  Object.entries(row).forEach(([key, value]) => {
    if (!key) return;
    normalised[String(key).trim().toLowerCase()] = value;
  });
  return normalised;
}

export async function parseExcelUsers(
  file: File,
  role: BulkUserRole
): Promise<BulkUser[]> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  const firstSheetName = workbook.SheetNames[0];

  if (!firstSheetName) {
    return [];
  }

  const worksheet = workbook.Sheets[firstSheetName];
  const rawRows: any[] = XLSX.utils.sheet_to_json(worksheet, {
    defval: "",
  });

  const users: BulkUser[] = [];

  for (const rawRow of rawRows) {
    const row = normaliseRow(rawRow);

    const firstName =
      (row["first_name"] as string) || (row["firstname"] as string) || "";
    const lastName =
      (row["last_name"] as string) || (row["lastname"] as string) || "";
    const email = (row["email"] as string) || "";

    if (!firstName || !lastName || !emailRegex.test(email)) {
      continue;
    }

    if (role === "teacher") {
      users.push({
        firstName: String(firstName).trim(),
        lastName: String(lastName).trim(),
        email: String(email).trim().toLowerCase(),
        role: "teacher",
      });
    } else {
      const gradeSource =
        row["grade"] ?? row["grade_level"] ?? row["grade_levels"];
      const parsedGrade =
        gradeSource !== undefined && gradeSource !== null
          ? Number.parseInt(String(gradeSource), 10)
          : NaN;

      users.push({
        firstName: String(firstName).trim(),
        lastName: String(lastName).trim(),
        email: String(email).trim().toLowerCase(),
        role: "student",
        grade: Number.isNaN(parsedGrade) ? null : parsedGrade,
      });
    }
  }

  return users;
}


