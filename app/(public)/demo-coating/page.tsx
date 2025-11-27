import CoatingPageClient from "@/app/(protected)/coating/CoatingPageClient";

export const metadata = {
  title: "LYXso – Coating PRO Demo",
};

export default function DemoCoatingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 rounded-lg border border-purple-200 bg-purple-50 px-4 py-2 text-sm text-purple-700">
          <strong>Demo-modus:</strong> Dette er en forhåndsvisning av Coating PRO-modulen med eksempeldata.
        </div>
        <CoatingPageClient />
      </div>
    </div>
  );
}
