import { getBackendUrl } from "@/app/utils/tenant";

export async function getAssignments(token?: string) {
  const backendUrl = getBackendUrl();
  const response = await fetch(`${backendUrl}/assessments`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return { data: data, status: response.status };
}
