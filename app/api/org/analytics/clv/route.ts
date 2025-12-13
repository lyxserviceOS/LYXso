import { NextResponse } from 'next/server';
import { getApiBaseUrl } from '@/lib/apiConfig';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const segment = searchParams.get('segment') || 'all';
    
    // Get org_id from headers or session
    const orgId = request.headers.get('x-org-id') || 'default-org-id';
    
    const API_URL = getApiBaseUrl();
    
    const response = await fetch(
      `${API_URL}/api/orgs/${orgId}/analytics/clv?segment=${segment}`,
      {
        headers: {
          'Authorization': request.headers.get('Authorization') || '',
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('CLV API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch CLV data' },
      { status: 500 }
    );
  }
}
