"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { MapPin, Check } from "lucide-react";

// Dynamically import Leaflet to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

interface AddressData {
  country: string;
  city: string;
  postalCode: string;
  streetAddress: string;
  lat: number | null;
  lng: number | null;
  markerMatchesAddress: boolean;
}

interface Props {
  data: AddressData;
  onChange: (data: AddressData) => void;
  onNext: () => void;
  onBack: () => void;
}

const countries = [
  { value: "NO", label: "Norge" },
  { value: "SE", label: "Sverige" },
  { value: "DK", label: "Danmark" },
];

// Map component to handle events
function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  // Import useMapEvents inline to avoid dynamic import issues
  const { useMapEvents } = require("react-leaflet");
  
  useMapEvents({
    click: (e: any) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function Step3_AddressAndMap({ data, onChange, onNext, onBack }: Props) {
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodeError, setGeocodeError] = useState<string | null>(null);

  // Default to Oslo center if no coordinates
  const defaultCenter: [number, number] = [59.9139, 10.7522];
  const currentPosition: [number, number] = 
    data.lat && data.lng ? [data.lat, data.lng] : defaultCenter;

  // Geocode address when user clicks "Find on map"
  const handleGeocode = async () => {
    if (!data.streetAddress || !data.city) {
      setGeocodeError("Vennligst fyll ut gateadresse og by først");
      return;
    }

    setIsGeocoding(true);
    setGeocodeError(null);

    try {
      const query = `${data.streetAddress}, ${data.postalCode} ${data.city}, ${data.country}`;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
      );
      const results = await response.json();

      if (results && results.length > 0) {
        const { lat, lon } = results[0];
        onChange({
          ...data,
          lat: parseFloat(lat),
          lng: parseFloat(lon),
          markerMatchesAddress: true,
        });
      } else {
        setGeocodeError("Kunne ikke finne adressen. Prøv å klikke på kartet.");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      setGeocodeError("Noe gikk galt ved søk etter adresse");
    } finally {
      setIsGeocoding(false);
    }
  };

  // Reverse geocode when user clicks on map
  const handleMapClick = useCallback(async (lat: number, lng: number) => {
    onChange({
      ...data,
      lat,
      lng,
      markerMatchesAddress: false, // User clicked, not matched
    });

    // Optionally reverse geocode to suggest address
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const result = await response.json();
      
      if (result && result.address) {
        // Could suggest filling in address fields here
        console.log("Reverse geocode result:", result.address);
      }
    } catch (error) {
      console.error("Reverse geocoding error:", error);
    }
  }, [data, onChange]);

  const canContinue = 
    data.country && 
    data.city && 
    data.postalCode && 
    data.streetAddress && 
    data.lat !== null && 
    data.lng !== null;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Hvor holder dere til?</h2>
        <p className="text-gray-600">
          Oppgi adresse og marker nøyaktig plassering på kartet
        </p>
      </div>

      {/* Address Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Adresse
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Land
            </label>
            <select
              value={data.country}
              onChange={(e) => onChange({ ...data, country: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {countries.map((country) => (
                <option key={country.value} value={country.value}>
                  {country.label}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gateadresse
            </label>
            <input
              type="text"
              value={data.streetAddress}
              onChange={(e) => onChange({ ...data, streetAddress: e.target.value })}
              placeholder="Storgata 1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Postnummer
            </label>
            <input
              type="text"
              value={data.postalCode}
              onChange={(e) => onChange({ ...data, postalCode: e.target.value })}
              placeholder="0150"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              By
            </label>
            <input
              type="text"
              value={data.city}
              onChange={(e) => onChange({ ...data, city: e.target.value })}
              placeholder="Oslo"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <button
          onClick={handleGeocode}
          disabled={isGeocoding || !data.streetAddress || !data.city}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isGeocoding ? "Søker..." : "Finn på kart"}
        </button>

        {geocodeError && (
          <p className="text-sm text-red-600">{geocodeError}</p>
        )}
      </div>

      {/* Map */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Kart</h3>
          {data.lat && data.lng && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{data.lat.toFixed(6)}, {data.lng.toFixed(6)}</span>
            </div>
          )}
        </div>

        <p className="text-sm text-gray-600">
          Klikk på kartet for å flytte markøren til nøyaktig plassering
        </p>

        <div className="h-96 rounded-lg overflow-hidden border border-gray-300">
          {typeof window !== "undefined" && (
            <MapContainer
              center={currentPosition}
              zoom={data.lat && data.lng ? 15 : 10}
              style={{ height: "100%", width: "100%" }}
              key={`${currentPosition[0]}-${currentPosition[1]}`}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {data.lat && data.lng && (
                <Marker position={currentPosition} />
              )}
              <MapClickHandler onMapClick={handleMapClick} />
            </MapContainer>
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="markerMatches"
            checked={data.markerMatchesAddress}
            onChange={(e) => onChange({ ...data, markerMatchesAddress: e.target.checked })}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="markerMatches" className="text-sm text-gray-700 flex items-center gap-2">
            <Check className="w-4 h-4" />
            Markøren samsvarer med adressen
          </label>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6">
        <button
          onClick={onBack}
          className="px-6 py-2 text-gray-700 hover:text-gray-900 font-medium"
        >
          ← Tilbake
        </button>

        <button
          onClick={onNext}
          disabled={!canContinue}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all"
        >
          Fullfør registrering →
        </button>
      </div>
    </div>
  );
}
