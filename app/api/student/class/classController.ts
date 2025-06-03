import { BASE_URL } from '@/app/utils/constantes';


export async function getAllClasses(token?: string) {
  const response = await fetch(`${BASE_URL}/classes/`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return { data: data, status: response.status };
}


export async function getClassById(id: number, token?: string) {
  const response = await fetch(`${BASE_URL}/classes/${id}/`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return { data: data, status: response.status };
}