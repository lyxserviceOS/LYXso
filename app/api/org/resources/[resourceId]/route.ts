import { NextRequest, NextResponse } from 'next/server';
import { getApiBaseUrl } from '@/lib/apiConfig';

const API_URL = getApiBaseUrl();

export async function PUT(request: NextRequest, context: any) {
  try {
    const params = await context?.params;
    if (!params || !params.resourceId) {
      return NextResponse.json(
        { error: "Missing resourceId in route params" },
        { status: 400 }
      );
    }
    const { resourceId } = params as { resourceId: string };
    // TODO: Get orgId from session/auth
    const orgId = request.headers.get('x-org-id') || 'temp-org-id';
    const body = await request.json();

    const response = await fetch(
      `${API_URL}/api/orgs/${orgId}/resources/${resourceId}`,
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
    console.error('Error updating resource:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: any) {
  try {
    const params = await context?.params;
    if (!params || !params.resourceId) {
      return NextResponse.json(
        { error: "Missing resourceId in route params" },
        { status: 400 }
      );
    }
    const { resourceId } = params as { resourceId: string };
    // TODO: Get orgId from session/auth
    const orgId = request.headers.get('x-org-id') || 'temp-org-id';

    const response = await fetch(
      `${API_URL}/api/orgs/${orgId}/resources/${resourceId}`,
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
    console.error('Error deleting resource:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
