import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  getUserContext,
  evaluateVisibilityRules,
  applyProductFilter,
} from "@/lib/services/visibility-evaluation-service";

// GET /api/webshop/products - List all products with visibility rules applied
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's org_id and profile
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("org_id, role")
      .eq("id", user.id)
      .single();

    if (!profile?.org_id) {
      return NextResponse.json({ error: "No organization found" }, { status: 404 });
    }

    const org_id = profile.org_id;

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const is_active = searchParams.get("is_active");
    const search = searchParams.get("search");
    const include_partner = searchParams.get("include_partner") === "true";
    const skip_visibility = searchParams.get("skip_visibility") === "true"; // Admin bypass

    // Check if user is admin/owner (can bypass visibility rules)
    const isAdmin = ["admin", "owner"].includes(profile.role);
    const shouldApplyVisibility = !isAdmin || !skip_visibility;

    let productFilter = null;

    // Apply visibility rules for non-admin or if not explicitly skipped
    if (shouldApplyVisibility) {
      // Get user context
      const userContext = await getUserContext(supabase, user.id);
      
      if (userContext) {
        // Evaluate visibility rules
        productFilter = await evaluateVisibilityRules(supabase, userContext);
      }
    }

    // Build query for own products
    let query = supabase
      .from("webshop_products")
      .select("*")
      .eq("org_id", org_id)
      .order("created_at", { ascending: false });

    // Apply visibility filter
    if (productFilter) {
      query = applyProductFilter(query, productFilter);
    }

    // Apply additional filters
    if (category) {
      query = query.eq("category", category);
    }

    if (is_active !== null) {
      query = query.eq("is_active", is_active === "true");
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data: ownProducts, error } = await query;

    if (error) {
      console.error("Error fetching products:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    let allProducts = ownProducts || [];

    // Fetch partner products if requested
    if (include_partner && (productFilter?.include_partner_products !== false)) {
      let partnerQuery = supabase
        .from("webshop_partner_products")
        .select("*")
        .eq("org_id", org_id)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      // Apply visibility filter to partner products
      if (productFilter) {
        partnerQuery = applyProductFilter(partnerQuery, productFilter);
      }

      // Apply additional filters
      if (category) {
        partnerQuery = partnerQuery.eq("category", category);
      }

      if (search) {
        partnerQuery = partnerQuery.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
      }

      const { data: partnerProducts, error: partnerError } = await partnerQuery;

      if (!partnerError && partnerProducts) {
        // Mark partner products
        const markedPartnerProducts = partnerProducts.map((p) => ({
          ...p,
          product_source: "partner",
        }));
        allProducts = [
          ...allProducts.map((p) => ({ ...p, product_source: "own" })),
          ...markedPartnerProducts,
        ];
      }
    } else {
      // Mark own products
      allProducts = allProducts.map((p) => ({ ...p, product_source: "own" }));
    }

    return NextResponse.json({
      products: allProducts,
      applied_filter: productFilter ? true : false,
      is_admin: isAdmin,
    }, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/webshop/products error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/webshop/products - Create new product
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin/owner
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("org_id, role")
      .eq("id", user.id)
      .single();

    if (!profile?.org_id || !["admin", "owner"].includes(profile.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const {
      name,
      slug,
      description,
      short_description,
      price,
      compare_at_price,
      cost_price,
      sku,
      barcode,
      track_inventory,
      quantity,
      low_stock_threshold,
      allow_backorder,
      category,
      tags,
      images,
      specifications,
      variants,
      meta_title,
      meta_description,
      is_active,
      is_featured,
      requires_shipping,
      taxable,
    } = body;

    // Validate required fields
    if (!name || !slug || price === undefined) {
      return NextResponse.json(
        { error: "Name, slug, and price are required" },
        { status: 400 }
      );
    }

    // Check if slug already exists for this org
    const { data: existing } = await supabase
      .from("webshop_products")
      .select("id")
      .eq("org_id", profile.org_id)
      .eq("slug", slug)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "Product with this slug already exists" },
        { status: 409 }
      );
    }

    // Insert product
    const { data: product, error } = await supabase
      .from("webshop_products")
      .insert({
        org_id: profile.org_id,
        name,
        slug,
        description,
        short_description,
        price,
        compare_at_price,
        cost_price,
        sku,
        barcode,
        track_inventory: track_inventory ?? true,
        quantity: quantity ?? 0,
        low_stock_threshold: low_stock_threshold ?? 5,
        allow_backorder: allow_backorder ?? false,
        category,
        tags,
        images: images ?? [],
        specifications,
        variants,
        meta_title,
        meta_description,
        is_active: is_active ?? true,
        is_featured: is_featured ?? false,
        requires_shipping: requires_shipping ?? true,
        taxable: taxable ?? true,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating product:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ product }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/webshop/products error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
