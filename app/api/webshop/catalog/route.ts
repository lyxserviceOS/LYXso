import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getVisibleProductsForUser } from "@/lib/services/visibility-evaluation-service";

/**
 * GET /api/webshop/catalog - Public catalog endpoint
 * 
 * Returns products visible to the current user based on visibility rules.
 * This is the endpoint customers use to browse products.
 * 
 * Query params:
 * - category: Filter by category
 * - search: Search in name/description
 * - include_partner: Include partner products (default: true)
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 20)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get authenticated user (can be null for public access in future)
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const include_partner = searchParams.get("include_partner") !== "false"; // Default true
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Get visible products using the evaluation service
    const products = await getVisibleProductsForUser(supabase, user.id, {
      category: category || undefined,
      search: search || undefined,
      is_active: true, // Only show active products
      include_partner_products: include_partner,
    });

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = products.slice(startIndex, endIndex);

    // Calculate pagination info
    const totalProducts = products.length;
    const totalPages = Math.ceil(totalProducts / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      products: paginatedProducts,
      pagination: {
        page,
        limit,
        total: totalProducts,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
      filters_applied: {
        category: category || null,
        search: search || null,
        include_partner,
      },
    }, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/webshop/catalog error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
