import { NextRequest, NextResponse } from "next/server";
import { getApiBaseUrl } from "@/lib/apiConfig";

const API_BASE_URL = getApiBaseUrl();

/**
 * GET /api/org/team/invitations
 * Hent alle aktive invitasjoner
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orgId = searchParams.get("orgId");

    if (!orgId) {
      return NextResponse.json(
        { error: "orgId is required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${API_BASE_URL}/api/orgs/${orgId}/team/invitations`,
      {
        method: "GET",
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
    console.error("Error fetching invitations:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch invitations",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
