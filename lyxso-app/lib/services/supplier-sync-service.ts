// ============================================================================
// SUPPLIER SYNC SERVICE
// Handles synchronization of products from suppliers to webshop_partner_products
// ============================================================================

import { createClient } from '@/lib/supabase/server';
import { getSupplierAdapter, type SyncConfig, type SyncResult } from './suppliers';

interface SupplierKey {
  id: string;
  org_id: string;
  supplier_name: string;
  api_key: string;
  api_secret?: string;
  api_endpoint?: string;
  sync_enabled: boolean;
  sync_categories?: string[];
  min_price?: number;
  max_price?: number;
  markup_percentage: number;
}

interface SyncOptions {
  forceSync?: boolean; // Ignore last_sync_at and force sync
}

/**
 * Supplier Sync Service
 * Orchestrates product synchronization from suppliers to database
 */
export class SupplierSyncService {
  /**
   * Sync products from a specific supplier
   */
  static async syncSupplier(
    supplierKeyId: string,
    options: SyncOptions = {}
  ): Promise<SyncResult> {
    const result: SyncResult = {
      success: false,
      productsFound: 0,
      productsImported: 0,
      productsFailed: 0,
      errors: [],
      timestamp: new Date(),
    };

    try {
      const supabase = await createClient();

      // 1. Fetch supplier key from database
      const { data: supplierKey, error: keyError } = await supabase
        .from('webshop_supplier_keys')
        .select('*')
        .eq('id', supplierKeyId)
        .single();

      if (keyError || !supplierKey) {
        result.errors.push('Supplier key not found');
        return result;
      }

      if (!supplierKey.sync_enabled) {
        result.errors.push('Sync is disabled for this supplier');
        return result;
      }

      // 2. Get appropriate adapter
      const adapter = getSupplierAdapter(supplierKey.supplier_name);
      if (!adapter) {
        result.errors.push(`No adapter available for ${supplierKey.supplier_name}`);
        return result;
      }

      // 3. Build sync config
      const syncConfig: SyncConfig = {
        apiKey: supplierKey.api_key,
        apiSecret: supplierKey.api_secret,
        apiEndpoint: supplierKey.api_endpoint,
        categories: supplierKey.sync_categories,
        minPrice: supplierKey.min_price,
        maxPrice: supplierKey.max_price,
      };

      // 4. Test connection first
      const connectionOk = await adapter.testConnection(syncConfig);
      if (!connectionOk) {
        result.errors.push('Connection test failed');
        await this.updateSyncStatus(supplierKeyId, 'failed', 'Connection test failed');
        return result;
      }

      // 5. Fetch products from supplier
      console.log(`[Sync] Fetching products from ${supplierKey.supplier_name}...`);
      const products = await adapter.fetchProducts(syncConfig);
      result.productsFound = products.length;

      if (products.length === 0) {
        console.log(`[Sync] No products found for ${supplierKey.supplier_name}`);
        result.success = true;
        await this.updateSyncStatus(supplierKeyId, 'success', 'No products found');
        return result;
      }

      // 6. Import products to database
      console.log(`[Sync] Importing ${products.length} products...`);
      for (const product of products) {
        try {
          // Calculate markup price
          const markupMultiplier = 1 + (supplierKey.markup_percentage || 20) / 100;
          const yourPrice = Math.round(product.price * markupMultiplier);

          // Upsert product (insert or update)
          const { error: upsertError } = await supabase
            .from('webshop_partner_products')
            .upsert({
              org_id: supplierKey.org_id,
              partner_id: supplierKey.supplier_name,
              partner_product_id: product.supplier_product_id,
              name: product.name,
              description: product.description,
              category: product.category,
              partner_price: product.price,
              availability: product.availability,
              image_url: product.image_url,
              your_price: yourPrice,
              markup_percentage: supplierKey.markup_percentage,
              is_active: true,
              display_partner_logo: true,
              last_synced_at: new Date().toISOString(),
              sync_data: {
                specifications: product.specifications,
                sku: product.sku,
                barcode: product.barcode,
              },
              updated_at: new Date().toISOString(),
            }, {
              onConflict: 'org_id,partner_id,partner_product_id',
              ignoreDuplicates: false,
            });

          if (upsertError) {
            console.error(`[Sync] Failed to import product ${product.supplier_product_id}:`, upsertError);
            result.productsFailed++;
            result.errors.push(`Failed to import ${product.name}: ${upsertError.message}`);
          } else {
            result.productsImported++;
          }
        } catch (error: any) {
          console.error(`[Sync] Error processing product ${product.supplier_product_id}:`, error);
          result.productsFailed++;
          result.errors.push(`Error processing ${product.name}: ${error.message}`);
        }
      }

      // 7. Update sync status
      const status = result.productsFailed === 0 ? 'success' : 'partial';
      const statusMessage = `Imported ${result.productsImported}/${result.productsFound} products`;
      await this.updateSyncStatus(supplierKeyId, status, statusMessage);

      result.success = result.productsImported > 0;
      console.log(`[Sync] Completed: ${statusMessage}`);

      return result;
    } catch (error: any) {
      console.error('[Sync] Sync failed:', error);
      result.errors.push(error.message);
      await this.updateSyncStatus(supplierKeyId, 'failed', error.message);
      return result;
    }
  }

