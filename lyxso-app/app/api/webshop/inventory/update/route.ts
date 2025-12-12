import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * PUT /api/webshop/inventory/update
 * Update stock quantity for a product
 */
export async function PUT(request: NextRequest) {
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

    const body = await request.json();
    const { itemId, stock } = body;

    if (!itemId || stock === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Update stock
    const { data: product, error } = await supabase
      .from("webshop_products")
      .update({
        stock_quantity: stock,
        updated_at: new Date().toISOString(),
      })
      .eq("id", itemId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ product });
  } catch (error: any) {
    console.error("Update inventory error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update inventory" },
      { status: 500 }
    );
  }
}
