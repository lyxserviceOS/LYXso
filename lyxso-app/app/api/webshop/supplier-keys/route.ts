import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/webshop/supplier-keys - List all supplier API keys for org
export async function GET(request: NextRequest) {
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

    // Only admin/owner can view supplier keys
    if (!profile?.org_id || !["admin", "owner"].includes(profile.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data: supplierKeys, error } = await supabase
      .from("webshop_supplier_keys")
      .select("*")
      .eq("org_id", profile.org_id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching supplier keys:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ supplierKeys }, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/webshop/supplier-keys error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/webshop/supplier-keys - Add new supplier API key
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

    if (!profile?.org_id || !["admin", "owner"].includes(profile.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const {
      supplier_name,
      api_key,
      api_secret,
      api_endpoint,
      sync_enabled,
      sync_frequency,
      sync_categories,
      min_price,
      max_price,
    } = body;

    if (!supplier_name || !api_key) {
      return NextResponse.json(
        { error: "Supplier name and API key are required" },
        { status: 400 }
      );
    }

    // Check if supplier key already exists
    const { data: existing } = await supabase
      .from("webshop_supplier_keys")
      .select("id")
      .eq("org_id", profile.org_id)
      .eq("supplier_name", supplier_name)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "API key for this supplier already exists" },
        { status: 409 }
      );
    }

    const { data: supplierKey, error } = await supabase
      .from("webshop_supplier_keys")
      .insert({
        org_id: profile.org_id,
        supplier_name,
        api_key,
        api_secret,
        api_endpoint,
        sync_enabled: sync_enabled ?? true,
        sync_frequency: sync_frequency ?? 'daily',
        sync_categories,
        min_price,
        max_price,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating supplier key:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ supplierKey }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/webshop/supplier-keys error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
