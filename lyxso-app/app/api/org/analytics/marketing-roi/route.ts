import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    // Get org_id from headers or session
    const orgId = request.headers.get('x-org-id') || 'default-org-id';
    
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await fetch(
      `${API_URL}/api/orgs/${orgId}/analytics/marketing-roi?${params}`,
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
    console.error('Marketing ROI API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch marketing ROI data' },
      { status: 500 }
    );
  }
}
