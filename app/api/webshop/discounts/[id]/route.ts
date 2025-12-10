import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * PATCH /api/webshop/discounts/[id]
 * Update discount code
 * MIGRATED for Next.js 15
 */
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();

    // Check auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Update discount
    const { data: discount, error } = await supabase
      .from("webshop_discounts")
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ discount });
  } catch (error: any) {
    console.error("Update discount error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update discount" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/webshop/discounts/[id]
 * Delete discount code
 * MIGRATED for Next.js 15
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();

    // Check auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete discount
    const { error } = await supabase
      .from("webshop_discounts")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete discount error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete discount" },
      { status: 500 }
    );
  }
}
