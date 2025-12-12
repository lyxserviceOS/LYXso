'use client';

import { useState } from 'react';
import { Package, ChevronDown, ChevronUp, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

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
  tyreSet: TyreSet;
  urgency: 'high' | 'medium' | 'low';
};

export default function TyreSetCard({ tyreSet, urgency }: Props) {
  const [expanded, setExpanded] = useState(false);
  
  const latestInspection = tyreSet.tyre_inspections[0];

  const typeLabels: Record<string, string> = {
    summer: 'Sommer',
    winter: 'Vinter',
    studded: 'Piggdekk',
    allseason: 'Helår',
  };

  const statusLabels: Record<string, string> = {
    stored: 'Lagret',
    mounted: 'Montert',
    disposed: 'Kassert',
  };

  const urgencyColors = {
    high: 'border-red-300 bg-red-50',
    medium: 'border-orange-300 bg-orange-50',
    low: 'border-slate-200 bg-white',
  };

  const urgencyIcons = {
    high: <AlertCircle className="w-5 h-5 text-red-600" />,
    medium: <AlertTriangle className="w-5 h-5 text-orange-600" />,
    low: <CheckCircle className="w-5 h-5 text-green-600" />,
  };

  return (
    <div className={`card border ${urgencyColors[urgency]}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          {urgencyIcons[urgency]}
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-slate-900">
                {typeLabels[tyreSet.type] || tyreSet.type} - {tyreSet.dimension}
              </h3>
              <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
                {statusLabels[tyreSet.status] || tyreSet.status}
              </span>
            </div>

            {tyreSet.vehicles && (
              <p className="text-sm text-slate-600 mb-2">
                {tyreSet.vehicles.registration_number} - {tyreSet.vehicles.model}
              </p>
            )}

            {latestInspection && (
              <div className="text-sm space-y-1">
                <p className="text-slate-600">
                  Siste kontroll: {new Date(latestInspection.created_at).toLocaleDateString('nb-NO')}
                </p>
                
                {latestInspection.recommendation === 'must_replace' && (
                  <p className="text-red-600 font-semibold">
                    ⚠️ Må byttes
                  </p>
                )}
                
                {latestInspection.recommendation === 'replace_soon' && (
                  <p className="text-orange-600 font-semibold">
                    ⚠ Bør byttes snart
                  </p>
                )}
                
                {latestInspection.recommendation === 'ok' && (
                  <p className="text-green-600 font-semibold">
                    ✓ God tilstand
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-slate-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-600" />
          )}
        </button>
      </div>

      {/* Expanded details */}
      {expanded && latestInspection && (
        <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
          <h4 className="font-semibold text-slate-900 text-sm">AI-tilstandsrapport</h4>
          
          {latestInspection.result_json?.tread_depth && (
            <div>
              <p className="text-sm text-slate-600 mb-1">Mønsterdybde:</p>
              <div className="grid grid-cols-4 gap-2">
                {Object.entries(latestInspection.result_json.tread_depth).map(([position, depth]: [string, any]) => (
                  <div key={position} className="text-center">
                    <p className="text-xs text-slate-500 mb-1">{position}</p>
                    <p className="text-lg font-bold text-slate-900">{depth}mm</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {latestInspection.result_json?.issues && latestInspection.result_json.issues.length > 0 && (
            <div>
              <p className="text-sm text-slate-600 mb-1">Notater:</p>
              <ul className="text-sm text-slate-700 list-disc list-inside">
                {latestInspection.result_json.issues.map((issue: string, i: number) => (
                  <li key={i}>{issue}</li>
                ))}
              </ul>
            </div>
          )}

          {urgency !== 'low' && (
            <div className="pt-3 border-t border-slate-200">
              <button
                className="w-full px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                onClick={() => {
                  // TODO: Implementer "be om tilbud"-funksjonalitet
                  alert('Be om tilbud-funksjonalitet kommer snart!');
                }}
              >
                Be om tilbud på nye dekk
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
