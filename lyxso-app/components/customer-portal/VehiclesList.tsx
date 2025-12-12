'use client';

import { Car } from 'lucide-react';

type Vehicle = {
  id: string;
  registration_number: string;
  model: string;
  year: number | null;
  color: string | null;
  created_at: string;
};

type Props = {
  vehicles: Vehicle[];
};

export default function VehiclesList({ vehicles }: Props) {
  if (vehicles.length === 0) {
    return (
      <div className="card text-center py-12">
        <Car className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-600">Du har ingen registrerte kjøretøy</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {vehicles.map((vehicle) => (
        <div key={vehicle.id} className="card">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Car className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 text-lg mb-1">
                {vehicle.registration_number}
              </h3>
              <p className="text-slate-600 mb-2">{vehicle.model}</p>
              <div className="flex flex-wrap gap-2 text-sm text-slate-500">
                {vehicle.year && <span>Årsmodell: {vehicle.year}</span>}
                {vehicle.color && <span>• {vehicle.color}</span>}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
