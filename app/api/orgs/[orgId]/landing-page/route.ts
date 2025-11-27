import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Create Supabase client with service role for API routes
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

function getSupabase() {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase configuration");
  }
  return createClient(supabaseUrl, supabaseServiceKey);
}

// GET /api/orgs/[orgId]/landing-page
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { orgId } = await params;

    if (!orgId) {
      return NextResponse.json(
        { error: "Missing orgId parameter" },
        { status: 400 }
      );
    }

    const supabase = getSupabase();

    const { data, error } = await supabase
      .from("partner_landing_pages")
      .select("*")
      .eq("org_id", orgId)
      .single();

    if (error) {
      // If no landing page exists yet, return empty data
      if (error.code === "PGRST116") {
        return NextResponse.json({ data: null });
      }
      console.error("Error fetching landing page:", error);
      return NextResponse.json(
        { error: "Failed to fetch landing page" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error("Landing page GET error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/orgs/[orgId]/landing-page
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { orgId } = await params;

    if (!orgId) {
      return NextResponse.json(
        { error: "Missing orgId parameter" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const supabase = getSupabase();

    // Check if landing page exists
    const { data: existing } = await supabase
      .from("partner_landing_pages")
      .select("id")
      .eq("org_id", orgId)
      .single();

    let result;

    if (existing) {
      // Update existing landing page
      result = await supabase
        .from("partner_landing_pages")
        .update({
          ...body,
          updated_at: new Date().toISOString(),
        })
        .eq("org_id", orgId)
        .select()
        .single();
    } else {
      // Create new landing page
      result = await supabase
        .from("partner_landing_pages")
        .insert({
          org_id: orgId,
          ...body,
        })
        .select()
        .single();
    }

    if (result.error) {
      console.error("Error saving landing page:", result.error);
      return NextResponse.json(
        { error: "Failed to save landing page" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: result.data });
  } catch (err) {
    console.error("Landing page PUT error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/orgs/[orgId]/landing-page
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { orgId } = await params;

    if (!orgId) {
      return NextResponse.json(
        { error: "Missing orgId parameter" },
        { status: 400 }
      );
    }

    const supabase = getSupabase();

    const { error } = await supabase
      .from("partner_landing_pages")
      .delete()
      .eq("org_id", orgId);

    if (error) {
      console.error("Error deleting landing page:", error);
      return NextResponse.json(
        { error: "Failed to delete landing page" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Landing page DELETE error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
