// app/(protected)/data-import/DataImportClient.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";

type ImportCategory = "customers" | "vehicles" | "tyres" | "coating" | "bookings";

type ImportStatus = "idle" | "uploading" | "processing" | "completed" | "error";

interface ImportJob {
  id: string;
  category: ImportCategory;
  filename: string;
  status: ImportStatus;
  total_rows: number;
  processed_rows: number;
  success_rows: number;
  error_rows: number;
  errors: string[];
  created_at: string;
  completed_at: string | null;
}

const IMPORT_CATEGORIES: {
  key: ImportCategory;
  label: string;
  description: string;
  template_fields: string[];
  icon: string;
}[] = [
  {
    key: "customers",
    label: "Kunder",
    description: "Importer kundedatabase med kontaktinfo og notater",
    template_fields: ["Navn", "E-post", "Telefon", "Adresse", "Postnr", "By", "Notater"],
    icon: "👤",
  },
  {
    key: "vehicles",
    label: "Kjøretøy",
    description: "Importer kjøretøy tilknyttet kunder",
    template_fields: ["Regnr", "Merke", "Modell", "Årsmodell", "Farge", "VIN", "Kunde (e-post/telefon)"],
    icon: "🚗",
  },
  {
    key: "tyres",
    label: "Dekksett",
    description: "Importer dekksett fra eksisterende dekkhotell",
    template_fields: ["Regnr", "Kunde", "Dimensjon", "Merke", "Modell", "Sesong", "Tilstand", "Mønsterdybde", "Hylle", "Rad", "Posisjon", "Notater"],
    icon: "🛞",
  },
  {
    key: "coating",
    label: "Coating-jobber",
    description: "Importer historiske coating-jobber med garantiinfo",
    template_fields: ["Kunde", "Regnr", "Produkt", "Merke", "Antall lag", "Garantitid (år)", "Utført dato", "Pris", "Utført av", "Notater"],
    icon: "✨",
  },
  {
    key: "bookings",
    label: "Bookinger",
    description: "Importer pågående og fremtidige bookinger",
    template_fields: ["Kunde", "Telefon", "E-post", "Tjeneste", "Dato", "Klokkeslett", "Varighet (min)", "Pris", "Status", "Notater"],
    icon: "📅",
  },
];

const MOCK_IMPORTS: ImportJob[] = [
  {
    id: "import-1",
    category: "customers",
    filename: "kunder_export_2024.csv",
    status: "completed",
    total_rows: 450,
    processed_rows: 450,
    success_rows: 442,
    error_rows: 8,
    errors: [
      "Rad 23: Ugyldig e-postadresse",
      "Rad 56: Mangler telefonnummer",
      "Rad 89: Duplikat kunde (eksisterer allerede)",
    ],
    created_at: "2024-11-25T10:00:00Z",
    completed_at: "2024-11-25T10:05:00Z",
  },
  {
    id: "import-2",
    category: "tyres",
    filename: "dekksett_hovedlager.csv",
    status: "completed",
    total_rows: 380,
    processed_rows: 380,
    success_rows: 375,
    error_rows: 5,
    errors: [
      "Rad 112: Regnr ikke funnet i kundebase",
      "Rad 245: Ugyldig sesong-verdi",
    ],
    created_at: "2024-11-25T11:30:00Z",
    completed_at: "2024-11-25T11:35:00Z",
  },
];

