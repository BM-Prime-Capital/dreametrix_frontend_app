// controllers/classController.ts
import { BASE_URL } from '@/app/utils/constantes';
import { fetchGet, fetchPost, fetchPut, fetchDelete } from '../../../utils/crud';
import { CourseWrite, CourseRead } from './classModel';

export async function getAllClasses(token?: string) {
  console.log("Appel de getAllClasses...");
  const response = await fetch(`${BASE_URL}/classes/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log("Réponse brute de l'API (fetch response object):", response);

  if (!response.ok) {
    console.error("Erreur HTTP:", response.status, response.statusText);
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  console.log("Données reçues (parsed JSON):", data);

  return { data: data, status: response.status };
}