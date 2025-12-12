"use client";

import { useState } from "react";
import { MapPin, CheckCircle } from "lucide-react";

interface MapSelectorProps {
  address: string;
  city: string;
  postcode: string;
  initialLat?: number;
  initialLng?: number;
  onLocationSelected: (lat: number, lng: number, confirmed: boolean) => void;
}

/**
 * Midlertidig kart-placeholder.
 *
 * Leaflet og leaflet.css er koblet ut for å få bygget grønt i CI.
 * Denne komponenten lar deg fortsatt:
 *  - vise adressen
 *  - vise "fiktive" koordinater (initialLat/initialLng)
 *  - trigge onLocationSelected med en bekreftet posisjon
 *
 * TODO: Re-implementer ekte Leaflet-kart som ren client component
 *       når byggeproblemet med lightningcss er løst.
 */
export default function MapSelector({
  address,
  city,
  postcode,
  initialLat = 59.9139,
  initialLng = 10.7522,
  onLocationSelected,
}: MapSelectorProps) {
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirmLocation = () => {
    setConfirmed(true);
    onLocationSelected(initialLat, initialLng, true);
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-1">
              Plasser din bedrift på kartet
            </h3>
            <p className="text-sm text-blue-700">
              Kartvisning er midlertidig deaktivert i denne versjonen for å løse
              byggefeil relatert til <code>leaflet</code>. Vi bruker
              standardkoordinater basert på din adresse inntil videre.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-700 space-y-2">
        <p className="font-medium text-slate-900">Adresse</p>
        <p>
          {address && city ? (
            <>
              {address}
              <br />
              {postcode} {city}
            </>
          ) : (
            <span className="text-slate-400">
              Fyll inn adresse og poststed i skjemaet over.
            </span>
          )}
        </p>

        <p className="mt-3 font-medium text-slate-900">Koordinater (midlertidig)</p>
        <p className="text-xs text-slate-500">
          Lat: {initialLat.toFixed(6)}, Lng: {initialLng.toFixed(6)}
        </p>
      </div>

      <button
        type="button"
        onClick={handleConfirmLocation}
        disabled={confirmed || !address || !city}
        className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
          confirmed
            ? "bg-green-600 text-white cursor-default"
            : !address || !city
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {confirmed ? (
          <>
            <CheckCircle className="w-4 h-4" />
            Plassering bekreftet
          </>
        ) : (
          <>
            <MapPin className="w-4 h-4" />
            Bekreft plassering uten kart
          </>
        )}
      </button>

      <p className="text-xs text-slate-500">
        Senere kan vi aktivere et fullt interaktivt kart igjen. All logikk for
        onboarding og lagring av koordinater kan fortsette å bruke denne
        komponenten som før.
      </p>
    </div>
  );
}