export default function DataImportClient() {
  const [imports, setImports] = useState<ImportJob[]>(MOCK_IMPORTS);
  const [selectedCategory, setSelectedCategory] = useState<ImportCategory | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleStartImport = (category: ImportCategory) => {
    setSelectedCategory(category);
    setShowUploadModal(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
    }
  };

  const handleUpload = () => {
    if (!uploadFile || !selectedCategory) return;
    
    setUploading(true);
    
    // Simulate upload and processing
    setTimeout(() => {
      const newImport: ImportJob = {
        id: `import-${Date.now()}`,
        category: selectedCategory,
        filename: uploadFile.name,
        status: "processing",
        total_rows: Math.floor(Math.random() * 500) + 50,
        processed_rows: 0,
        success_rows: 0,
        error_rows: 0,
        errors: [],
        created_at: new Date().toISOString(),
        completed_at: null,
      };
      
      setImports(prev => [newImport, ...prev]);
      setUploading(false);
      setShowUploadModal(false);
      setUploadFile(null);
      setSelectedCategory(null);
      
      // Simulate processing completion after a delay
      setTimeout(() => {
        setImports(prev => prev.map(imp => 
          imp.id === newImport.id 
            ? {
                ...imp,
                status: "completed",
                processed_rows: imp.total_rows,
                success_rows: imp.total_rows - Math.floor(Math.random() * 10),
                error_rows: Math.floor(Math.random() * 10),
                completed_at: new Date().toISOString(),
              }
            : imp
        ));
      }, 3000);
    }, 1500);
  };

  const downloadTemplate = (category: ImportCategory) => {
    const cat = IMPORT_CATEGORIES.find(c => c.key === category);
    if (!cat) return;
    
    // Create CSV content
    const headers = cat.template_fields.join(";");
    const exampleRow = cat.template_fields.map(() => "").join(";");
    const content = `${headers}\n${exampleRow}`;
    
    // Download
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `lyxso_import_mal_${category}.csv`;
    link.click();
  };

  const getStatusColor = (status: ImportStatus): string => {
    switch (status) {
      case "completed": return "bg-emerald-100 text-emerald-700";
      case "processing": return "bg-blue-100 text-blue-700";
      case "uploading": return "bg-amber-100 text-amber-700";
      case "error": return "bg-red-100 text-red-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const getStatusLabel = (status: ImportStatus): string => {
    switch (status) {
      case "completed": return "Fullført";
      case "processing": return "Behandler...";
      case "uploading": return "Laster opp...";
      case "error": return "Feil";
      default: return "Venter";
    }
  };

  const getCategoryLabel = (category: ImportCategory): string => {
    return IMPORT_CATEGORIES.find(c => c.key === category)?.label || category;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900">Dataimport</h1>
        <p className="text-sm text-slate-500 max-w-2xl">
          Importer eksisterende data fra andre systemer til LYXso. Last opp CSV-filer med 
          kunder, kjøretøy, dekksett, coating-jobber og bookinger.
        </p>
      </header>

      {/* Pilot Info */}
      <section className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-start gap-3">
          <span className="text-xl">🧪</span>
          <div>
            <h3 className="font-semibold text-amber-900">Pilot-fase: LYX Bilpleie som testlokasjon</h3>
            <p className="text-sm text-amber-700 mt-1">
              Denne modulen brukes til å importere ekte data fra din virksomhet til LYXso.
              Før du slipper inn andre partnere, bruker du ditt eget selskap som &quot;laboratorium&quot; 
              for å oppdage hvor det knirker i UX og logikk.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">Kunder fra Fieldd</span>
              <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">Dekksett fra Excel</span>
              <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">Coating-historikk</span>
              <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">Bookinger</span>
            </div>
          </div>
        </div>
      </section>

      {/* Import Categories */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {IMPORT_CATEGORIES.map((category) => (
          <div key={category.key} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{category.icon}</span>
              <div>
                <h3 className="font-semibold text-slate-900">{category.label}</h3>
                <p className="text-xs text-slate-500">{category.description}</p>
              </div>
            </div>
            
            <div className="text-xs text-slate-400 mb-4">
              <p className="font-medium mb-1">Felter i mal:</p>
              <p className="truncate">{category.template_fields.join(", ")}</p>
            </div>
            
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => downloadTemplate(category.key)}
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Last ned mal
              </button>
              <button
                type="button"
                onClick={() => handleStartImport(category.key)}
                className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700"
              >
                Importer
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* Import History */}
      <section className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Import-historikk</h2>
        </div>
        
        {imports.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            Ingen importer utført ennå. Velg en kategori over for å starte.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {imports.map((imp) => (
              <div key={imp.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">
                      {IMPORT_CATEGORIES.find(c => c.key === imp.category)?.icon}
                    </span>
                    <div>
                      <p className="font-medium text-slate-900">{imp.filename}</p>
                      <p className="text-xs text-slate-500">{getCategoryLabel(imp.category)}</p>
                    </div>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(imp.status)}`}>
                    {getStatusLabel(imp.status)}
                  </span>
                </div>
                
                {/* Progress */}
                {imp.status === "processing" && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Behandler...</span>
                      <span>{imp.processed_rows} / {imp.total_rows}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div
                        className="h-2 rounded-full bg-blue-500 transition-all"
                        style={{ width: `${(imp.processed_rows / imp.total_rows) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
                
                {/* Results */}
                {imp.status === "completed" && (
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div className="rounded-lg bg-slate-50 p-2 text-center">
                      <p className="text-slate-500">Totalt</p>
                      <p className="font-semibold text-slate-900">{imp.total_rows}</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-2 text-center">
                      <p className="text-slate-500">Behandlet</p>
                      <p className="font-semibold text-slate-900">{imp.processed_rows}</p>
                    </div>
                    <div className="rounded-lg bg-emerald-50 p-2 text-center">
                      <p className="text-emerald-600">Vellykket</p>
                      <p className="font-semibold text-emerald-700">{imp.success_rows}</p>
                    </div>
                    <div className="rounded-lg bg-red-50 p-2 text-center">
                      <p className="text-red-600">Feil</p>
                      <p className="font-semibold text-red-700">{imp.error_rows}</p>
                    </div>
                  </div>
                )}
                
                {/* Errors */}
                {imp.errors.length > 0 && (
                  <details className="mt-3">
                    <summary className="text-xs text-red-600 cursor-pointer">
                      Vis {imp.errors.length} feil
                    </summary>
                    <ul className="mt-2 text-xs text-slate-600 space-y-1 pl-4">
                      {imp.errors.map((error, idx) => (
                        <li key={idx}>• {error}</li>
                      ))}
                    </ul>
                  </details>
                )}
                
                <p className="text-xs text-slate-400 mt-2">
                  Startet: {new Date(imp.created_at).toLocaleString("nb-NO")}
                  {imp.completed_at && ` • Fullført: ${new Date(imp.completed_at).toLocaleString("nb-NO")}`}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Migration Checklist */}
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Migrerings-sjekkliste</h2>
        <div className="space-y-3">
          <ChecklistItem
            label="Importer kunder fra eksisterende system"
            description="Eksporter fra Fieldd, Excel eller annet CRM"
            completed={imports.some(i => i.category === "customers" && i.status === "completed")}
          />
          <ChecklistItem
            label="Importer kjøretøy"
            description="Koble biler til kundene"
            completed={imports.some(i => i.category === "vehicles" && i.status === "completed")}
          />
          <ChecklistItem
            label="Importer dekksett til dekkhotell"
            description="Eksisterende lagerbeholdning"
            completed={imports.some(i => i.category === "tyres" && i.status === "completed")}
          />
          <ChecklistItem
            label="Importer historiske coating-jobber"
            description="Inkludert garantiinfo og kontrollplan"
            completed={imports.some(i => i.category === "coating" && i.status === "completed")}
          />
          <ChecklistItem
            label="Importer pågående bookinger"
            description="Fremtidige avtaler fra Fieldd"
            completed={imports.some(i => i.category === "bookings" && i.status === "completed")}
          />
          <ChecklistItem
            label="Koble opp betalingsterminal"
            description="iZettle, SumUp eller annen"
            completed={false}
            href="/integrasjoner"
          />
          <ChecklistItem
            label="Koble opp regnskapssystem"
            description="Fiken eller PowerOffice"
            completed={false}
            href="/integrasjoner"
          />
          <ChecklistItem
            label="Sett opp SMS/e-post"
            description="For påminnelser og kommunikasjon"
            completed={false}
            href="/integrasjoner"
          />
        </div>
      </section>

      {/* Upload Modal */}
      {showUploadModal && selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-lg font-semibold">
                Importer {IMPORT_CATEGORIES.find(c => c.key === selectedCategory)?.label}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadFile(null);
                  setSelectedCategory(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="rounded-lg border-2 border-dashed border-slate-300 p-6 text-center">
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="text-3xl mb-2">📄</div>
                  {uploadFile ? (
                    <p className="text-sm font-medium text-slate-900">{uploadFile.name}</p>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-slate-700">
                        Klikk for å velge fil
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        CSV eller Excel-fil
                      </p>
                    </>
                  )}
                </label>
              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-700 mb-2">Forventet format:</p>
                <p className="text-xs text-slate-600">
                  {IMPORT_CATEGORIES.find(c => c.key === selectedCategory)?.template_fields.join(" | ")}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => downloadTemplate(selectedCategory)}
                  className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Last ned mal
                </button>
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={!uploadFile || uploading}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {uploading ? "Laster opp..." : "Start import"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ChecklistItem({
  label,
  description,
  completed,
  href,
}: {
  label: string;
  description: string;
  completed: boolean;
  href?: string;
}) {
  const content = (
    <div className={`flex items-start gap-3 p-3 rounded-lg ${completed ? "bg-emerald-50" : "bg-slate-50"}`}>
      <span className={`text-lg ${completed ? "" : "opacity-30"}`}>
        {completed ? "✅" : "⬜"}
      </span>
      <div className="flex-1">
        <p className={`text-sm font-medium ${completed ? "text-emerald-900" : "text-slate-700"}`}>
          {label}
        </p>
        <p className={`text-xs ${completed ? "text-emerald-700" : "text-slate-500"}`}>
          {description}
        </p>
      </div>
      {href && !completed && (
        <span className="text-xs text-blue-600">Sett opp →</span>
      )}
    </div>
  );

  if (href && !completed) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
