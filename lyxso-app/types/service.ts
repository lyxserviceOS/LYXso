// types/service.ts

export type ServiceCategory = {
  id: string;
  orgId: string;
  name: string;
  description: string | null;
  position: number;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type Service = {
  id: string;
  orgId: string;
  categoryId: string | null;
  name: string;
  description: string | null;
  durationMinutes: number | null;
  
  // Pricing fields
  costPrice: number | null;       // Innkjøpspris / kostpris
  price: number | null;           // Utsalgspris / salgspris
  offerPrice: number | null;      // Tilbudspris
  isOnOffer: boolean;             // Om tjenesten er på tilbud
  offerValidFrom: string | null;  // Tilbud gyldig fra
  offerValidTo: string | null;    // Tilbud gyldig til
  
  // Online booking settings
  allowOnlineBooking: boolean;    // Kan bookes online
  requireDeposit: boolean;        // Krever depositum
  depositAmount: number | null;   // Depositumsbeløp
  minBookingLeadHours: number | null;  // Minimum tid før booking
  maxConcurrentBookings: number | null; // Maks samtidige bookinger
  
  // Display settings
  displayOrder: number;           // Rekkefølge i liste
  showInPublicBooking: boolean;   // Vis i offentlig booking
  
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
};

/**
 * Calculates the effective display price for a service, taking into account active offers.
 * 
 * @param service - The service to calculate the display price for
 * @returns An object containing:
 *   - price: The effective price to display (offer price if on valid offer, otherwise regular price)
 *   - originalPrice: The original price (only set if an offer is active, null otherwise)
 *   - isOffer: Boolean indicating if the current price is an offer price
 * 
 * @example
 * const { price, originalPrice, isOffer } = getDisplayPrice(service);
 * if (isOffer && originalPrice) {
 *   // Show strikethrough on originalPrice, display price as offer
 * }
 */
export function getDisplayPrice(service: Service): { price: number | null; originalPrice: number | null; isOffer: boolean } {
  if (service.isOnOffer && service.offerPrice !== null) {
    // Check if offer is valid based on date range
    const now = new Date();
    const validFrom = service.offerValidFrom ? new Date(service.offerValidFrom) : null;
    const validTo = service.offerValidTo ? new Date(service.offerValidTo) : null;
    
    const isValid = (!validFrom || now >= validFrom) && (!validTo || now <= validTo);
    
    if (isValid) {
      return {
        price: service.offerPrice,
        originalPrice: service.price,
        isOffer: true
      };
    }
  }
  
  return {
    price: service.price,
    originalPrice: null,
    isOffer: false
  };
}
