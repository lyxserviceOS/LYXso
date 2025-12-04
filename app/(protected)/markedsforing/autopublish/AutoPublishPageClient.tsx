// app/(protected)/markedsforing/autopublish/AutoPublishPageClient.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { getApiBaseUrl } from '@/lib/apiConfig';

const API_BASE = getApiBaseUrl();
const ORG_ID = process.env.NEXT_PUBLIC_ORG_ID;

type AutoPublishConfig = {
  enabled: boolean;
  frequency: 'daily' | 'twice_weekly' | 'weekly';
  platforms: string[];
  require_approval: boolean;
  categories: string[];
};

type ScheduledPost = {
  id: string;
  platform: string;
  status: 'pending_approval' | 'scheduled' | 'published' | 'failed';
  content_text: string;
  content_hashtags: string[];
  image_url: string;
  scheduled_for: string;
  published_at?: string;
  generated_by_ai: boolean;
};

export default function AutoPublishPageClient() {
  const [config, setConfig] = useState<AutoPublishConfig>({
    enabled: false,
    frequency: 'weekly',
    platforms: ['meta'],
    require_approval: true,
    categories: ['bilpleie', 'polering', 'dekkskift']
  });
  
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchConfig();
    fetchScheduledPosts();
  }, []);

  async function fetchConfig() {
    try {
      const res = await fetch(`${API_BASE}/api/orgs/${ORG_ID}/marketing/autopublish/config`);
      if (res.ok) {
        const data = await res.json();
        setConfig(data.config || config);
      }
    } catch (err) {
      console.error('Error fetching config:', err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchScheduledPosts() {
    try {
      const res = await fetch(`${API_BASE}/api/orgs/${ORG_ID}/marketing/autopublish/queue`);
      if (res.ok) {
        const data = await res.json();
        setScheduledPosts(data.posts || []);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  }

  async function saveConfig() {
    setSaving(true);
    setError(null);
    
    try {
      const res = await fetch(`${API_BASE}/api/orgs/${ORG_ID}/marketing/autopublish/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config })
      });

      if (!res.ok) {
        throw new Error('Kunne ikke lagre konfigurasjon');
      }

      alert('Konfigurasjon lagret!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function approvePost(postId: string) {
    try {
      const res = await fetch(`${API_BASE}/api/orgs/${ORG_ID}/marketing/posts/${postId}/approve`, {
        method: 'POST'
      });

      if (res.ok) {
        fetchScheduledPosts();
      }
    } catch (err) {
      console.error('Error approving post:', err);
    }
  }

  async function rejectPost(postId: string) {
    try {
      const res = await fetch(`${API_BASE}/api/orgs/${ORG_ID}/marketing/posts/${postId}/reject`, {
        method: 'POST'
      });

      if (res.ok) {
        fetchScheduledPosts();
      }
    } catch (err) {
      console.error('Error rejecting post:', err);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const pendingApproval = scheduledPosts.filter(p => p.status === 'pending_approval');
  const scheduled = scheduledPosts.filter(p => p.status === 'scheduled');
  const published = scheduledPosts.filter(p => p.status === 'published');

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Auto-Publishing 🤖</h1>
        <p className="text-slate-600">Automatisk publisering til sosiale medier med AI</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Configuration */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-6">
        <h2 className="text-xl font-semibold text-slate-900">Konfigurasjon</h2>

        {/* Enable/Disable */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-slate-900">Auto-Publishing</h3>
            <p className="text-sm text-slate-600">Automatisk publiser innhold fra Dropbox</p>
          </div>
          <button
            onClick={() => setConfig({...config, enabled: !config.enabled})}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              config.enabled ? 'bg-blue-600' : 'bg-slate-300'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              config.enabled ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>

        {config.enabled && (
          <>
            {/* Frequency */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Publiseringsfrekvens
              </label>
              <select
                value={config.frequency}
                onChange={(e) => setConfig({...config, frequency: e.target.value as any})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="daily">Daglig</option>
                <option value="twice_weekly">2x per uke</option>
                <option value="weekly">Ukentlig</option>
              </select>
            </div>

            {/* Platforms */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Plattformer
              </label>
              <div className="space-y-2">
                {['meta', 'google', 'tiktok'].map(platform => (
                  <label key={platform} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config.platforms.includes(platform)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setConfig({...config, platforms: [...config.platforms, platform]});
                        } else {
                          setConfig({...config, platforms: config.platforms.filter(p => p !== platform)});
                        }
                      }}
                      className="h-4 w-4 text-blue-600 border-slate-300 rounded"
                    />
                    <span className="ml-2 text-sm text-slate-700 capitalize">{platform}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Approval */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-slate-900">Krev godkjenning</h3>
                <p className="text-sm text-slate-600">Godkjenn innlegg manuelt før publisering</p>
              </div>
              <button
                onClick={() => setConfig({...config, require_approval: !config.require_approval})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.require_approval ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  config.require_approval ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {/* Save Button */}
            <button
              onClick={saveConfig}
              disabled={saving}
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-400 transition-colors"
            >
              {saving ? 'Lagrer...' : 'Lagre konfigurasjon'}
            </button>
          </>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-600">Venter godkjenning</p>
          <p className="text-2xl font-bold text-amber-600">{pendingApproval.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-600">Planlagt</p>
          <p className="text-2xl font-bold text-blue-600">{scheduled.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-600">Publisert</p>
          <p className="text-2xl font-bold text-emerald-600">{published.length}</p>
        </div>
      </div>

      {/* Pending Approval */}
      {pendingApproval.length > 0 && (
        <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">Venter godkjenning</h2>
          
          <div className="space-y-4">
            {pendingApproval.map(post => (
              <div key={post.id} className="border border-slate-200 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-4">
                  {post.image_url && (
                    <img 
                      src={post.image_url} 
                      alt="Post" 
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <p className="text-slate-900">{post.content_text}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {post.content_hashtags.map((tag, i) => (
                        <span key={i} className="text-blue-600 text-sm">#{tag}</span>
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      Planlagt: {new Date(post.scheduled_for).toLocaleString('nb-NO')}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => approvePost(post.id)}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm"
                  >
                    ✓ Godkjenn
                  </button>
                  <button
                    onClick={() => rejectPost(post.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                  >
                    ✗ Avvis
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scheduled Posts */}
      {scheduled.length > 0 && (
        <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">Planlagte innlegg</h2>
          
          <div className="space-y-3">
            {scheduled.map(post => (
              <div key={post.id} className="border border-slate-200 rounded-lg p-3 flex items-center gap-3">
                {post.image_url && (
                  <img src={post.image_url} alt="Post" className="w-16 h-16 rounded object-cover" />
                )}
                <div className="flex-1">
                  <p className="text-sm text-slate-900">{post.content_text.substring(0, 100)}...</p>
                  <p className="text-xs text-slate-500">
                    {new Date(post.scheduled_for).toLocaleString('nb-NO')}
                  </p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  Planlagt
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
