// ============================================================================
// SUPPLIER ADAPTERS - Export all adapters
// ============================================================================

import { MekonomenAdapter } from './mekonomen-adapter';
import type { SupplierAdapter } from './base-adapter';

/**
 * Get adapter instance for a supplier
 */
export function getSupplierAdapter(supplierName: string): SupplierAdapter | null {
  const normalized = supplierName.toLowerCase();
  
  switch (normalized) {
    case 'mekonomen':
      return new MekonomenAdapter();
    
    // TODO: Implement other adapters
    // case 'gs_bildeler':
    //   return new GSBildelerAdapter();
    // case 'bildeler_no':
    //   return new BildelerNoAdapter();
    // case 'bilia':
    //   return new BiliaAdapter();
    // case 'dekkmann':
    //   return new DekkmannAdapter();
    
    default:
      console.error(`No adapter found for supplier: ${supplierName}`);
      return null;
  }
}

/**
 * Check if adapter exists for supplier
 */
export function hasSupplierAdapter(supplierName: string): boolean {
  return getSupplierAdapter(supplierName) !== null;
}

// Re-export types
export * from './base-adapter';
