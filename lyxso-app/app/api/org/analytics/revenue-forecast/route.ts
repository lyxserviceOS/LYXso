import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const months = searchParams.get('months') || '6';
    
    // Get org_id from headers or session
    const orgId = request.headers.get('x-org-id') || 'default-org-id';
    
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    
    const response = await fetch(
      `${API_URL}/api/orgs/${orgId}/analytics/revenue-forecast?months=${months}`,
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
    console.error('Revenue Forecast API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch revenue forecast data' },
      { status: 500 }
    );
  }
}
