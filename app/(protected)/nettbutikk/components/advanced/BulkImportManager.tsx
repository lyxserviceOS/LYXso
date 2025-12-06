"use client";

import React, { useState } from "react";

type BulkImportFormat = "csv" | "excel" | "json";

export default function BulkImportManager() {
  const [format, setFormat] = useState<BulkImportFormat>("csv");
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{ success: number; errors: string[] } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResults(null);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    setProgress(0);
    setResults(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("format", format);

    try {
      const response = await fetch("/api/webshop/products/bulk-import", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setResults({
          success: data.imported || 0,
          errors: data.errors || [],
        });
        setFile(null);
      } else {
        setResults({
          success: 0,
          errors: [data.error || "Import failed"],
        });
      }
    } catch (error) {
      setResults({
        success: 0,
        errors: ["Network error during import"],
      });
    } finally {
      setImporting(false);
      setProgress(100);
    }
  };

  const downloadTemplate = () => {
    const template = format === "csv"
      ? "sku,name,description,price,category,stock,tags\nSKU001,Product Name,Description,1000,dekk,50,premium\n"
      : JSON.stringify([
          {
            sku: "SKU001",
            name: "Product Name",
            description: "Description",
            price: 1000,
            category: "dekk",
            stock: 50,
            tags: ["premium"],
          },
        ], null, 2);

    const blob = new Blob([template], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `template.${format === "csv" ? "csv" : "json"}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-100">
          Masseopplasting av produkter
        </h2>
        <p className="text-sm text-slate-400">
          Last opp flere produkter samtidig via fil
        </p>
      </div>

      {/* Format Selection */}
      <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-6 space-y-4">
        <div>
          <label className="block text-sm text-slate-300 mb-2">
            Velg filformat
          </label>
          <div className="flex gap-3">
            {[
              { value: "csv", label: "CSV" },
              { value: "excel", label: "Excel" },
              { value: "json", label: "JSON" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFormat(opt.value as BulkImportFormat)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  format === opt.value
                    ? "bg-blue-600 text-white"
                    : "border border-slate-700 text-slate-300 hover:bg-slate-800"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <button
            onClick={downloadTemplate}
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            📥 Last ned mal for {format.toUpperCase()}
          </button>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm text-slate-300 mb-2">
            Velg fil
          </label>
          <input
            type="file"
            accept={format === "csv" ? ".csv" : format === "excel" ? ".xlsx,.xls" : ".json"}
            onChange={handleFileChange}
            className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-300"
          />
          {file && (
            <p className="mt-2 text-xs text-slate-400">
              Valgt fil: {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </p>
          )}
        </div>

        {/* Import Button */}
        <button
          onClick={handleImport}
          disabled={!file || importing}
          className="w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500"
        >
          {importing ? `Importerer... ${progress}%` : "Start import"}
        </button>
      </div>

      {/* Progress */}
      {importing && (
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-6">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent" />
            <span className="text-sm text-slate-300">Importerer produkter...</span>
          </div>
          <div className="mt-4 h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Results */}
      {results && (
        <div className={`rounded-xl border p-6 ${
          results.errors.length === 0
            ? "border-emerald-500/30 bg-emerald-500/10"
            : "border-yellow-500/30 bg-yellow-500/10"
        }`}>
          <h3 className="text-sm font-semibold text-slate-100 mb-3">
            Import fullført
          </h3>
          <p className="text-sm text-emerald-400 mb-2">
            ✓ {results.success} produkter importert
          </p>
          {results.errors.length > 0 && (
            <div>
              <p className="text-sm text-yellow-400 mb-2">
                ⚠ {results.errors.length} feil oppstod
              </p>
              <ul className="space-y-1 text-xs text-slate-400">
                {results.errors.slice(0, 10).map((error, idx) => (
                  <li key={idx}>• {error}</li>
                ))}
                {results.errors.length > 10 && (
                  <li className="text-slate-500">
                    ... og {results.errors.length - 10} flere
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
        <h4 className="text-sm font-semibold text-blue-200 mb-2">
          Tips for import
        </h4>
        <ul className="space-y-1 text-xs text-blue-200/80">
          <li>• Last ned malen for riktig format</li>
          <li>• SKU må være unike</li>
          <li>• Priser angis i NOK</li>
          <li>• Kategorier: dekk, felger, bilpleie, tilbehor, verksted, vedlikehold</li>
          <li>• Tags skilles med komma</li>
        </ul>
      </div>
    </div>
  );
}
