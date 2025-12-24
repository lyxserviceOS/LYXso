"use client";

import { useState, useEffect } from "react";
import { Facebook, Instagram, Image as ImageIcon, Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { getApiBaseUrl } from "@/lib/apiConfig";

interface MetaMarketingProps {
  orgId: string;
}

export default function MetaMarketing({ orgId }: MetaMarketingProps) {
  const [connected, setConnected] = useState(false);
  const [pages, setPages] = useState<any[]>([]);
  const [selectedPage, setSelectedPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const [postData, setPostData] = useState({
    message: "",
    service: "",
    imageUrl: "",
    linkUrl: "",
    scheduled: ""
  });

  const API_BASE = getApiBaseUrl();

  useEffect(() => {
    checkConnection();
  }, [orgId]);

  const checkConnection = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/orgs/${orgId}/marketing/channels`, {
        credentials: 'include'
      });
      const data = await res.json();
      const metaChannel = data.channels?.find((c: any) => c.channel === 'meta');
      setConnected(metaChannel?.isConnected || false);

      if (metaChannel?.isConnected) {
        await loadPages();
      }
    } catch (error) {
      console.error("Error checking connection:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadPages = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/orgs/${orgId}/marketing/meta/pages`, {
        credentials: 'include'
      });

      if (!res.ok) {
        console.error("Failed to load pages");
        return;
      }

      const data = await res.json();
      setPages(data.pages || []);

      if (data.pages && data.pages.length > 0) {
        setSelectedPage(data.pages[0]);
      }
    } catch (error) {
      console.error("Error loading pages:", error);
    }
  };

  const connectMeta = () => {
    window.location.href = `${API_BASE}/api/orgs/${orgId}/marketing/meta/connect`;
  };

  const generateImage = async () => {
    if (!postData.service || !postData.message) {
      alert("Fyll inn tjeneste og melding først");
      return;
    }

    setGenerating(true);

    try {
      const res = await fetch(`${API_BASE}/api/orgs/${orgId}/marketing/generate-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          service: postData.service,
          message: postData.message,
          platform: 'meta',
          tone: 'professional'
        })
      });

      if (!res.ok) throw new Error("Image generation failed");

      const data = await res.json();
      setPostData(prev => ({ ...prev, imageUrl: data.imageUrl }));
      alert("✅ Bilde generert! (Gyldig i 1 time)");
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Kunne ikke generere bilde");
    } finally {
      setGenerating(false);
    }
  };

  const publishPost = async () => {
    if (!selectedPage) {
      alert("Velg en Facebook-side først");
      return;
    }

    if (!postData.message) {
      alert("Skriv en melding");
      return;
    }

    setPublishing(true);

    try {
      const res = await fetch(`${API_BASE}/api/orgs/${orgId}/marketing/meta/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          pageId: selectedPage.id,
          message: postData.message,
          imageUrl: postData.imageUrl || undefined,
          linkUrl: postData.linkUrl || undefined,
          scheduled: postData.scheduled || undefined
        })
      });

      if (!res.ok) throw new Error("Publishing failed");

      const data = await res.json();
      alert(`✅ ${data.message}`);
      
      // Reset form
      setPostData({
        message: "",
        service: "",
        imageUrl: "",
        linkUrl: "",
        scheduled: ""
      });
    } catch (error) {
      console.error("Error publishing:", error);
      alert("Kunne ikke publisere innlegg");
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white text-center">
          <Facebook className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Koble til Meta</h2>
          <p className="mb-6 opacity-90">
            Publiser AI-genererte innlegg til Facebook og Instagram
          </p>
          <button
            onClick={connectMeta}
            className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Koble til Facebook
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meta Marketing</h1>
          <p className="text-sm text-gray-500">Facebook & Instagram</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-green-600">
          <CheckCircle className="w-4 h-4" />
          <span>Tilkoblet</span>
        </div>
      </div>

      {/* Page Selector */}
      {pages.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-2">Velg Facebook-side</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pages.map((page) => (
              <button
                key={page.id}
                onClick={() => setSelectedPage(page)}
                className={`flex items-center gap-3 p-4 border-2 rounded-lg transition ${
                  selectedPage?.id === page.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                {page.pictureUrl && (
                  <img
                    src={page.pictureUrl}
                    alt={page.name}
                    className="w-12 h-12 rounded-full"
                  />
                )}
                <div className="flex-1 text-left">
                  <p className="font-semibold text-gray-900">{page.name}</p>
                  <p className="text-xs text-gray-500">{page.category}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Create Post */}
      <div className="bg-white border rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold">Opprett innlegg</h2>

        {/* Service (for AI image generation) */}
        <div>
          <label className="block text-sm font-medium mb-1">Tjeneste (for AI-bilde)</label>
          <input
            type="text"
            value={postData.service}
            onChange={(e) => setPostData(prev => ({ ...prev, service: e.target.value }))}
            placeholder="F.eks. Vask & Voks, Coating, Dekkskift"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium mb-1">Melding</label>
          <textarea
            value={postData.message}
            onChange={(e) => setPostData(prev => ({ ...prev, message: e.target.value }))}
            placeholder="Skriv din melding her..."
            rows={4}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Image Generation */}
        <div>
          <label className="block text-sm font-medium mb-1">Bilde</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={postData.imageUrl}
              onChange={(e) => setPostData(prev => ({ ...prev, imageUrl: e.target.value }))}
              placeholder="Bilde-URL eller generer med AI"
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={generateImage}
              disabled={generating || !postData.service || !postData.message}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 flex items-center gap-2"
            >
              {generating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ImageIcon className="w-4 h-4" />
              )}
              Generer med AI
            </button>
          </div>
          {postData.imageUrl && (
            <div className="mt-2">
              <img
                src={postData.imageUrl}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg border"
              />
            </div>
          )}
        </div>

        {/* Link URL */}
        <div>
          <label className="block text-sm font-medium mb-1">Link (valgfritt)</label>
          <input
            type="url"
            value={postData.linkUrl}
            onChange={(e) => setPostData(prev => ({ ...prev, linkUrl: e.target.value }))}
            placeholder="https://..."
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Scheduled */}
        <div>
          <label className="block text-sm font-medium mb-1">Planlegg (valgfritt)</label>
          <input
            type="datetime-local"
            value={postData.scheduled}
            onChange={(e) => setPostData(prev => ({ ...prev, scheduled: e.target.value }))}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Publish Button */}
        <button
          onClick={publishPost}
          disabled={publishing || !postData.message || !selectedPage}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 flex items-center justify-center gap-2"
        >
          {publishing ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
          {postData.scheduled ? 'Planlegg innlegg' : 'Publiser nå'}
        </button>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-semibold mb-1">Tips for best resultat:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-800">
              <li>Bruk AI til å generere profesjonelle bilder</li>
              <li>Skriv engasjerende tekst med call-to-action</li>
              <li>Planlegg innlegg for optimal timing</li>
              <li>DALL-E bilder er gyldige i 1 time - last ned hvis du vil beholde dem</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
