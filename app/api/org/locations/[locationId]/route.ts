import { NextRequest, NextResponse } from 'next/server';
import { getApiBaseUrl } from '@/lib/apiConfig';

const API_URL = getApiBaseUrl();

export async function PUT(request: NextRequest, context: any) {
  try {
    const params = await context?.params;
    if (!params || !params.locationId) {
      return NextResponse.json(
        { error: "Missing locationId in route params" },
        { status: 400 }
      );
    }
    const { locationId } = params as { locationId: string };
    // TODO: Get orgId from session/auth
    const orgId = request.headers.get('x-org-id') || 'temp-org-id';
    const body = await request.json();

    const response = await fetch(
      `${API_URL}/api/orgs/${orgId}/locations/${locationId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating location:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: any) {
  try {
    const params = await context?.params;
    if (!params || !params.locationId) {
      return NextResponse.json(
        { error: "Missing locationId in route params" },
        { status: 400 }
      );
    }
    const { locationId } = params as { locationId: string };
    // TODO: Get orgId from session/auth
    const orgId = request.headers.get('x-org-id') || 'temp-org-id';

    const response = await fetch(
      `${API_URL}/api/orgs/${orgId}/locations/${locationId}`,
      {
        method: 'DELETE',
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
    console.error('Error deleting location:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
