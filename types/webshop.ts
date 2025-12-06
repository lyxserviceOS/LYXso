// ============================================================================
// WEBSHOP TYPES
// ============================================================================

export interface WebshopProduct {
  id: string;
  org_id: string;
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  price: number;
  compare_at_price?: number;
  cost_price?: number;
  sku?: string;
  barcode?: string;
  track_inventory: boolean;
  quantity: number;
  low_stock_threshold: number;
  allow_backorder: boolean;
  category?: string;
  tags?: string[];
  images: ProductImage[];
  specifications?: Record<string, any>;
  variants?: ProductVariant[];
  meta_title?: string;
  meta_description?: string;
  is_active: boolean;
  is_featured: boolean;
  requires_shipping: boolean;
  taxable: boolean;
  views_count: number;
  orders_count: number;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  url: string;
  alt?: string;
  position?: number;
}

export interface ProductVariant {
  name: string;
  options: string[];
  price_modifier?: number;
}

export interface WebshopPartnerProduct {
  id: string;
  org_id: string;
  partner_id: string;
  partner_product_id: string;
  name: string;
  description?: string;
  category?: string;
  partner_price: number;
  availability: 'in_stock' | 'out_of_stock' | 'on_order';
  image_url?: string;
  your_price: number;
  markup_percentage?: number;
  is_active: boolean;
  display_partner_logo: boolean;
  last_synced_at?: string;
  sync_data?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface WebshopCategory {
  id: string;
  org_id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface WebshopOrder {
  id: string;
  org_id: string;
  order_number: string;
  customer_id?: string;
  customer_email: string;
  customer_name: string;
  customer_phone?: string;
  billing_address: string;
  billing_city: string;
  billing_postal_code: string;
  billing_country: string;
  shipping_same_as_billing: boolean;
  shipping_address?: string;
  shipping_city?: string;
  shipping_postal_code?: string;
  shipping_country?: string;
  items: OrderItem[];
  subtotal: number;
  shipping_cost: number;
  tax_amount: number;
  discount_amount: number;
  total: number;
  shipping_method?: 'pickup' | 'delivery';
  shipping_tracking_number?: string;
  payment_method: 'card' | 'vipps' | 'invoice' | 'cash';
  payment_status: 'pending' | 'paid' | 'refunded' | 'failed';
  paid_at?: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  fulfillment_status: 'unfulfilled' | 'fulfilled' | 'partially_fulfilled';
  customer_note?: string;
  internal_note?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  cancelled_at?: string;
}

export interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  sku?: string;
  image_url?: string;
  is_partner_product?: boolean;
  partner_id?: string;
}

export interface WebshopSettings {
  org_id: string;
  show_in_menu: boolean;
  show_partner_logos: boolean;
  featured_categories?: string[];
  default_markup_percentage: number;
  show_compare_prices: boolean;
  currency: string;
  allow_pickup: boolean;
  allow_shipping: boolean;
  shipping_cost: number;
  free_shipping_threshold: number;
  require_account: boolean;
  allow_guest_checkout: boolean;
  tax_percentage: number;
  tax_included_in_price: boolean;
  notify_on_new_order: boolean;
  notification_email?: string;
  terms_url?: string;
  privacy_url?: string;
  updated_at: string;
}

// ============================================================================
// SUPPLIER/PARTNER API KEYS
// ============================================================================

export interface WebshopSupplierKey {
  id: string;
  org_id: string;
  supplier_name: string;
  api_key: string;
  api_secret?: string;
  api_endpoint?: string;
  is_active: boolean;
  sync_enabled: boolean;
  sync_frequency: 'hourly' | 'daily' | 'weekly';
  last_sync_at?: string;
  last_sync_status?: string;
  sync_categories?: string[];
  min_price?: number;
  max_price?: number;
  created_at: string;
  updated_at: string;
}

export interface WebshopVisibilityRule {
  id: string;
  org_id: string;
  rule_name: string;
  rule_type: 'show_category' | 'hide_category' | 'show_supplier' | 'hide_supplier' | 'price_range';
  applies_to: string[];
  condition_value?: Record<string, any>;
  priority: number;
  is_active: boolean;
  created_at: string;
}

// ============================================================================
// CART
// ============================================================================

export interface CartItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
  is_partner_product?: boolean;
  partner_id?: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping_cost: number;
  tax_amount: number;
  total: number;
}

// ============================================================================
// PARTNER DEFINITIONS (for reference)
// ============================================================================

export const SUPPLIER_DEFINITIONS = [
  {
    id: 'mekonomen',
    name: 'Mekonomen',
    description: 'Nordisk ledende bildelskjede',
    api_docs_url: 'https://api.mekonomen.com/docs',
    categories: ['dekk', 'felger', 'bilpleie', 'tilbehor'],
  },
  {
    id: 'gs_bildeler',
    name: 'GS Bildeler',
    description: 'Norges største bildelskjede',
    api_docs_url: 'https://api.gs.no/docs',
    categories: ['dekk', 'felger', 'verksted', 'vedlikehold'],
  },
  {
    id: 'bildeler_no',
    name: 'Bildeler.no',
    description: 'Online bildelsbutikk',
    api_docs_url: 'https://api.bildeler.no/docs',
    categories: ['dekk', 'felger', 'bilpleie', 'verksted'],
  },
  {
    id: 'bilia',
    name: 'Bilia',
    description: 'Nordeuropas største bilkonsern',
    api_docs_url: 'https://api.bilia.com/docs',
    categories: ['dekk', 'felger', 'originaldeler'],
  },
  {
    id: 'dekkmann',
    name: 'Dekkmann',
    description: 'Norges største dekkjedekjede',
    api_docs_url: 'https://api.dekkmann.no/docs',
    categories: ['dekk', 'felger'],
  },
] as const;

export type SupplierId = typeof SUPPLIER_DEFINITIONS[number]['id'];
