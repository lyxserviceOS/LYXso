// types/product.ts

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
