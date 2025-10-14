import { getBackendUrl } from '@/app/utils/tenant';


export async function getAllClasses(token?: string) {
  const backendUrl = getBackendUrl();
  const response = await fetch(`${backendUrl}/classes/`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return { data: data, status: response.status };
}


export async function getClassById(id: number, token?: string) {
  const backendUrl = getBackendUrl();
  const response = await fetch(`${backendUrl}/classes/${id}/`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return { data: data, status: response.status };
}
