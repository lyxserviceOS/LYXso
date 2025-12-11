'use client';

import { useState } from 'react';
import { Package, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import TyreSetCard from './TyreSetCard';

type TyreSet = {
  id: string;
  type: string;
  dimension: string;
  status: string;
  dot_year: number | null;
  vehicles: { registration_number: string; model: string } | null;
  tyre_inspections: Array<{
    id: string;
    result_json: any;
    recommendation: string;
    created_at: string;
  }>;
};

type Props = {
  tyreSets: TyreSet[];
};

export default function TyreSetsList({ tyreSets }: Props) {
  if (tyreSets.length === 0) {
    return (
      <div className="card text-center py-12">
        <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-600">Du har ingen dekksett lagret hos oss</p>
      </div>
    );
  }

  // Grupper etter status
  const needsReplace = tyreSets.filter((set) => {
    const latestInspection = set.tyre_inspections[0];
    return latestInspection?.recommendation === 'must_replace';
  });

  const shouldReplaceSoon = tyreSets.filter((set) => {
    const latestInspection = set.tyre_inspections[0];
    return latestInspection?.recommendation === 'replace_soon';
  });

  const ok = tyreSets.filter((set) => {
    const latestInspection = set.tyre_inspections[0];
    return !latestInspection || latestInspection?.recommendation === 'ok';
  });

  return (
    <div className="space-y-6">
      {/* Varsler */}
      {needsReplace.length > 0 && (
        <div className="card bg-red-50 border-red-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 mb-1">
                {needsReplace.length} dekksett må byttes
              </h3>
              <p className="text-sm text-red-800">
                Disse dekkene er ikke trygge å bruke lenger. Kontakt oss for tilbud på nye dekk.
              </p>
            </div>
          </div>
        </div>
      )}

      {shouldReplaceSoon.length > 0 && (
        <div className="card bg-orange-50 border-orange-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-orange-900 mb-1">
                {shouldReplaceSoon.length} dekksett bør byttes snart
              </h3>
              <p className="text-sm text-orange-800">
                Disse dekkene begynner å bli dårlige. Planlegg utskifting.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Dekksett-liste */}
      <div className="space-y-4">
        {needsReplace.map((tyreSet) => (
          <TyreSetCard key={tyreSet.id} tyreSet={tyreSet} urgency="high" />
        ))}

        {shouldReplaceSoon.map((tyreSet) => (
          <TyreSetCard key={tyreSet.id} tyreSet={tyreSet} urgency="medium" />
        ))}

        {ok.map((tyreSet) => (
          <TyreSetCard key={tyreSet.id} tyreSet={tyreSet} urgency="low" />
        ))}
      </div>
    </div>
  );
}
