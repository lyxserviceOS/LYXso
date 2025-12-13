import { NextRequest, NextResponse } from 'next/server';
import { getApiBaseUrl } from '@/lib/apiConfig';

const API_URL = getApiBaseUrl();

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${API_URL}/api/team/roles`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching roles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
