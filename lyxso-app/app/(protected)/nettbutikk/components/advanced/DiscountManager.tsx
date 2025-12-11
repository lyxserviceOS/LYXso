"use client";

import React, { useState } from "react";

type DiscountType = "percentage" | "fixed" | "freeShipping";
type DiscountCondition = "minAmount" | "categorySpecific" | "productSpecific" | "customerType";

type Discount = {
  id: string;
  code: string;
  type: DiscountType;
  value: number;
  conditions: DiscountCondition[];
  minAmount?: number;
  categories?: string[];
  products?: string[];
  customerTypes?: string[];
  startDate: string;
  endDate?: string;
  usageLimit?: number;
  usageCount: number;
  active: boolean;
};

export default function DiscountManager() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  
  const [form, setForm] = useState({
    code: "",
    type: "percentage" as DiscountType,
    value: 10,
    minAmount: 0,
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    usageLimit: 0,
  });

  const createDiscount = async () => {
    try {
      const response = await fetch("/api/webshop/discounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setShowForm(false);
        // Refresh list
      }
    } catch (error) {
      console.error("Failed to create discount:", error);
    }
  };

  const toggleDiscount = async (id: string, active: boolean) => {
    try {
      await fetch(`/api/webshop/discounts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !active }),
      });
      // Refresh list
    } catch (error) {
      console.error("Failed to toggle discount:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">
            Rabattkoder
          </h2>
          <p className="text-sm text-slate-400">
            Administrer kampanjer og rabattkoder
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Opprett rabattkode
        </button>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-6 space-y-4">
          <h3 className="text-sm font-semibold text-slate-100">
            {editingDiscount ? "Rediger rabattkode" : "Opprett rabattkode"}
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Rabattkode *
              </label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="SOMMER2024"
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white uppercase"
              />
              <p className="mt-1 text-xs text-slate-500">
                Kunden oppgir denne koden ved kassen
              </p>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Type rabatt *
              </label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as DiscountType })}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
              >
                <option value="percentage">Prosent</option>
                <option value="fixed">Fast beløp</option>
                <option value="freeShipping">Gratis frakt</option>
              </select>
            </div>

            {form.type !== "freeShipping" && (
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  {form.type === "percentage" ? "Prosent" : "Beløp (NOK)"} *
                </label>
                <input
                  type="number"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: parseInt(e.target.value) })}
                  min={0}
                  max={form.type === "percentage" ? 100 : undefined}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
                />
              </div>
            )}

            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Minimumsbeløp (NOK)
              </label>
              <input
                type="number"
                value={form.minAmount}
                onChange={(e) => setForm({ ...form, minAmount: parseInt(e.target.value) })}
                min={0}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
              />
              <p className="mt-1 text-xs text-slate-500">
                0 = ingen minimumskrav
              </p>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Startdato *
              </label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Sluttdato (valgfritt)
              </label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Maks antall bruk
              </label>
              <input
                type="number"
                value={form.usageLimit}
                onChange={(e) => setForm({ ...form, usageLimit: parseInt(e.target.value) })}
                min={0}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
              />
              <p className="mt-1 text-xs text-slate-500">
                0 = ubegrenset
              </p>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowForm(false)}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800"
            >
              Avbryt
            </button>
            <button
              onClick={createDiscount}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              {editingDiscount ? "Lagre endringer" : "Opprett rabattkode"}
            </button>
          </div>
        </div>
      )}

      {/* Discounts List */}
      <div className="space-y-3">
        {discounts.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-12 text-center">
            <p className="text-sm text-slate-400">Ingen rabattkoder opprettet ennå</p>
          </div>
        ) : (
          discounts.map((discount) => {
            const isExpired = discount.endDate && new Date(discount.endDate) < new Date();
            const isLimitReached = discount.usageLimit && discount.usageCount >= discount.usageLimit;
            
            return (
              <div
                key={discount.id}
                className="rounded-xl border border-slate-800 bg-slate-950/60 p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <code className="rounded bg-slate-800 px-2 py-1 text-sm font-mono text-blue-400">
                        {discount.code}
                      </code>
                      <span className={`rounded-full px-2 py-0.5 text-xs ${
                        !discount.active
                          ? "bg-slate-700 text-slate-400"
                          : isExpired || isLimitReached
                          ? "bg-red-500/20 text-red-400"
                          : "bg-emerald-500/20 text-emerald-400"
                      }`}>
                        {!discount.active
                          ? "Inaktiv"
                          : isExpired
                          ? "Utløpt"
                          : isLimitReached
                          ? "Brukt opp"
                          : "Aktiv"}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-400">
                      <span>
                        {discount.type === "percentage"
                          ? `${discount.value}% rabatt`
                          : discount.type === "fixed"
                          ? `kr ${discount.value} rabatt`
                          : "Gratis frakt"}
                      </span>
                      {discount.minAmount && discount.minAmount > 0 && (
                        <span>• Min. kjøp: kr {discount.minAmount}</span>
                      )}
                      <span>
                        • {new Date(discount.startDate).toLocaleDateString()}
                        {discount.endDate && ` - ${new Date(discount.endDate).toLocaleDateString()}`}
                      </span>
                      <span>
                        • Brukt: {discount.usageCount}
                        {discount.usageLimit ? ` / ${discount.usageLimit}` : ""}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleDiscount(discount.id, discount.active)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                        discount.active
                          ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
                          : "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                      }`}
                    >
                      {discount.active ? "Deaktiver" : "Aktiver"}
                    </button>
                    <button
                      onClick={() => {
                        setEditingDiscount(discount);
                        setShowForm(true);
                      }}
                      className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700"
                    >
                      Rediger
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Tips */}
      <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
        <h4 className="text-sm font-semibold text-blue-200 mb-2">
          Tips for rabattkoder
        </h4>
        <ul className="space-y-1 text-xs text-blue-200/80">
          <li>• Bruk korte, lett å huske koder (f.eks. SOMMER2024)</li>
          <li>• Sett minimumsbeløp for å øke ordreværdi</li>
          <li>• Begrens antall bruk for tidsbegrensede kampanjer</li>
          <li>• Kombiner med e-postmarkedsføring for beste effekt</li>
          <li>• Følg med på bruk og juster tilbudet underveis</li>
        </ul>
      </div>
    </div>
  );
}
