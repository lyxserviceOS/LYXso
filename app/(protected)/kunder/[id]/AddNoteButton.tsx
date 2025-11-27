"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCustomerNote } from "@/repos/customersRepo";

type AddNoteButtonProps = {
  customerId: string;
};

export default function AddNoteButton({ customerId }: AddNoteButtonProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [note, setNote] = useState("");
  const [isInternal, setIsInternal] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    const trimmedNote = note.trim();
    if (!trimmedNote) {
      setError("Notat kan ikke være tomt.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await createCustomerNote(customerId, {
        note: trimmedNote,
        isInternal,
      });

      setNote("");
      setShowModal(false);
      router.refresh(); // Reload page to show new note
    } catch (err) {
      console.error("Failed to create note:", err);
      setError("Kunne ikke lagre notat. Prøv igjen.");
    } finally {
      setSaving(false);
    }
  }

  function handleClose() {
    if (saving) return;
    setShowModal(false);
    setNote("");
    setError(null);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        Nytt notat
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white shadow-xl">
            <div className="border-b border-slate-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Legg til notat
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Skriv et internt eller eksternt notat til denne kunden.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Notat
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={5}
                    placeholder="Skriv notat her..."
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={saving}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isInternal"
                    checked={isInternal}
                    onChange={(e) => setIsInternal(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    disabled={saving}
                  />
                  <label
                    htmlFor="isInternal"
                    className="text-sm text-slate-700"
                  >
                    Internt notat (ikke synlig for kunde)
                  </label>
                </div>

                {error && (
                  <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                    {error}
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={saving}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Avbryt
                </button>
                <button
                  type="submit"
                  disabled={saving || !note.trim()}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? "Lagrer..." : "Lagre notat"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
