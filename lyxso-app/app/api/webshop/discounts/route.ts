import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/webshop/discounts
 * List all discount codes
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's organization
    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id")
      .eq("id", user.id)
      .single();

    if (!profile?.organization_id) {
      return NextResponse.json(
        { error: "No organization found" },
        { status: 404 }
      );
    }

    // Get discounts
    const { data: discounts, error } = await supabase
      .from("webshop_discounts")
      .select("*")
      .eq("organization_id", profile.organization_id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ discounts: discounts || [] });
  } catch (error: any) {
    console.error("Get discounts error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch discounts" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/webshop/discounts
 * Create a new discount code
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's organization
    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id")
      .eq("id", user.id)
      .single();

    if (!profile?.organization_id) {
      return NextResponse.json(
        { error: "No organization found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const {
      code,
      type,
      value,
      minAmount,
      startDate,
      endDate,
      usageLimit,
      conditions,
      categories,
      products,
      customerTypes,
    } = body;

    // Validate required fields
    if (!code || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if code already exists
    const { data: existing } = await supabase
      .from("webshop_discounts")
      .select("id")
      .eq("organization_id", profile.organization_id)
      .eq("code", code.toUpperCase())
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "Discount code already exists" },
        { status: 400 }
      );
    }

    // Create discount
    const { data: discount, error } = await supabase
      .from("webshop_discounts")
      .insert({
        organization_id: profile.organization_id,
        code: code.toUpperCase(),
        type,
        value: type === "freeShipping" ? 0 : value,
        min_amount: minAmount || 0,
        start_date: startDate,
        end_date: endDate || null,
        usage_limit: usageLimit || null,
        usage_count: 0,
        conditions: conditions || [],
        categories: categories || [],
        products: products || [],
        customer_types: customerTypes || [],
        active: true,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ discount }, { status: 201 });
  } catch (error: any) {
    console.error("Create discount error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create discount" },
      { status: 500 }
    );
  }
}
