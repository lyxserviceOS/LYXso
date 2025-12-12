// app/(protected)/markedsforing/ai/page.tsx
import AiCampaignGenerator from "./AiCampaignGenerator";
import AiAdCopyGenerator from "./AiAdCopyGenerator";

export const metadata = {
  title: "AI Markedsføring | LYXso",
  description: "Bruk AI til å generere kampanjeidéer og annonsetekster",
};

export default function AiMarketingPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Markedsføring
          </h1>
          <p className="text-gray-600">
            La AI hjelpe deg med å lage effektive kampanjer og annonsetekster
          </p>
        </div>

        <div className="space-y-8">
          {/* Kampanjegenerator */}
          <AiCampaignGenerator />

          {/* Annonsetekst-generator */}
          <AiAdCopyGenerator />
        </div>
      </div>
    </div>
  );
}
