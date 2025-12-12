// types/product.ts

/**
 * Product owned by the organization (their own inventory).
 */
export interface Product {
  id: string;
  org_id: string;
  name: string;
  description: string | null;
  sku: string | null;
  price: number | null;
  cost: number | null;
  stock_quantity: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Product category for organizing products in the webshop.
 */
export type ProductCategory =
  | "dekk"           // Tyres
  | "felger"         // Rims
  | "bilpleie"       // Car care products
  | "tilbehor"       // Accessories
  | "verksted"       // Workshop parts
  | "vedlikehold"    // Maintenance products
  | "annet";         // Other

/**
 * Partner in LYXso ecosystem (Norges Dekk, Amring, Vianor, Veng, Bilextra, etc.)
 * These are wholesale partners that provide products to LYXso customers.
 */
export interface Partner {
  id: string;
  name: string;
  slug: string;
  
  // Partner type
  type: "dekk" | "bilpleie" | "verksted" | "generell";
  
  // Integration
  integration_type: "api" | "feed_csv" | "feed_xml" | "feed_json" | "manual";
  api_base_url: string | null;
  api_key_encrypted: string | null;
  feed_url: string | null;
  
  // Contact
  contact_email: string | null;
  contact_phone: string | null;
  website: string | null;
  
  // Branding
  logo_url: string | null;
  description: string | null;
  
  // Target industries
  target_industries: string[]; // Which industries should see this partner
  
  // Status
  is_active: boolean;
  is_verified: boolean;
  
  // Sync info
  last_sync_at: string | null;
  product_count: number;
  
  created_at: string;
  updated_at: string;
}

/**
 * Product from a partner's catalog.
 * These are imported from partners and can be activated per org.
 */
export interface PartnerProduct {
  id: string;
  partner_id: string;
  
  // Basic info
  name: string;
  description: string | null;
  sku: string | null;
  partner_sku: string | null; // SKU from partner's system
  
  // Categorization
  category: ProductCategory;
  brand: string | null;
  
  // Pricing from partner
  wholesale_price: number | null;
  recommended_retail_price: number | null;
  currency: string;
  
  // Stock info (from partner)
  in_stock: boolean;
  stock_quantity: number | null;
  lead_time_days: number | null;
  
  // For tyres
  tyre_width: number | null;
  tyre_profile: number | null;
  tyre_rim_size: number | null;
  tyre_season: "summer" | "winter" | "allseason" | null;
  tyre_brand: string | null;
  
  // Media
  image_url: string | null;
  images: string[];
  
  // Status
  is_active: boolean;
  
  // Sync
  partner_product_id: string | null; // ID from partner's system
  last_sync_at: string | null;
  
  created_at: string;
  updated_at: string;
}

/**
 * Activation of a partner product for a specific org.
 * Allows orgs to cherry-pick which partner products to show in their webshop.
 */
export interface OrgPartnerProduct {
  id: string;
  org_id: string;
  partner_product_id: string;
  
  // Custom pricing (override partner's recommended price)
  custom_price: number | null;
  
  // Custom markup percentage (applied to wholesale price)
  markup_percentage: number | null;
  
  // Display settings
  is_featured: boolean;
  display_order: number | null;
  
  // Status
  is_active: boolean;
  
  created_at: string;
  updated_at: string;
}

/**
 * Webshop order from a customer.
 */
export interface WebshopOrder {
  id: string;
  org_id: string;
  customer_id: string | null;
  
  // Order info
  order_number: string;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  
  // Totals
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  
  // Customer info (for guests)
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  
  // Shipping address
  shipping_address_line1: string | null;
  shipping_address_line2: string | null;
  shipping_postcode: string | null;
  shipping_city: string | null;
  
  // Notes
  customer_notes: string | null;
  internal_notes: string | null;
  
  // Payment
  payment_status: "pending" | "paid" | "refunded" | "failed";
  payment_method: string | null;
  paid_at: string | null;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  shipped_at: string | null;
  delivered_at: string | null;
}

/**
 * Line item in a webshop order.
 */
export interface WebshopOrderItem {
  id: string;
  order_id: string;
  
  // Product reference (either org product or partner product)
  product_id: string | null;
  partner_product_id: string | null;
  
  // Snapshot of product info at time of order
  product_name: string;
  product_sku: string | null;
  
  // Pricing
  unit_price: number;
  quantity: number;
  line_total: number;
  
  // Fulfillment
  is_fulfilled: boolean;
  fulfilled_at: string | null;
  
  created_at: string;
}

/**
 * Configuration for org's webshop on their landing page.
 */
export interface WebshopSettings {
  org_id: string;
  
  // Display settings
  is_enabled: boolean;
  show_in_menu: boolean;
  menu_label: string;
  
  // Partner products
  enabled_partners: string[]; // Partner IDs to show products from
  show_partner_branding: boolean;
  
  // Pricing
  default_markup_percentage: number;
  show_original_price: boolean;
  
  // Shipping
  offer_shipping: boolean;
  shipping_flat_rate: number | null;
  free_shipping_threshold: number | null;
  
  // Pickup
  offer_pickup: boolean;
  pickup_location_id: string | null;
  
  // Categories to show
  enabled_categories: ProductCategory[];
  
  updated_at: string;
}

/**
 * Partner definitions for Norwegian automotive parts suppliers.
 */
export const PARTNER_DEFINITIONS = [
  {
    name: "Norges Dekk",
    slug: "norges-dekk",
    type: "dekk" as const,
    description: "Norges ledende dekkgrossist med bredt utvalg av dekk og felger.",
    target_industries: ["dekkhotell", "verksted", "bilvask"],
  },
  {
    name: "Amring",
    slug: "amring",
    type: "dekk" as const,
    description: "Felger og dekk til alle bilmerker.",
    target_industries: ["dekkhotell", "verksted"],
  },
  {
    name: "Vianor",
    slug: "vianor",
    type: "dekk" as const,
    description: "Dekkjeden med verksted og dekkhotell.",
    target_industries: ["dekkhotell", "verksted"],
  },
  {
    name: "Veng",
    slug: "veng",
    type: "verksted" as const,
    description: "Bildeler og verkstedutstyr.",
    target_industries: ["verksted", "lakk_karosseri"],
  },
  {
    name: "Bilextra",
    slug: "bilextra",
    type: "generell" as const,
    description: "Tilbehør, reservedeler og verkstedutstyr.",
    target_industries: ["verksted", "bilpleie", "bilvask"],
  },
] as const;
