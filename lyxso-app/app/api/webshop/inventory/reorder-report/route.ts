import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/webshop/inventory/reorder-report
 * Generate reorder report for products below reorder point
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

    // Get products with low stock
    const { data: products, error } = await supabase
      .from("webshop_products")
      .select("*")
      .eq("organization_id", profile.organization_id)
      .lte("stock_quantity", 10)
      .order("stock_quantity");

    if (error) throw error;

    // Generate report
    const items = (products || []).map((p) => ({
      id: p.id,
      name: p.name,
      sku: p.sku || `SKU-${p.id.substring(0, 8)}`,
      currentStock: p.stock_quantity || 0,
      reorderPoint: 10,
      recommendedOrder: 20,
      supplier: p.supplier || "Unknown",
      category: p.category,
      estimatedCost: (p.cost_price || p.price * 0.6) * 20, // Estimate if cost not set
    }));

    return NextResponse.json({
      generatedAt: new Date().toISOString(),
      totalItems: items.length,
      totalEstimatedCost: items.reduce((sum, i) => sum + i.estimatedCost, 0),
      items,
    });
  } catch (error: any) {
    console.error("Generate reorder report error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate report" },
      { status: 500 }
    );
  }
}
