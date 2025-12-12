import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/webshop/visibility-rules - List all rules
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("org_id")
      .eq("id", user.id)
      .single();

    if (!profile?.org_id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data: rules, error } = await supabase
      .from("webshop_visibility_rules")
      .select("*")
      .eq("org_id", profile.org_id)
      .order("priority", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ rules: rules || [] }, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/webshop/visibility-rules error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/webshop/visibility-rules - Create new rule
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("org_id, role")
      .eq("id", user.id)
      .single();

    // Only admin/owner can create rules
    if (!profile?.org_id || !["admin", "owner"].includes(profile.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();

    const { data: rule, error } = await supabase
      .from("webshop_visibility_rules")
      .insert({
        org_id: profile.org_id,
        name: body.name,
        rule_type: body.rule_type,
        conditions: body.conditions,
        product_filters: body.product_filters,
        priority: body.priority || 0,
        is_active: body.is_active !== undefined ? body.is_active : true,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ rule }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/webshop/visibility-rules error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
