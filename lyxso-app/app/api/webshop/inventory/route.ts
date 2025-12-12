import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/webshop/inventory
 * Get inventory status for all products
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

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter");

    // Get products with inventory info
    let query = supabase
      .from("webshop_products")
      .select("*")
      .eq("organization_id", profile.organization_id)
      .order("name");

    // Apply filters
    if (filter === "low") {
      // Products with low stock (below reorder point)
      query = query.lte("stock_quantity", 10).gt("stock_quantity", 0);
    } else if (filter === "out") {
      // Out of stock
      query = query.eq("stock_quantity", 0);
    }

    const { data: products, error } = await query;

    if (error) throw error;

    // Transform to inventory items
    const items = (products || []).map((p) => ({
      id: p.id,
      name: p.name,
      sku: p.sku || `SKU-${p.id.substring(0, 8)}`,
      stock: p.stock_quantity || 0,
      reserved: 0, // TODO: Calculate from active orders
      reorderPoint: 10, // TODO: Make configurable per product
      reorderQuantity: 20, // TODO: Make configurable per product
      location: p.location || null,
      lastUpdated: p.updated_at || p.created_at,
    }));

    return NextResponse.json({ items });
  } catch (error: any) {
    console.error("Get inventory error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch inventory" },
      { status: 500 }
    );
  }
}
