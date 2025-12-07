import { NextRequest, NextResponse } from "next/server";
import { getApiBaseUrl } from "@/lib/apiConfig";

const API_BASE_URL = getApiBaseUrl();

/**
 * POST /api/org/team/invite
 * Inviter nytt team member
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orgId, email, role, permissions } = body;

    if (!orgId || !email || !role) {
      return NextResponse.json(
        { error: "orgId, email, and role are required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${API_BASE_URL}/api/orgs/${orgId}/team/invite`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, role, permissions }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error inviting team member:", error);
    return NextResponse.json(
      {
        error: "Failed to invite team member",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
