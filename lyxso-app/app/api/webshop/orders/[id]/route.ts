import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// PATCH /api/webshop/orders/[id] - Update order (admin only)
export async function PATCH(request: NextRequest, context: any) {
  try {
    const params = await context?.params;
    if (!params || !params.id) {
      return NextResponse.json(
        { error: "Missing id in route params" },
        { status: 400 }
      );
    }
    const { id } = params as { id: string };
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

    const { data: order, error } = await supabase
      .from("webshop_orders")
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("org_id", profile.org_id)
      .select()
      .single();

    if (error) {
      console.error("Error updating order:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ order }, { status: 200 });
  } catch (error: any) {
    console.error("PATCH /api/webshop/orders/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
