"use client";

import { useState, useEffect } from "react";
import { useOrgPlan } from "@/components/OrgPlanContext";
import { buildOrgApiUrl } from "@/lib/apiConfig";
import AIChatInterface from "@/components/ai/AIChatInterface";
import {
  Users,
  Heart,
  TrendingUp,
  Star,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Loader2,
  UserCheck,
  MessageSquare,
} from "lucide-react";

export default function AICRMPage() {
  const { org } = useOrgPlan();
  const [loading, setLoading] = useState(false);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");

  useEffect(() => {
    if (org?.id) {
      fetchCustomers();
    }
  }, [org?.id]);

  const fetchCustomers = async () => {
    if (!org?.id) return;
    
    setCustomersLoading(true);
    try {
      const response = await fetch(buildOrgApiUrl(org.id, "customers"));
      if (response.ok) {
        const data = await response.json();
        setCustomers(data.customers || []);
      }
    } catch (err) {
      console.error("Kunne ikke hente kunder", err);
    } finally {
      setCustomersLoading(false);
    }
  };

  const handleGenerateInsight = async () => {
    if (!org?.id || !selectedCustomerId) return;
    
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const endpoint = buildOrgApiUrl(org.id, `ai/crm/customer-summary/${selectedCustomerId}`);
      const response = await fetch(endpoint);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ message: "Ukjent feil" }));
        throw new Error(errData.message || "Kunne ikke generere kundeinnsikt");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Noe gikk galt");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg">
            <Users className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            AI CRM Assistent
          </h1>
        </div>
        <p className="text-gray-600">
          AI-drevet kundeinnsikt og relasjonsoptimalisering
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-purple-600" />
            <span className="text-sm text-gray-600">Totale kunder</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
          <p className="text-xs text-gray-500 mt-1">Aktive kontoer</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-5 h-5 text-red-600" />
            <span className="text-sm text-gray-600">Lojalitet</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">87%</p>
          <p className="text-xs text-gray-500 mt-1">Gjenbesøk</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5 text-yellow-600" />
            <span className="text-sm text-gray-600">Vurdering</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">4.8</p>
          <p className="text-xs text-gray-500 mt-1">Gjennomsnitt</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-600">Verdi</span>
          </div>
          <p className="text-2xl font-bold text-green-600">+23%</p>
          <p className="text-xs text-gray-500 mt-1">LTV vekst</p>
        </div>
      </div>

      {/* Main Content - Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: AI Chat */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Chat med CRM AI
          </h2>
          <AIChatInterface
            orgId={org?.id || ""}
            context="crm"
            welcomeMessage="Hei! Jeg er din AI CRM-assistent. Jeg kan hjelpe deg med å analysere kunder, segmentere målgrupper, foreslå oppfølginger og optimalisere kundeforhold. Hvilken kunde vil du vite mer om?"
            placeholder="Spør om kundeinnsikt..."
          />
        </div>

        {/* Right: Customer Analysis */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-purple-600" />
              Kundeanalyse
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Velg kunde
                </label>
                {customersLoading ? (
                  <div className="flex items-center gap-2 text-gray-500 py-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Laster kunder...</span>
                  </div>
                ) : customers.length === 0 ? (
                  <p className="text-sm text-gray-500 py-2">
                    Ingen kunder funnet. Legg til kunder i CRM-modulen først.
                  </p>
                ) : (
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">-- Velg kunde --</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name || customer.email || `Kunde ${customer.id.slice(0, 8)}`}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <button
                onClick={handleGenerateInsight}
                disabled={loading || !selectedCustomerId || !org?.id}
                className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyserer kunde...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generer Kundeinnsikt
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            )}

            {result && (
              <div className="mt-4 space-y-3">
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-start gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-purple-900 mb-2">AI Kundesammendrag</h3>
                      <div className="text-sm text-gray-700 whitespace-pre-wrap">
                        {result.summary || result.insight || JSON.stringify(result, null, 2)}
                      </div>
                    </div>
                  </div>
                </div>

                {result.nextActions && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">Anbefalte tiltak</h3>
                    <div className="text-sm text-gray-700 whitespace-pre-wrap">
                      {result.nextActions}
                    </div>
                  </div>
                )}
              </div>
            )}

            {!loading && !result && !error && selectedCustomerId && (
              <div className="mt-4 text-center py-8">
                <UserCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">
                  Klikk knappen over for å få AI-drevet kundeinnsikt
                </p>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-6">
            <h3 className="font-semibold text-purple-900 mb-4">
              Hva AI kan hjelpe med
            </h3>
            <div className="space-y-2 text-sm text-purple-800">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span>Analysere kundeadferd og preferanser</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span>Foreslå personlige oppfølginger</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span>Identifisere churn-risiko</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span>Segmentere kunder automatisk</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span>Beregne customer lifetime value</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
