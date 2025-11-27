import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Create Supabase client with service role for API routes
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// Whitelist of allowed fields for landing page updates
const ALLOWED_FIELDS = [
  'hero_title',
  'hero_subtitle',
  'hero_image_url',
  'hero_cta_text',
  'hero_cta_link',
  'about_title',
  'about_content',
  'about_image_url',
  'services_title',
  'services_content',
  'show_contact',
  'contact_title',
  'contact_phone',
  'contact_email',
  'contact_address',
  'contact_map_url',
  'facebook_url',
  'instagram_url',
  'linkedin_url',
  'primary_color',
  'secondary_color',
  'font_family',
  'logo_url',
  'opening_hours',
  'meta_title',
  'meta_description',
  'meta_keywords',
  'is_published',
  'show_booking_widget',
  'custom_css',
  'gallery_images',
  'testimonials',
  'faq_items',
  'show_gallery',
  'show_testimonials',
  'show_faq',
  'gallery_title',
  'testimonials_title',
  'faq_title',
] as const;

// Filter request body to only include allowed fields
function sanitizeInput(body: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};
  for (const field of ALLOWED_FIELDS) {
    if (field in body) {
      sanitized[field] = body[field];
    }
  }
  return sanitized;
}

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
    const sanitizedBody = sanitizeInput(body as Record<string, unknown>);
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
          ...sanitizedBody,
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
          ...sanitizedBody,
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
