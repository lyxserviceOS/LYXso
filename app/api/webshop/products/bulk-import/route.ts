import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/webshop/products/bulk-import
 * Bulk import products from CSV/Excel/JSON
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

    // Get form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const format = formData.get("format") as string;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Read file content
    const content = await file.text();
    
    let products: any[] = [];
    const errors: string[] = [];

    // Parse based on format
    if (format === "csv") {
      const lines = content.split("\n");
      const headers = lines[0].split(",").map((h) => h.trim());

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;

        const values = lines[i].split(",");
        const product: any = {};

        headers.forEach((header, idx) => {
          product[header] = values[idx]?.trim();
        });

        // Validate required fields
        if (!product.name || !product.price) {
          errors.push(`Line ${i + 1}: Missing required fields`);
          continue;
        }

        // Convert types
        product.price = parseFloat(product.price);
        product.stock_quantity = parseInt(product.stock || "0");
        product.tags = product.tags ? product.tags.split(";") : [];

        products.push(product);
      }
    } else if (format === "json") {
      try {
        const parsed = JSON.parse(content);
        products = Array.isArray(parsed) ? parsed : [parsed];
      } catch (e) {
        return NextResponse.json(
          { error: "Invalid JSON format" },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "Unsupported format" },
        { status: 400 }
      );
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

    // Insert products
    let imported = 0;
    for (const product of products) {
      try {
        const { error: insertError } = await supabase
          .from("webshop_products")
          .insert({
            organization_id: profile.organization_id,
            name: product.name,
            description: product.description || "",
            price: product.price,
            category: product.category || "annet",
            supplier: product.supplier || "Own",
            stock_quantity: product.stock_quantity || 0,
            tags: product.tags || [],
            sku: product.sku,
            image_url: product.image_url,
            is_published: true,
          });

        if (insertError) {
          errors.push(`${product.name}: ${insertError.message}`);
        } else {
          imported++;
        }
      } catch (e: any) {
        errors.push(`${product.name}: ${e.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      imported,
      total: products.length,
      errors,
    });
  } catch (error: any) {
    console.error("Bulk import error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to import products" },
      { status: 500 }
    );
  }
}
