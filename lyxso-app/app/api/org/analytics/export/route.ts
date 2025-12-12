import { NextRequest, NextResponse } from "next/server";
import { getApiBaseUrl } from "@/lib/apiConfig";

const API_BASE_URL = getApiBaseUrl();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orgId = searchParams.get("orgId");
    const format = searchParams.get("format") || "csv";
    const range = searchParams.get("range") || "month";

    if (!orgId) {
      return NextResponse.json(
        { error: "orgId is required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${API_BASE_URL}/api/orgs/${orgId}/analytics/export?format=${format}&range=${range}`,
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

    // Forward the response with correct headers
    const blob = await response.blob();
    const headers = new Headers();
    
    if (format === "csv") {
      headers.set("Content-Type", "text/csv; charset=utf-8");
      headers.set(
        "Content-Disposition",
        `attachment; filename="analytics-${range}-${Date.now()}.csv"`
      );
    } else {
      headers.set(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      headers.set(
        "Content-Disposition",
        `attachment; filename="analytics-${range}-${Date.now()}.xlsx"`
      );
    }

    return new NextResponse(blob, { headers });
  } catch (error: any) {
    console.error("Error exporting analytics:", error);
    return NextResponse.json(
      {
        error: "Failed to export analytics",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
