// types/service.ts

export type Service = {
  id: string;
  orgId: string;
  name: string;
  description: string | null;
  durationMinutes: number | null;
  price: number | null;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
};
