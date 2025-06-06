import { BASE_URL } from '@/app/utils/constantes';
import { StudentGrade } from './gradebook.model';

export async function getGradebookByClassId(classId: number, token?: string): Promise<StudentGrade[]> {
  console.log(`Appel de getGradebookByClassId pour la classe ID ${classId}...`);
  const response = await fetch(`${BASE_URL}/gradebooks/${classId}/`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  console.log("Réponse brute de l'API (fetch response object) pour gradebook:", response);

  if (!response.ok) {
    console.error("Erreur HTTP pour gradebook:", response.status, response.statusText);
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  console.log("Données reçues (parsed JSON) pour gradebook:", data);

  return data as StudentGrade[];
} 