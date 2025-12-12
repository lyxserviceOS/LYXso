// components/dekkhotell/CustomerVehicleSearch.tsx
"use client";

import { useState, useEffect, useRef } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
const ORG_ID = process.env.NEXT_PUBLIC_ORG_ID;

type Customer = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
};

type Vehicle = {
  id: string;
  registration_number: string;
  make?: string;
  model?: string;
  year?: number;
};

type CustomerVehicleSearchProps = {
  registrationNumber: string;
  customerName: string;
  onSelect: (customer: Customer | null, vehicle: Vehicle | null) => void;
  onChange: (field: string, value: string) => void;
};

export default function CustomerVehicleSearch({
  registrationNumber,
  customerName,
  onSelect,
  onChange,
}: CustomerVehicleSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<{
    customer: Customer;
    vehicle: Vehicle;
  }>>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search for existing customers and vehicles
  useEffect(() => {
    if (!searchQuery || searchQuery.length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      if (!API_BASE || !ORG_ID) {
        // Mock data for demo
        const mockResults = [
          {
            customer: {
              id: "c1",
              name: "Ola Nordmann",
              phone: "12345678",
              email: "ola@example.com",
            },
            vehicle: {
              id: "v1",
              registration_number: "AB12345",
              make: "Toyota",
              model: "Corolla",
              year: 2020,
            },
          },
          {
            customer: {
              id: "c2",
              name: "Kari Hansen",
              phone: "87654321",
              email: "kari@example.com",
            },
            vehicle: {
              id: "v2",
              registration_number: "CD67890",
              make: "Volkswagen",
              model: "Golf",
              year: 2019,
            },
          },
        ];

        const filtered = mockResults.filter(
          (r) =>
            r.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.vehicle.registration_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.customer.phone?.includes(searchQuery) ||
            r.customer.email?.toLowerCase().includes(searchQuery.toLowerCase())
        );

        setSearchResults(filtered);
        setShowDropdown(filtered.length > 0);
        return;
      }

      setSearching(true);

      try {
        // Search in both customers and vehicles
        const res = await fetch(
          `${API_BASE}/api/orgs/${ORG_ID}/customers/search?q=${encodeURIComponent(searchQuery)}`,
          { method: "GET" }
        );

        if (!res.ok) {
          throw new Error("Søk feilet");
        }

        const data = await res.json();
        setSearchResults(data.results || []);
        setShowDropdown((data.results || []).length > 0);
      } catch (err) {
        console.error("Søk feil:", err);
        setSearchResults([]);
        setShowDropdown(false);
      } finally {
        setSearching(false);
      }
    }, 300); // Debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleInputChange = (value: string) => {
    setSearchQuery(value);
    onChange("registration_number", value.toUpperCase());
  };

  const handleSelectResult = (result: { customer: Customer; vehicle: Vehicle }) => {
    onChange("registration_number", result.vehicle.registration_number);
    onChange("customer_name", result.customer.name);
    onSelect(result.customer, result.vehicle);
    setShowDropdown(false);
    setSearchQuery("");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="grid grid-cols-2 gap-3 mb-2">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Søk kunde/kjøretøy
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Navn, regnr, telefon..."
              className="w-full rounded-md border border-slate-300 px-3 py-2 pr-8 text-sm focus:border-blue-500 focus:outline-none"
            />
            {searching && (
              <div className="absolute right-2 top-2.5">
                <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Status</label>
          <div className="text-xs text-slate-500 pt-2">
            {searchResults.length > 0 ? (
              <span className="text-blue-600">
                {searchResults.length} treff funnet
              </span>
            ) : searchQuery.length >= 2 ? (
              <span className="text-slate-400">Ingen treff</span>
            ) : (
              <span className="text-slate-400">Søk etter eksisterende</span>
            )}
          </div>
        </div>
      </div>

      {/* Dropdown with search results */}
      {showDropdown && searchResults.length > 0 && (
        <div className="absolute z-10 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {searchResults.map((result, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectResult(result)}
              className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-slate-100 last:border-b-0 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {result.customer.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {result.vehicle.registration_number}
                    {result.vehicle.make && ` • ${result.vehicle.make}`}
                    {result.vehicle.model && ` ${result.vehicle.model}`}
                    {result.vehicle.year && ` (${result.vehicle.year})`}
                  </p>
                  {result.customer.phone && (
                    <p className="text-xs text-slate-400 mt-0.5">
                      📱 {result.customer.phone}
                    </p>
                  )}
                </div>
                <div className="text-blue-600">→</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
