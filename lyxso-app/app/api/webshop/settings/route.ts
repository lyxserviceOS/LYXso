import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/webshop/settings - Get webshop settings
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
      return NextResponse.json({ error: "No organization found" }, { status: 404 });
    }

    const { data: settings, error } = await supabase
      .from("webshop_settings")
      .select("*")
      .eq("org_id", profile.org_id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error("Error fetching settings:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // If no settings exist, return defaults
    if (!settings) {
      return NextResponse.json({ 
        settings: {
          org_id: profile.org_id,
          show_in_menu: true,
          show_partner_logos: false,
          default_markup_percentage: 20,
          show_compare_prices: false,
          currency: 'NOK',
          allow_pickup: true,
          allow_shipping: false,
          shipping_cost: 99,
          free_shipping_threshold: 500,
          require_account: false,
          allow_guest_checkout: true,
          tax_percentage: 25,
          tax_included_in_price: true,
          notify_on_new_order: true,
        }
      }, { status: 200 });
    }

    return NextResponse.json({ settings }, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/webshop/settings error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH /api/webshop/settings - Update settings
export async function PATCH(request: NextRequest) {
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

    // Upsert settings
    const { data: settings, error } = await supabase
      .from("webshop_settings")
      .upsert({
        org_id: profile.org_id,
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq("org_id", profile.org_id)
      .select()
      .single();

    if (error) {
      console.error("Error updating settings:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ settings }, { status: 200 });
  } catch (error: any) {
    console.error("PATCH /api/webshop/settings error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
