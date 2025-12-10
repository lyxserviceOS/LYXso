import { NextRequest, NextResponse } from "next/server";
import { getApiBaseUrl } from "@/lib/apiConfig";

const API_BASE_URL = getApiBaseUrl();

/**
 * POST /api/org/team/invitations/[invitationId]?action=resend
 * Send invitasjon på nytt
 */
export async function POST(request: NextRequest, context: any) {
  try {
    const params = await context?.params;
    if (!params || !params.invitationId) {
      return NextResponse.json(
        { error: "Missing invitationId in route params" },
        { status: 400 }
      );
    }
    const { invitationId } = params as { invitationId: string };
    const searchParams = request.nextUrl.searchParams;
    const orgId = searchParams.get("orgId");
    const action = searchParams.get("action");

    if (!orgId) {
      return NextResponse.json({ error: "orgId is required" }, { status: 400 });
    }

    if (action === "resend") {
      const response = await fetch(
        `${API_BASE_URL}/api/orgs/${orgId}/team/invitations/${invitationId}/resend`,
        {
          method: "POST",
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
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("Error processing invitation:", error);
    return NextResponse.json(
      {
        error: "Failed to process invitation",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/org/team/invitations/[invitationId]
 * Kanseller invitasjon
 */
export async function DELETE(request: NextRequest, context: any) {
  try {
    const params = await context?.params;
    if (!params || !params.invitationId) {
      return NextResponse.json(
        { error: "Missing invitationId in route params" },
        { status: 400 }
      );
    }
    const { invitationId } = params as { invitationId: string };
    const orgId = request.headers.get('x-org-id') || 'temp-org-id';

    const response = await fetch(
      `${API_BASE_URL}/api/orgs/${orgId}/team/invitations/${invitationId}`,
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
  } catch (error: any) {
    console.error("Error cancelling invitation:", error);
    return NextResponse.json(
      {
        error: "Failed to cancel invitation",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
