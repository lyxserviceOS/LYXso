"use client";

import React, { useState } from "react";
import { useOrgPlan } from "@/components/OrgPlanContext";
import { PARTNER_DEFINITIONS, type ProductCategory } from "@/types/product";
import SupplierKeysManager from "./components/SupplierKeysManager";
import ProductList from "./components/ProductList";
import OrderList from "./components/OrderList";
import VisibilityRulesManager from "./components/VisibilityRulesManager";
import BulkImportManager from "./components/advanced/BulkImportManager";
import DiscountManager from "./components/advanced/DiscountManager";
import InventoryTracker from "./components/advanced/InventoryTracker";

type TabKey = "oversikt" | "egne-produkter" | "partnere" | "ordrer" | "innstillinger" | "leverandorer" | "avansert";

const CATEGORIES: { code: ProductCategory; label: string }[] = [
  { code: "dekk", label: "Dekk" },
  { code: "felger", label: "Felger" },
  { code: "bilpleie", label: "Bilpleie" },
  { code: "tilbehor", label: "Tilbehør" },
  { code: "verksted", label: "Verksteddeler" },
  { code: "vedlikehold", label: "Vedlikehold" },
  { code: "annet", label: "Annet" },
];

export default function NettbutikkPageClient() {
  const { org, loading } = useOrgPlan();
  const [activeTab, setActiveTab] = useState<TabKey>("oversikt");

  // Check if webshop is enabled
  const webshopEnabled = org?.webshopEnabled ?? false;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-slate-400">Laster nettbutikk...</p>
      </div>
    );
  }

  if (!webshopEnabled) {
    return (
      <div className="space-y-6">
        <header>
          <h1 className="text-lg font-semibold text-slate-100">Nettbutikk</h1>
          <p className="text-sm text-slate-400">
            Selg produkter direkte fra landingssiden din.
          </p>
        </header>

        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-6 text-center">
          <p className="text-sm text-amber-200">
            Nettbutikk er ikke aktivert for din bedrift.
          </p>
          <p className="mt-2 text-xs text-amber-200/80">
            Gå til <strong>Innstillinger → Moduler</strong> for å aktivere nettbutikk,
            eller aktiver den under onboarding.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-lg font-semibold text-slate-100">Nettbutikk</h1>
        <p className="text-sm text-slate-400">
          Administrer produkter, priser og ordrer for nettbutikken din.
        </p>
      </header>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 rounded-lg bg-slate-800 p-1">
        {[
          { key: "oversikt", label: "Oversikt" },
          { key: "egne-produkter", label: "Egne produkter" },
          { key: "partnere", label: "Partnerprodukter" },
          { key: "leverandorer", label: "Leverandører" },
          { key: "ordrer", label: "Ordrer" },
          { key: "innstillinger", label: "Innstillinger" },
          { key: "avansert", label: "Avansert" },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key as TabKey)}
            className={`flex-1 rounded-md px-3 py-2 text-xs font-medium transition ${
              activeTab === tab.key
                ? "bg-slate-700 text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Oversikt Tab */}
      {activeTab === "oversikt" && (
        <div className="space-y-4">
          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Egne produkter" value="0" trend="—" />
            <StatCard label="Partnerprodukter" value="0" trend="—" />
            <StatCard label="Ordrer denne måneden" value="0" trend="—" />
            <StatCard label="Omsetning" value="kr 0" trend="—" />
          </div>

          {/* Quick actions */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <h2 className="text-sm font-semibold text-slate-100 mb-3">
              Kom i gang
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <ActionCard
                title="Legg til produkt"
                description="Legg til dine egne produkter fra eget lager."
                onClick={() => setActiveTab("egne-produkter")}
              />
              <ActionCard
                title="Aktiver partnerprodukter"
                description="Velg produkter fra våre partnere å selge."
                onClick={() => setActiveTab("partnere")}
              />
              <ActionCard
                title="Konfigurer butikk"
                description="Sett opp frakt, priser og visningsinnstillinger."
                onClick={() => setActiveTab("innstillinger")}
              />
            </div>
          </div>
        </div>
      )}

      {/* Egne produkter Tab */}
      {activeTab === "egne-produkter" && <ProductList />}

      {/* Partnerprodukter Tab */}
      {activeTab === "partnere" && (
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">
              Partnerprodukter
            </h2>
            <p className="text-xs text-slate-400">
              Produkter fra LYXso-partnere som du kan selge via nettbutikken din
            </p>
          </div>

          {/* Partner list */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PARTNER_DEFINITIONS.map((partner) => (
              <div
                key={partner.slug}
                className="rounded-xl border border-slate-800 bg-slate-950/60 p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-100">
                      {partner.name}
                    </h3>
                    <span className="mt-1 inline-block rounded-full bg-slate-700 px-2 py-0.5 text-[10px] text-slate-300">
                      {partner.type}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-blue-500 hover:text-blue-400"
                  >
                    Aktiver
                  </button>
                </div>
                <p className="mt-2 text-xs text-slate-400">
                  {partner.description}
                </p>
                <p className="mt-2 text-[10px] text-slate-500">
                  Anbefalt for: {partner.target_industries.join(", ")}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-3">
            <p className="text-xs text-blue-200">
              <strong>Tips:</strong> Når du aktiverer en partner, blir deres 
              produktkatalog tilgjengelig i nettbutikken din. Du kan velge 
              egne priser og hvilke produkter som skal vises.
            </p>
          </div>
        </div>
      )}

      {/* Leverandører Tab */}
      {activeTab === "leverandorer" && (
        <SupplierKeysManager />
      )}

      {/* Ordrer Tab */}
      {activeTab === "ordrer" && <OrderList />}

      {/* Innstillinger Tab */}
        {/* Removed the legacy settings block */}

      {/* Avansert Tab */}
      {activeTab === "avansert" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-100">
              Avanserte funksjoner
            </h2>
            <p className="text-sm text-slate-400">
              Kraftige verktøy for å administrere nettbutikken din
            </p>
          </div>

          {/* Advanced Tools */}
          <div className="space-y-6">
            {/* Bulk Import */}
            <BulkImportManager />
            
            {/* Discount Codes */}
            <DiscountManager />
            
            {/* Inventory Tracking */}
            <InventoryTracker />
          </div>
        </div>
      )}
    </div>
  );
}

// Helper components
function StatCard({ label, value, trend }: { label: string; value: string; trend: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
      <p className="text-[10px] uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-slate-100">{value}</p>
      <p className="mt-1 text-[11px] text-slate-400">{trend}</p>
    </div>
  );
}

function ActionCard({ 
  title, 
  description, 
  onClick 
}: { 
  title: string; 
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg border border-slate-700 bg-slate-900/50 p-4 text-left hover:border-blue-500/50 transition"
    >
      <h3 className="text-sm font-medium text-slate-100">{title}</h3>
      <p className="mt-1 text-xs text-slate-400">{description}</p>
    </button>
  );
}
