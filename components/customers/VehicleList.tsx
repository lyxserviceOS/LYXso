"use client";

import { useState } from "react";
import { Car, Plus, Edit2, Trash2 } from "lucide-react";
import VehicleModal from "./VehicleModal";
import { getApiBaseUrl } from "@/lib/apiConfig";

interface Vehicle {
  id: string;
  registration_number: string;
  make: string;
  model: string;
  year: number;
  color?: string;
  vin?: string;
  notes?: string;
}

interface VehicleListProps {
  customerId: string;
  vehicles: Vehicle[];
  onRefresh: () => void;
}

export default function VehicleList({ customerId, vehicles, onRefresh }: VehicleListProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setShowModal(true);
  };

  const handleDelete = async (vehicleId: string) => {
    if (!confirm("Er du sikker på at du vil slette dette kjøretøyet?")) {
      return;
    }

    setDeleting(vehicleId);
    try {
      const API_BASE = getApiBaseUrl();
      const response = await fetch(`${API_BASE}/vehicles/${vehicleId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Kunne ikke slette kjøretøy");
      }

      onRefresh();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Kunne ikke slette kjøretøy");
    } finally {
      setDeleting(null);
    }
  };

  const handleModalClose = (saved: boolean) => {
    setShowModal(false);
    setEditingVehicle(null);
    if (saved) {
      onRefresh();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Car className="w-5 h-5" />
          Kjøretøy ({vehicles.length})
        </h3>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Legg til kjøretøy
        </button>
      </div>

      {vehicles.length === 0 ? (
        <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
          <Car className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-4">Ingen kjøretøy registrert</p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Legg til første kjøretøy
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="text-lg font-bold text-gray-900 mb-1">
                    {vehicle.registration_number}
                  </div>
                  <div className="text-sm text-gray-700">
                    {vehicle.make} {vehicle.model} ({vehicle.year})
                  </div>
                  {vehicle.color && (
                    <div className="text-sm text-gray-500 mt-1">
                      Farge: {vehicle.color}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEdit(vehicle)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Rediger"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(vehicle.id)}
                    disabled={deleting === vehicle.id}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                    title="Slett"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {vehicle.vin && (
                <div className="text-xs text-gray-500 font-mono">
                  VIN: {vehicle.vin}
                </div>
              )}

              {vehicle.notes && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {vehicle.notes}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <VehicleModal
          customerId={customerId}
          vehicle={editingVehicle}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}
