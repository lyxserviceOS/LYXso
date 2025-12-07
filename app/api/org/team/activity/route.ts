import { NextRequest, NextResponse } from "next/server";
import { getApiBaseUrl } from "@/lib/apiConfig";

const API_BASE_URL = getApiBaseUrl();

/**
 * GET /api/org/team/activity
 * Hent aktivitetslogg
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orgId = searchParams.get("orgId");
    const limit = searchParams.get("limit") || "50";
    const offset = searchParams.get("offset") || "0";

    if (!orgId) {
      return NextResponse.json(
        { error: "orgId is required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${API_BASE_URL}/api/orgs/${orgId}/team/activity?limit=${limit}&offset=${offset}`,
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
    console.error("Error fetching activity log:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch activity log",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
