import { NextRequest, NextResponse } from 'next/server';
import { getBackendBaseUrl } from '@/app/utils/constants';
import { getTenantDomain } from '@/app/utils/cookies';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get the authorization header from the request
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header is required' },
        { status: 401 }
      );
    }

    const tenantDomain = getTenantDomain(request);
    if (!tenantDomain) {
      return NextResponse.json(
        { error: 'Tenant domain not found' },
        { status: 400 }
      );
    }

    const assignmentId = params.id;
    const backendUrl = getBackendBaseUrl(tenantDomain);

    // Make the request to the backend
    const response = await fetch(`${backendUrl}/submissions/?assessment_id=${assignmentId}`, {
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
        { error: errorData.detail || 'Failed to fetch assignment submissions' },
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