  /**
   * Sync all active suppliers for an organization
   */
  static async syncAllActiveSuppliers(orgId: string): Promise<SyncResult[]> {
    try {
      const supabase = await createClient();

      // Get all active supplier keys for org
      const { data: supplierKeys, error } = await supabase
        .from('webshop_supplier_keys')
        .select('id')
        .eq('org_id', orgId)
        .eq('is_active', true)
        .eq('sync_enabled', true);

      if (error || !supplierKeys || supplierKeys.length === 0) {
        console.log('[Sync] No active suppliers found for org:', orgId);
        return [];
      }

      // Sync each supplier
      const results: SyncResult[] = [];
      for (const key of supplierKeys) {
        const result = await this.syncSupplier(key.id);
        results.push(result);
      }

      return results;
    } catch (error) {
      console.error('[Sync] Failed to sync all suppliers:', error);
      return [];
    }
  }

  /**
   * Update sync status in database
   */
  private static async updateSyncStatus(
    supplierKeyId: string,
    status: string,
    message?: string
  ): Promise<void> {
    try {
      const supabase = await createClient();
      await supabase
        .from('webshop_supplier_keys')
        .update({
          last_sync_at: new Date().toISOString(),
          last_sync_status: message || status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', supplierKeyId);
    } catch (error) {
      console.error('[Sync] Failed to update sync status:', error);
    }
  }

  /**
   * Check which suppliers need syncing based on frequency
   */
  static async getSuppliersDueForSync(): Promise<string[]> {
    try {
      const supabase = await createClient();
      const now = new Date();

      const { data: supplierKeys } = await supabase
        .from('webshop_supplier_keys')
        .select('id, sync_frequency, last_sync_at')
        .eq('is_active', true)
        .eq('sync_enabled', true);

      if (!supplierKeys) return [];

      const dueForSync: string[] = [];

      for (const key of supplierKeys) {
        if (!key.last_sync_at) {
          // Never synced, needs sync
          dueForSync.push(key.id);
          continue;
        }

        const lastSync = new Date(key.last_sync_at);
        const hoursSinceSync = (now.getTime() - lastSync.getTime()) / (1000 * 60 * 60);

        let shouldSync = false;
        switch (key.sync_frequency) {
          case 'hourly':
            shouldSync = hoursSinceSync >= 1;
            break;
          case 'daily':
            shouldSync = hoursSinceSync >= 24;
            break;
          case 'weekly':
            shouldSync = hoursSinceSync >= 168;
            break;
          case 'manual':
            // Manual sync only
            shouldSync = false;
            break;
        }

        if (shouldSync) {
          dueForSync.push(key.id);
        }
      }

      return dueForSync;
    } catch (error) {
      console.error('[Sync] Failed to check due suppliers:', error);
      return [];
    }
  }
}
