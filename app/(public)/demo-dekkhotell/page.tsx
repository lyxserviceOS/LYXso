import DekkhotellPageClient from "@/app/(protected)/dekkhotell/DekkhotellPageClient";

export const metadata = {
  title: "LYXso – Dekkhotell PRO Demo",
};

export default function DemoDekkhotellPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-700">
          <strong>Demo-modus:</strong> Dette er en forhåndsvisning av Dekkhotell PRO-modulen med eksempeldata.
        </div>
        <DekkhotellPageClient />
      </div>
    </div>
  );
}
