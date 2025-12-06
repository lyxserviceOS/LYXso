// ============================================================================
// MEKONOMEN SUPPLIER ADAPTER
// ============================================================================

import {
  BaseSupplierAdapter,
  type SupplierProduct,
  type SyncConfig,
  type AvailabilityCheck,
} from './base-adapter';

/**
 * Mekonomen API adapter
 * 
 * NOTE: This is a mock implementation since we don't have actual Mekonomen API docs.
 * Replace with real API calls when you have access to their API documentation.
 * 
 * Real API endpoint would be something like: https://api.mekonomen.com/v1/products
 */
export class MekonomenAdapter extends BaseSupplierAdapter {
  constructor() {
    super('Mekonomen');
  }

  /**
   * Test API connection
   */
  async testConnection(config: SyncConfig): Promise<boolean> {
    try {
      // Mock: In real implementation, call: GET /health or /auth/validate
      // For now, just validate that we have required credentials
      if (!config.apiKey) {
        return false;
      }

      // Simulate API call
      // const endpoint = config.apiEndpoint || 'https://api.mekonomen.com/v1';
      // const response = await this.makeRequest(`${endpoint}/health`, {
      //   headers: {
      //     'Authorization': `Bearer ${config.apiKey}`,
      //   },
      // });

      // Mock success if API key looks valid (length check)
      return config.apiKey.length >= 20;
    } catch (error) {
      console.error('[Mekonomen] Connection test failed:', error);
      return false;
    }
  }

  /**
   * Fetch all products with filters
   */
  async fetchProducts(config: SyncConfig): Promise<SupplierProduct[]> {
    try {
      // Mock: In real implementation:
      // const endpoint = config.apiEndpoint || 'https://api.mekonomen.com/v1';
      // const response = await this.makeRequest<{products: any[]}>(`${endpoint}/products`, {
      //   headers: {
      //     'Authorization': `Bearer ${config.apiKey}`,
      //   },
      // });
      // const products = response.products.map(this.transformProduct);

      // Mock data for testing
      const mockProducts: SupplierProduct[] = [
        {
          supplier_product_id: 'MK-DEKK-001',
          name: 'Michelin Pilot Sport 4 225/45R17',
          description: 'Premium sommerdekk med utmerket grep og langvarig slitestyrke',
          category: 'dekk',
          price: 1299,
          availability: 'in_stock',
          image_url: 'https://example.com/michelin-ps4.jpg',
          specifications: {
            brand: 'Michelin',
            model: 'Pilot Sport 4',
            size: '225/45R17',
            season: 'summer',
            speed_rating: 'Y',
            load_index: '94',
          },
          sku: 'MK-DEKK-001',
          barcode: '3528700570625',
        },
        {
          supplier_product_id: 'MK-DEKK-002',
          name: 'Nokian Hakkapeliitta R3 205/55R16',
          description: 'Nordisk vinterdekk uten pigger for maksimal sikkerhet',
          category: 'dekk',
          price: 1499,
          availability: 'in_stock',
          image_url: 'https://example.com/nokian-hakka.jpg',
          specifications: {
            brand: 'Nokian',
            model: 'Hakkapeliitta R3',
            size: '205/55R16',
            season: 'winter',
            studded: false,
          },
          sku: 'MK-DEKK-002',
        },
        {
          supplier_product_id: 'MK-FELG-001',
          name: 'Aluminiumfelg 17" 5x114.3',
          description: 'Lettmetallfelg med flott design',
          category: 'felger',
          price: 899,
          availability: 'in_stock',
          image_url: 'https://example.com/alu-wheel.jpg',
          specifications: {
            diameter: '17"',
            bolt_pattern: '5x114.3',
            offset: 'ET45',
            center_bore: '64.1mm',
          },
          sku: 'MK-FELG-001',
        },
        {
          supplier_product_id: 'MK-BILPLEIE-001',
          name: 'Meguiars Ultimate Wash & Wax',
          description: 'Premium bilshampoo med voksbeskyttelse',
          category: 'bilpleie',
          price: 249,
          availability: 'in_stock',
          image_url: 'https://example.com/meguiars-wash.jpg',
          specifications: {
            brand: 'Meguiars',
            volume: '473ml',
            type: 'wash_and_wax',
          },
          sku: 'MK-BILPLEIE-001',
        },
        {
          supplier_product_id: 'MK-TILBEHOR-001',
          name: 'Thule Takboks Excellence XT',
          description: 'Premium takboks med stor kapasitet',
          category: 'tilbehør',
          price: 6999,
          availability: 'on_order',
          image_url: 'https://example.com/thule-box.jpg',
          specifications: {
            brand: 'Thule',
            capacity: '470L',
            length: '215cm',
            color: 'black',
          },
          sku: 'MK-TILBEHOR-001',
        },
      ];

      // Apply filters
      const filtered = this.applyFilters(mockProducts, config);

      return filtered;
    } catch (error: any) {
      console.error('[Mekonomen] Failed to fetch products:', error);
      throw error;
    }
  }

  /**
   * Fetch single product
   */
  async fetchProduct(productId: string, config: SyncConfig): Promise<SupplierProduct | null> {
    try {
      // Mock: In real implementation:
      // const endpoint = config.apiEndpoint || 'https://api.mekonomen.com/v1';
      // const response = await this.makeRequest<any>(`${endpoint}/products/${productId}`, {
      //   headers: {
      //     'Authorization': `Bearer ${config.apiKey}`,
      //   },
      // });
      // return this.transformProduct(response);

      // Mock: Fetch all and find by ID
      const products = await this.fetchProducts(config);
      return products.find(p => p.supplier_product_id === productId) || null;
    } catch (error) {
      console.error('[Mekonomen] Failed to fetch product:', error);
      return null;
    }
  }

  /**
   * Check product availability
   */
  async checkAvailability(productId: string, config: SyncConfig): Promise<AvailabilityCheck> {
    try {
      // Mock: In real implementation:
      // const endpoint = config.apiEndpoint || 'https://api.mekonomen.com/v1';
      // const response = await this.makeRequest<any>(`${endpoint}/products/${productId}/availability`, {
      //   headers: {
      //     'Authorization': `Bearer ${config.apiKey}`,
      //   },
      // });
      // return {
      //   available: response.in_stock,
      //   quantity: response.quantity,
      //   delivery_time: response.delivery_time,
      // };

      // Mock data
      return {
        available: true,
        quantity: 15,
        delivery_time: '1-2 dager',
      };
    } catch (error) {
      console.error('[Mekonomen] Failed to check availability:', error);
      return {
        available: false,
      };
    }
  }
}
