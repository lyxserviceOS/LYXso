import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/webshop/orders - List orders
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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let query = supabase
      .from("webshop_orders")
      .select("*")
      .eq("org_id", profile.org_id)
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data: orders, error } = await query;

    if (error) {
      console.error("Error fetching orders:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/webshop/orders error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/webshop/orders - Create new order (used by checkout)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const {
      org_id,
      customer_email,
      customer_name,
      customer_phone,
      billing_address,
      billing_city,
      billing_postal_code,
      billing_country,
      shipping_same_as_billing,
      shipping_address,
      shipping_city,
      shipping_postal_code,
      shipping_country,
      items,
      subtotal,
      shipping_cost,
      tax_amount,
      discount_amount,
      total,
      shipping_method,
      payment_method,
      customer_note,
    } = body;

    // Validate required fields
    if (!org_id || !customer_email || !customer_name || !billing_address || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    const { data: order, error } = await supabase
      .from("webshop_orders")
      .insert({
        org_id,
        order_number: orderNumber,
        customer_email,
        customer_name,
        customer_phone,
        billing_address,
        billing_city,
        billing_postal_code,
        billing_country: billing_country || 'NO',
        shipping_same_as_billing,
        shipping_address,
        shipping_city,
        shipping_postal_code,
        shipping_country,
        items,
        subtotal,
        shipping_cost: shipping_cost || 0,
        tax_amount: tax_amount || 0,
        discount_amount: discount_amount || 0,
        total,
        shipping_method,
        payment_method,
        customer_note,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating order:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // TODO: Send order confirmation email
    // TODO: Update product quantities

    return NextResponse.json({ order }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/webshop/orders error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
