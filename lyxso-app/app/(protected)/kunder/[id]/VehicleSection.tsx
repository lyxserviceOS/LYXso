"use client";

import { useState, useEffect } from "react";
import { Car, Plus, Edit2, Trash2, Image as ImageIcon } from "lucide-react";
import VehicleModal from "@/components/customers/VehicleModal";
import VehicleImageUpload from "@/components/customers/VehicleImageUpload";

interface VehicleImage {
  id: string;
  url: string;
  uploaded_at: string;
}

interface Vehicle {
  id: string;
  registration_number: string;
  make: string;
  model: string;
  year: number;
  color?: string;
  vin?: string;
  notes?: string;
  images?: VehicleImage[];
}

interface Props {
  customerId: string;
}

export default function VehicleSection({ customerId }: Props) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [selectedVehicleForImages, setSelectedVehicleForImages] = useState<string | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

  useEffect(() => {
    fetchVehicles();
  }, [customerId]);

  const fetchVehicles = async () => {
    try {
      const response = await fetch(
        `${API_BASE}/api/customers/${customerId}/vehicles`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        console.error("Failed to fetch vehicles");
        setVehicles([]);
        return;
      }

      const data = await response.json();
      setVehicles(data.vehicles || []);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingVehicle(null);
    setShowModal(true);
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setShowModal(true);
  };

  const handleDelete = async (vehicleId: string) => {
    if (!confirm("Er du sikker på at du vil slette dette kjøretøyet?")) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/vehicles/${vehicleId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        alert("Kunne ikke slette kjøretøy");
        return;
      }

      await fetchVehicles();
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      alert("Feil ved sletting av kjøretøy");
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingVehicle(null);
    fetchVehicles();
  };

  if (loading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm text-slate-500">Laster kjøretøy...</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {vehicles.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
            <Car className="mx-auto h-8 w-8 text-slate-400" />
            <p className="mt-2 text-sm text-slate-500">
              Ingen kjøretøy registrert
            </p>
            <button
              onClick={handleAdd}
              className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              + Legg til første kjøretøy
            </button>
          </div>
        ) : (
          vehicles.map((vehicle) => (
            <div key={vehicle.id} className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-3">
                  <Car className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="font-medium text-slate-900">
                      {vehicle.registration_number}
                    </p>
                    <p className="text-sm text-slate-600">
                      {vehicle.make} {vehicle.model} ({vehicle.year})
                      {vehicle.color && ` • ${vehicle.color}`}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedVehicleForImages(
                      selectedVehicleForImages === vehicle.id ? null : vehicle.id
                    )}
                    className={`rounded p-1.5 hover:bg-slate-100 ${
                      selectedVehicleForImages === vehicle.id
                        ? "text-blue-600"
                        : "text-slate-500"
                    }`}
                    title="Bilder"
                  >
                    <ImageIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(vehicle)}
                    className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                    title="Rediger"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(vehicle.id)}
                    className="rounded p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600"
                    title="Slett"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Image Upload Section */}
              {selectedVehicleForImages === vehicle.id && (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <h4 className="font-medium text-slate-900 mb-3">Bilder av kjøretøy</h4>
                  <VehicleImageUpload
                    vehicleId={vehicle.id}
                    images={vehicle.images || []}
                    onImagesUpdated={fetchVehicles}
                  />
                </div>
              )}
            </div>
          ))
        )}

        {vehicles.length > 0 && (
          <button
            onClick={handleAdd}
            className="w-full rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600 hover:border-slate-400 hover:bg-slate-100"
          >
            + Legg til kjøretøy
          </button>
        )}
      </div>

      {showModal && (
        <VehicleModal
          customerId={customerId}
          vehicle={editingVehicle}
          onClose={handleModalClose}
        />
      )}
    </>
  );
}
