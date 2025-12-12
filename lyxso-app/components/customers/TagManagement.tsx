"use client";

import { useState, useEffect } from "react";
import { Plus, X, Edit2, Check } from "lucide-react";
import * as Sentry from "@sentry/nextjs";

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface Props {
  customerId?: string;
  selectedTags?: string[];
  onTagsChange?: (tagIds: string[]) => void;
}

const PRESET_COLORS = [
  "#EF4444", // red
  "#F59E0B", // amber
  "#10B981", // emerald
  "#3B82F6", // blue
  "#8B5CF6", // violet
  "#EC4899", // pink
  "#6B7280", // gray
  "#14B8A6", // teal
];

export default function TagManagement({ customerId, selectedTags = [], onTagsChange }: Props) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState(PRESET_COLORS[0]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/tags`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Kunne ikke hente tags");
      }

      const data = await response.json();
      setTags(data.tags || []);
    } catch (err) {
      console.error("Error fetching tags:", err);
      Sentry.captureException(err);
      setError("Kunne ikke laste tags");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;

    setSaving(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/api/tags`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newTagName.trim(),
          color: newTagColor,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Kunne ikke opprette tag");
      }

      await fetchTags();
      setNewTagName("");
      setNewTagColor(PRESET_COLORS[0]);
      setShowCreateForm(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Feil ved opprettelse av tag";
      setError(errorMessage);
      Sentry.captureException(err);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateTag = async (tagId: string, name: string, color: string) => {
    setSaving(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/api/tags/${tagId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, color }),
      });

      if (!response.ok) {
        throw new Error("Kunne ikke oppdatere tag");
      }

      await fetchTags();
      setEditingTag(null);
    } catch (err) {
      setError("Feil ved oppdatering av tag");
      Sentry.captureException(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    if (!confirm("Er du sikker på at du vil slette denne taggen?")) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/tags/${tagId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Kunne ikke slette tag");
      }

      await fetchTags();
    } catch (err) {
      setError("Feil ved sletting av tag");
      Sentry.captureException(err);
    }
  };

  const toggleTag = (tagId: string) => {
    if (!onTagsChange) return;

    const newTags = selectedTags.includes(tagId)
      ? selectedTags.filter((id) => id !== tagId)
      : [...selectedTags, tagId];

    onTagsChange(newTags);
  };

  if (loading) {
    return <div className="text-sm text-slate-600">Laster tags...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-slate-900">Tags</h3>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
        >
          <Plus className="h-4 w-4" />
          Ny tag
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-2">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Create Form */}
      {showCreateForm && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Navn
            </label>
            <input
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="VIP-kunde, Haster, etc."
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              disabled={saving}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Farge
            </label>
            <div className="flex gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setNewTagColor(color)}
                  className={`h-8 w-8 rounded-full transition-transform ${
                    newTagColor === color ? "ring-2 ring-offset-2 ring-blue-600 scale-110" : ""
                  }`}
                  style={{ backgroundColor: color }}
                  disabled={saving}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCreateTag}
              disabled={saving || !newTagName.trim()}
              className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Oppretter..." : "Opprett"}
            </button>
            <button
              onClick={() => {
                setShowCreateForm(false);
                setNewTagName("");
              }}
              disabled={saving}
              className="flex-1 rounded-md bg-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-300"
            >
              Avbryt
            </button>
          </div>
        </div>
      )}

      {/* Tag List */}
      <div className="space-y-2">
        {tags.map((tag) => (
          <div
            key={tag.id}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-2"
          >
            {customerId && (
              <input
                type="checkbox"
                checked={selectedTags.includes(tag.id)}
                onChange={() => toggleTag(tag.id)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
            )}

            <div
              className="h-6 w-6 rounded-full flex-shrink-0"
              style={{ backgroundColor: tag.color }}
            />

            {editingTag?.id === tag.id ? (
              <>
                <input
                  type="text"
                  value={editingTag.name}
                  onChange={(e) =>
                    setEditingTag({ ...editingTag, name: e.target.value })
                  }
                  className="flex-1 rounded border border-slate-300 px-2 py-1 text-sm"
                />
                <button
                  onClick={() =>
                    handleUpdateTag(editingTag.id, editingTag.name, editingTag.color)
                  }
                  className="p-1 text-green-600 hover:text-green-700"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setEditingTag(null)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </>
            ) : (
              <>
                <span className="flex-1 text-sm text-slate-900">{tag.name}</span>
                <button
                  onClick={() => setEditingTag(tag)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteTag(tag.id)}
                  className="p-1 text-slate-400 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      {tags.length === 0 && !showCreateForm && (
        <div className="rounded-lg bg-slate-50 border border-slate-200 p-6 text-center">
          <p className="text-sm text-slate-600">Ingen tags opprettet ennå</p>
          <p className="text-xs text-slate-500 mt-1">
            Opprett tags for å kategorisere kunder
          </p>
        </div>
      )}
    </div>
  );
}
