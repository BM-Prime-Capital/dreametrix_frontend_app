import { BASE_URL } from "@/app/utils/constants";

export async function getAssignments(token?: string) {
  const response = await fetch(`${BASE_URL}/assessments`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return { data: data, status: response.status };
}
