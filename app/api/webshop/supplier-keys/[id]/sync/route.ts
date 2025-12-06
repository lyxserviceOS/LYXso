import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { SupplierSyncService } from "@/lib/services/supplier-sync-service";

// POST /api/webshop/supplier-keys/[id]/sync - Trigger manual sync
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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

    // Only admin/owner can trigger sync
    if (!profile?.org_id || !["admin", "owner"].includes(profile.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const supplierKeyId = params.id;

    // Verify supplier key belongs to user's org
    const { data: supplierKey, error: keyError } = await supabase
      .from("webshop_supplier_keys")
      .select("id, org_id")
      .eq("id", supplierKeyId)
      .single();

    if (keyError || !supplierKey) {
      return NextResponse.json({ error: "Supplier key not found" }, { status: 404 });
    }

    if (supplierKey.org_id !== profile.org_id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Trigger sync
    console.log(`[API] Starting manual sync for supplier key: ${supplierKeyId}`);
    const result = await SupplierSyncService.syncSupplier(supplierKeyId);

    if (result.success) {
      return NextResponse.json({
        success: true,
        result: {
          productsFound: result.productsFound,
          productsImported: result.productsImported,
          productsFailed: result.productsFailed,
          errors: result.errors,
        },
      }, { status: 200 });
    } else {
      return NextResponse.json({
        success: false,
        result: {
          productsFound: result.productsFound,
          productsImported: result.productsImported,
          productsFailed: result.productsFailed,
          errors: result.errors,
        },
      }, { status: 400 });
    }
  } catch (error: any) {
    console.error("POST /api/webshop/supplier-keys/[id]/sync error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
