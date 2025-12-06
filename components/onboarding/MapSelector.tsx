"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, CheckCircle } from "lucide-react";

// Dynamically import Leaflet to avoid SSR issues
let L: any = null;
if (typeof window !== "undefined") {
  L = require("leaflet");
  require("leaflet/dist/leaflet.css");
  
  // Fix default marker icon issue
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
}

interface MapSelectorProps {
  address: string;
  city: string;
  postcode: string;
  initialLat?: number;
  initialLng?: number;
  onLocationSelected: (lat: number, lng: number, confirmed: boolean) => void;
}

export default function MapSelector({
  address,
  city,
  postcode,
  initialLat = 59.9139,
  initialLng = 10.7522,
  onLocationSelected,
}: MapSelectorProps) {
  const mapRef = useRef<any>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  const [currentLat, setCurrentLat] = useState(initialLat);
  const [currentLng, setCurrentLng] = useState(initialLng);
  const [confirmed, setConfirmed] = useState(false);
  const [geocoding, setGeocoding] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!L || !mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([currentLat, currentLng], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    // Add draggable marker
    const marker = L.marker([currentLat, currentLng], {
      draggable: true,
      autoPan: true,
    }).addTo(map);

    marker.on("dragend", function (e: any) {
      const position = e.target.getLatLng();
      setCurrentLat(position.lat);
      setCurrentLng(position.lng);
      setConfirmed(false);
      onLocationSelected(position.lat, position.lng, false);
    });

    mapInstanceRef.current = map;
    markerRef.current = marker;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Geocode address when user clicks "Find på kart"
  const handleGeocodeAddress = async () => {
    if (!address || !city) {
      alert("Fyll inn adresse og by først");
      return;
    }

    setGeocoding(true);

    try {
      const fullAddress = `${address}, ${postcode} ${city}, Norway`;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1`
      );
      
      const data = await response.json();

      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);

        setCurrentLat(lat);
        setCurrentLng(lng);
        setConfirmed(false);

        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.setView([lat, lng], 15);
          markerRef.current.setLatLng([lat, lng]);
        }

        onLocationSelected(lat, lng, false);
      } else {
        alert("Kunne ikke finne adressen på kartet. Juster markøren manuelt.");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      alert("Feil ved geokoding. Prøv igjen.");
    } finally {
      setGeocoding(false);
    }
  };

  // Confirm location
  const handleConfirmLocation = () => {
    setConfirmed(true);
    onLocationSelected(currentLat, currentLng, true);
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-1">Plasser din bedrift på kartet</h3>
            <p className="text-sm text-blue-700">
              Klikk "Finn på kart" for å finne adressen automatisk, eller dra markøren til rett sted.
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleGeocodeAddress}
          disabled={geocoding || !address || !city}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {geocoding ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Søker...
            </>
          ) : (
            <>
              <MapPin className="w-4 h-4" />
              Finn på kart
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleConfirmLocation}
          disabled={confirmed}
          className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
            confirmed
              ? "bg-green-600 text-white cursor-default"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {confirmed ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Bekreftet
            </>
          ) : (
            "Bekreft plassering"
          )}
        </button>
      </div>

      <div
        ref={mapRef}
        className="w-full h-96 rounded-lg border-2 border-gray-300 overflow-hidden"
        style={{ zIndex: 0 }}
      />

      <div className="text-sm text-gray-600 space-y-1">
        <p>
          <strong>Koordinater:</strong> {currentLat.toFixed(6)}, {currentLng.toFixed(6)}
        </p>
        <p className="text-xs text-gray-500">
          {confirmed ? "✓ Plasseringen er bekreftet" : "⚠ Husk å bekrefte plasseringen"}
        </p>
      </div>
    </div>
  );
}
