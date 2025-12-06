import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4200';

export async function DELETE(
import { NextRequest, NextResponse } from "next/server";
import { getApiBaseUrl } from "@/lib/apiConfig";

const API_BASE_URL = getApiBaseUrl();

/**
 * PUT /api/org/team/members/[memberId]
 * Oppdater team member (rolle/permissions)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ memberId: string }> }
) {
  try {
    const { memberId } = await params;
    const orgId = request.headers.get('x-org-id') || 'temp-org-id';

    const response = await fetch(
      `${API_URL}/api/orgs/${orgId}/team/members/${memberId}`,
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
    console.error('Error removing team member:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
    const searchParams = request.nextUrl.searchParams;
    const orgId = searchParams.get("orgId");
    const body = await request.json();

    if (!orgId) {
      return NextResponse.json({ error: "orgId is required" }, { status: 400 });
    }

    const response = await fetch(
      `${API_BASE_URL}/api/orgs/${orgId}/team/members/${memberId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error updating member:", error);
    return NextResponse.json(
      {
        error: "Failed to update member",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/org/team/members/[memberId]
 * Fjern team member
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ memberId: string }> }
) {
  try {
    const { memberId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const orgId = searchParams.get("orgId");

    if (!orgId) {
      return NextResponse.json({ error: "orgId is required" }, { status: 400 });
    }

    const response = await fetch(
      `${API_BASE_URL}/api/orgs/${orgId}/team/members/${memberId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error removing member:", error);
    return NextResponse.json(
      {
        error: "Failed to remove member",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
