"use client";

import { useOrgPlan } from "@/components/OrgPlanContext";
import AIChatInterface from "@/components/ai/AIChatInterface";
import { MessageSquare, Sparkles } from "lucide-react";

export default function AIChatPage() {
  const { org } = useOrgPlan();

  if (!org?.id) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">Laster organisasjonsdata...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">AI Chat Assistent</h1>
        </div>
        <p className="text-gray-600">
          Chat med LYXso AI for hjelp med booking, markedsføring, kunder og mer
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <MessageSquare className="w-8 h-8 text-blue-600 mb-2" />
          <h3 className="font-semibold text-gray-900 mb-1">24/7 Tilgjengelig</h3>
          <p className="text-sm text-gray-600">
            AI-assistenten er alltid klar til å hjelpe
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <Sparkles className="w-8 h-8 text-purple-600 mb-2" />
          <h3 className="font-semibold text-gray-900 mb-1">Intelligent</h3>
          <p className="text-sm text-gray-600">
            Lærer av din bedrift og gir skreddersydde svar
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <MessageSquare className="w-8 h-8 text-green-600 mb-2" />
          <h3 className="font-semibold text-gray-900 mb-1">Multifunksjonell</h3>
          <p className="text-sm text-gray-600">
            Hjelp med booking, markedsføring, CRM og regnskap
          </p>
        </div>
      </div>

      {/* Chat Interface */}
      <AIChatInterface
        orgId={org.id}
        context="assistant"
        welcomeMessage="Hei! Jeg er LYXso AI-assistent. Jeg kan hjelpe deg med booking, markedsføring, kunder, regnskap og mye mer. Hva kan jeg hjelpe deg med i dag?"
      />

      {/* Tips */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Tips til bruk:</h3>
        <ul className="space-y-1 text-sm text-blue-800">
          <li>• Spør om hvordan du kan forbedre bookinger</li>
          <li>• Be om hjelp til å lage markedsføringskampanjer</li>
          <li>• Få forslag til hvordan du kan øke kundelojalitet</li>
          <li>• Spør om beste praksis for din bransje</li>
        </ul>
      </div>
    </div>
  );
}
