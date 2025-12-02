import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4200';

export async function GET(request: NextRequest) {
  try {
    const orgId = request.headers.get('x-org-id') || 'temp-org-id';
    const url = new URL(request.url);
    const limit = url.searchParams.get('limit') || '50';

    const response = await fetch(
      `${API_URL}/api/orgs/${orgId}/team/activity?limit=${limit}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching activity log:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
