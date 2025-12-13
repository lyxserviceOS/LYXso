import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getApiBaseUrl } from '@/lib/apiConfig';

export async function POST(request: NextRequest) {
  try {
    // Get session token
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse form data with photos
    const formData = await request.formData();
    
    const API_URL = getApiBaseUrl();
    
    // Get orgId from session/user
    const sessionRes = await fetch(`${API_URL}/api/auth/session`, {
      headers: {
        Cookie: `session=${sessionToken}`,
      },
    });
    
    if (!sessionRes.ok) {
      return NextResponse.json({ error: "Session invalid" }, { status: 401 });
    }
    
    const session = await sessionRes.json();
    const orgId = session.user?.org_id;
    
    if (!orgId) {
      return NextResponse.json({ error: "No organization found" }, { status: 400 });
    }

    // Forward to backend AI analysis
    const backendFormData = new FormData();
    
    // Add all photos from the request
    const photos = formData.getAll("photos");
    photos.forEach((photo: any) => {
      backendFormData.append("photos", photo);
    });

    // Call backend AI analysis endpoint
    const backendRes = await fetch(
      `${API_URL}/api/tyres/analyze`,
      {
        method: "POST",
        headers: {
          Cookie: `session=${sessionToken}`,
        },
        body: backendFormData,
      }
    );

    if (!backendRes.ok) {
      const error = await backendRes.text();
      return NextResponse.json(
        { error: "AI analysis failed", details: error },
        { status: backendRes.status }
      );
    }

    const result = await backendRes.json();

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error("AI analysis error:", error);
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}
