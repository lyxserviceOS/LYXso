// ============================================================================
// BASE SUPPLIER ADAPTER - Interface for all supplier integrations
// ============================================================================

export interface SupplierProduct {
  supplier_product_id: string;
  name: string;
  description?: string;
  category: string;
  price: number; // Leverandørens pris
  availability: 'in_stock' | 'out_of_stock' | 'on_order';
  image_url?: string;
  specifications?: Record<string, any>;
  sku?: string;
  barcode?: string;
}

export interface SyncConfig {
  apiKey: string;
  apiSecret?: string;
  apiEndpoint?: string;
  categories?: string[]; // Filter: kun disse kategoriene
  minPrice?: number; // Filter: minimum pris
  maxPrice?: number; // Filter: maximum pris
}

export interface SyncResult {
  success: boolean;
  productsFound: number;
  productsImported: number;
  productsFailed: number;
  errors: string[];
  timestamp: Date;
}

export interface AvailabilityCheck {
  available: boolean;
  quantity?: number;
  delivery_time?: string; // e.g. "2-5 dager"
}

/**
 * Base adapter interface that all supplier integrations must implement
 */
export interface SupplierAdapter {
  /**
   * Test if API connection is working
   */
  testConnection(config: SyncConfig): Promise<boolean>;

  /**
   * Fetch all products from supplier with filters
   */
  fetchProducts(config: SyncConfig): Promise<SupplierProduct[]>;

  /**
   * Fetch single product by supplier product ID
   */
  fetchProduct(productId: string, config: SyncConfig): Promise<SupplierProduct | null>;

  /**
   * Check real-time availability of a product
   */
  checkAvailability(productId: string, config: SyncConfig): Promise<AvailabilityCheck>;
}

/**
 * Base adapter class with common functionality
 */
export abstract class BaseSupplierAdapter implements SupplierAdapter {
  protected supplierName: string;

  constructor(supplierName: string) {
    this.supplierName = supplierName;
  }

  abstract testConnection(config: SyncConfig): Promise<boolean>;
  abstract fetchProducts(config: SyncConfig): Promise<SupplierProduct[]>;
  abstract fetchProduct(productId: string, config: SyncConfig): Promise<SupplierProduct | null>;
  abstract checkAvailability(productId: string, config: SyncConfig): Promise<AvailabilityCheck>;

  /**
   * Helper: Filter products by category
   */
  protected filterByCategories(products: SupplierProduct[], categories?: string[]): SupplierProduct[] {
    if (!categories || categories.length === 0) {
      return products;
    }
    return products.filter(p => categories.includes(p.category.toLowerCase()));
  }

  /**
   * Helper: Filter products by price range
   */
  protected filterByPriceRange(
    products: SupplierProduct[],
    minPrice?: number,
    maxPrice?: number
  ): SupplierProduct[] {
    return products.filter(p => {
      if (minPrice !== undefined && p.price < minPrice) return false;
      if (maxPrice !== undefined && p.price > maxPrice) return false;
      return true;
    });
  }

  /**
   * Helper: Apply all filters
   */
  protected applyFilters(
    products: SupplierProduct[],
    config: SyncConfig
  ): SupplierProduct[] {
    let filtered = products;
    filtered = this.filterByCategories(filtered, config.categories);
    filtered = this.filterByPriceRange(filtered, config.minPrice, config.maxPrice);
    return filtered;
  }

  /**
   * Helper: Make HTTP request with error handling
   */
  protected async makeRequest<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error(`[${this.supplierName}] Request failed:`, error);
      throw new Error(`Failed to fetch from ${this.supplierName}: ${error.message}`);
    }
  }
}
