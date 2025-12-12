import { NextRequest, NextResponse } from "next/server";
import { getApiBaseUrl } from "@/lib/apiConfig";

const API_BASE_URL = getApiBaseUrl();

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/metrics`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching admin metrics:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch metrics",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
