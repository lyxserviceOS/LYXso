// lyxso-app/types/payments.ts

export interface PaymentSummaryBucket {
  bucket: string;      // ISO-dato (start på dag/uke/mnd/år)
  total_amount: number;
  currency: string;
}
