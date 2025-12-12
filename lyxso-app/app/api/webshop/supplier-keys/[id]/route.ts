import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// PATCH /api/webshop/supplier-keys/[id] - Update supplier key
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

    const { data: supplierKey, error } = await supabase
      .from("webshop_supplier_keys")
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("org_id", profile.org_id)
      .select()
      .single();

    if (error) {
      console.error("Error updating supplier key:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ supplierKey }, { status: 200 });
  } catch (error: any) {
    console.error("PATCH /api/webshop/supplier-keys/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/webshop/supplier-keys/[id]
export async function DELETE(request: NextRequest, context: any) {
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

    const { error } = await supabase
      .from("webshop_supplier_keys")
      .delete()
      .eq("id", id)
      .eq("org_id", profile.org_id);

    if (error) {
      console.error("Error deleting supplier key:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Supplier key deleted" }, { status: 200 });
  } catch (error: any) {
    console.error("DELETE /api/webshop/supplier-keys/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
