import { NextRequest, NextResponse } from "next/server";
import { SupplierSyncService } from "@/lib/services/supplier-sync-service";

/**
 * Cron Job Endpoint for Automatic Supplier Syncing
 * 
 * This endpoint should be called periodically by a cron service (e.g., Vercel Cron, GitHub Actions, external cron service)
 * 
 * Setup for Vercel Cron (add to vercel.json):
 * {
 *   "crons": [{
 *     "path": "/api/webshop/cron/sync-suppliers",
 *     "schedule": "0 * * * *"  // Every hour
 *   }]
 * }
 * 
 * Security: Add CRON_SECRET to env and verify it in production
 */
export async function POST(request: NextRequest) {
  try {
    // Security: Verify cron secret in production
    const cronSecret = request.headers.get('x-cron-secret');
    if (process.env.NODE_ENV === 'production' && cronSecret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log('[Cron] Starting automatic supplier sync...');

    // Get all suppliers that are due for sync
    const supplierIds = await SupplierSyncService.getSuppliersDueForSync();

    if (supplierIds.length === 0) {
      console.log('[Cron] No suppliers due for sync');
      return NextResponse.json({ 
        success: true, 
        message: 'No suppliers due for sync',
        synced: 0,
      }, { status: 200 });
    }

    console.log(`[Cron] Found ${supplierIds.length} suppliers due for sync`);

    // Sync each supplier
    const results = [];
    for (const supplierId of supplierIds) {
      const result = await SupplierSyncService.syncSupplier(supplierId);
      results.push({
        supplierId,
        success: result.success,
        productsImported: result.productsImported,
        errors: result.errors,
      });
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.length - successCount;

    console.log(`[Cron] Completed: ${successCount} success, ${failCount} failed`);

    return NextResponse.json({
      success: true,
      message: `Synced ${successCount}/${results.length} suppliers`,
      synced: successCount,
      failed: failCount,
      results,
    }, { status: 200 });
  } catch (error: any) {
    console.error('[Cron] Sync failed:', error);
    return NextResponse.json({ 
      error: error.message,
      success: false,
    }, { status: 500 });
  }
}

// Allow GET for testing (remove in production)
export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }
  
  return POST(request);
}
