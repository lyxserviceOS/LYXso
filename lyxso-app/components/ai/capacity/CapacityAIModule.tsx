'use client';

import { BarChart3, AlertCircle } from 'lucide-react';

export default function CapacityAIModule() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <BarChart3 className="h-8 w-8 text-blue-600" />
          AI Capacity
        </h1>
        <p className="text-slate-600 mt-2">Under utvikling</p>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <AlertCircle className="h-6 w-6 text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Under utvikling</h3>
            <p className="text-slate-700">
              Denne modulen er under utvikling og vil snart være tilgjengelig.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
