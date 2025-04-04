// api/services/TestPrepService.ts
import { Answer, CorrectionResult, TestDetails } from '../types/testPrepTypes';

const API_BASE_URL = 'http://localhost:3001'; 
console.log('TestPrepService.ts - API_BASE_URL:', API_BASE_URL); // Debug log
export const submitTestAnswers = async (answers: Answer[]): Promise<CorrectionResult> => {
  const response = await fetch(`${API_BASE_URL}/api/testprep/correct`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ answers }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to submit answers');
  }
  
  return await response.json();
};

export const generateTestReport = async (data: {
  answers: Answer[],
  testDetails: TestDetails
}): Promise<Blob> => {
  const response = await fetch(`${API_BASE_URL}/api/testprep/generate-pdf`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to generate PDF');
  }

  return await response.blob();
};