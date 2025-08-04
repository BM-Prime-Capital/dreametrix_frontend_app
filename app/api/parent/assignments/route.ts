import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_BASE_URL } from '@/app/utils/constants';

export const dynamic = "force-dynamic";


export async function GET(request: NextRequest) {
  try {
    // Get the authorization header from the request
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header is required' },
        { status: 401 }
      );
    }

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('student_id');
    const classId = searchParams.get('class_id');
    const courseId = searchParams.get('course_id');
    const dateFrom = searchParams.get('date_from');
    const dateTo = searchParams.get('date_to');
    const published = searchParams.get('published');

    // Build the URL with query parameters
    const url = new URL(`${BACKEND_BASE_URL}/assessments`);
    
    if (studentId) url.searchParams.append('student_id', studentId);
    if (classId) url.searchParams.append('class_id', classId);
    if (courseId) url.searchParams.append('course_id', courseId);
    if (dateFrom) url.searchParams.append('date_from', dateFrom);
    if (dateTo) url.searchParams.append('date_to', dateTo);
    if (published) url.searchParams.append('published', published);

    // Make the request to the backend
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Backend error:', errorData);
      return NextResponse.json(
        { error: errorData.detail || 'Failed to fetch assignments' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 