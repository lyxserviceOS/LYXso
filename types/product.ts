// types/product.ts

export type ProductCategory = {
  id: string;
  orgId: string;
  name: string;
  position: number;
  createdAt: string;
  updatedAt: string;
};

export type Product = {
  id: string;
  orgId: string;
  name: string;
  description: string | null;
  sku: string | null;
  price: number | null;
  unit: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
