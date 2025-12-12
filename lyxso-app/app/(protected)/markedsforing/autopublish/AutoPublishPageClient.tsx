// app/(protected)/markedsforing/autopublish/AutoPublishPageClient.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { getApiBaseUrl } from '@/lib/apiConfig';
import PublishingCalendar from '@/components/marketing/PublishingCalendar';
import { Sparkles, Upload, Calendar, Eye, TrendingUp, DollarSign, CheckCircle, AlertCircle, X } from 'lucide-react';

const API_BASE = getApiBaseUrl();
const ORG_ID = process.env.NEXT_PUBLIC_ORG_ID;

type AutoPublishConfig = {
  enabled: boolean;
  frequency: 'daily' | 'twice_weekly' | 'weekly' | 'custom';
  platforms: string[];
  require_approval: boolean;
  categories: string[];
  use_ai_content: boolean;
  use_cloud_storage: boolean;
  ad_budget?: number;
  auto_ad_management: boolean;
};

type ScheduledPost = {
  id: string;
  platform: string;
  status: 'pending_approval' | 'scheduled' | 'published' | 'failed';
  content_text: string;
  content_hashtags: string[];
  image_url?: string;
  video_url?: string;
  scheduled_for: string;
  published_at?: string;
  generated_by_ai: boolean;
  is_ad?: boolean;
  ad_budget?: number;
};

type MediaFile = {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video';
  thumbnail?: string;
};

export default function AutoPublishPageClient() {
  const [config, setConfig] = useState<AutoPublishConfig>({
    enabled: false,
    frequency: 'custom',
    platforms: ['meta'],
    require_approval: true,
    categories: ['bilpleie', 'polering', 'dekkskift'],
    use_ai_content: true,
    use_cloud_storage: true,
    ad_budget: 0,
    auto_ad_management: false
  });
  
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewPost, setPreviewPost] = useState<ScheduledPost | null>(null);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [showAdSetup, setShowAdSetup] = useState(false);

  useEffect(() => {
    fetchConfig();
    fetchScheduledPosts();
    fetchMediaFiles();
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

  async function fetchMediaFiles() {
    try {
      const res = await fetch(`${API_BASE}/api/orgs/${ORG_ID}/marketing/media`);
      if (res.ok) {
        const data = await res.json();
        setMediaFiles(data.files || []);
      }
    } catch (err) {
      console.error('Error fetching media:', err);
    }
  }

  async function generateAIContent() {
    setAiGenerating(true);
    try {
      const res = await fetch(`${API_BASE}/api/orgs/${ORG_ID}/marketing/ai/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categories: config.categories,
          platform: 'facebook',
          count: selectedDates.length
        })
      });

      if (!res.ok) throw new Error('Kunne ikke generere innhold');
      
      const data = await res.json();
      return data.posts;
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setAiGenerating(false);
    }
  }

  async function createScheduledPosts() {
    if (selectedDates.length === 0) {
      setError('Velg minst én publiseringsdato');
      return;
    }

    if (config.use_cloud_storage && selectedMedia.length === 0) {
      setError('Velg minst ett medieelement fra skylagring');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      let contentPosts = [];
      
      if (config.use_ai_content) {
        contentPosts = await generateAIContent();
      }

      const posts = selectedDates.map((date, index) => ({
        platform: config.platforms[0] || 'meta',
        scheduled_for: date,
        content_text: contentPosts[index]?.text || '',
        content_hashtags: contentPosts[index]?.hashtags || [],
        media_url: selectedMedia[index % selectedMedia.length],
        require_approval: config.require_approval,
        is_ad: showAdSetup,
        ad_budget: showAdSetup ? config.ad_budget : 0
      }));

      const res = await fetch(`${API_BASE}/api/orgs/${ORG_ID}/marketing/autopublish/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ posts })
      });

      if (!res.ok) throw new Error('Kunne ikke planlegge innlegg');

      await fetchScheduledPosts();
      setSelectedDates([]);
      setSelectedMedia([]);
      setShowCalendar(false);
      alert('Innlegg planlagt! ' + (config.require_approval ? 'Godkjenn dem under.' : ''));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
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

      if (!res.ok) throw new Error('Kunne ikke lagre konfigurasjon');
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
      if (res.ok) fetchScheduledPosts();
    } catch (err) {
      console.error('Error approving post:', err);
    }
  }

  async function rejectPost(postId: string) {
    try {
      const res = await fetch(`${API_BASE}/api/orgs/${ORG_ID}/marketing/posts/${postId}/reject`, {
        method: 'POST'
      });
      if (res.ok) fetchScheduledPosts();
    } catch (err) {
      console.error('Error rejecting post:', err);
    }
  }

  function previewPostContent(post: ScheduledPost) {
    setPreviewPost(post);
    setShowPreview(true);
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
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Sparkles className="h-8 w-8" />
              Facebook Auto-Publishing med AI
            </h1>
            <p className="text-blue-100 mt-2">
              Automatisk publisering til Facebook med AI-generert innhold og skylagring
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
            <div className="text-sm font-medium">Status</div>
            <div className="text-2xl font-bold">
              {config.enabled ? '✓ Aktiv' : '○ Inaktiv'}
            </div>
          </div>
        </div>
      </div>

      {/* AI & Cloud Benefits Banner */}
      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border-2 border-emerald-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="bg-emerald-600 rounded-full p-3">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              🚀 Oppgrader til Premium for maksimal effekt!
            </h3>
            <p className="text-slate-700 mb-3">
              Med vår AI-drevne markedsføringsløsning får du:
            </p>
            <div className="grid md:grid-cols-2 gap-3 mb-4">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-slate-700">
                  <strong>AI-generert innhold</strong> tilpasset din bransje
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-slate-700">
                  <strong>Automatisk annonsering</strong> med optimalisert budsjett
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-slate-700">
                  <strong>Skylagring</strong> for bilder og videoer
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-slate-700">
                  <strong>Lead-tracking</strong> og avansert analyse
                </div>
              </div>
            </div>
            <button 
              onClick={() => window.location.href = '/priser'}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Se prisplaner →
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className="bg-white border-2 border-blue-600 hover:bg-blue-50 text-blue-700 p-6 rounded-lg transition-all hover:shadow-lg"
        >
          <Calendar className="h-8 w-8 mx-auto mb-2" />
          <div className="font-semibold">Planlegg innlegg</div>
          <div className="text-sm text-slate-600 mt-1">
            Velg datoer i kalender ({selectedDates.length} valgt)
          </div>
        </button>

        <button
          onClick={() => setShowMediaPicker(!showMediaPicker)}
          className="bg-white border-2 border-purple-600 hover:bg-purple-50 text-purple-700 p-6 rounded-lg transition-all hover:shadow-lg"
        >
          <Upload className="h-8 w-8 mx-auto mb-2" />
          <div className="font-semibold">Velg media</div>
          <div className="text-sm text-slate-600 mt-1">
            Fra skylagring ({selectedMedia.length} valgt)
          </div>
        </button>

        <button
          onClick={() => setShowAdSetup(!showAdSetup)}
          className="bg-white border-2 border-emerald-600 hover:bg-emerald-50 text-emerald-700 p-6 rounded-lg transition-all hover:shadow-lg"
        >
          <DollarSign className="h-8 w-8 mx-auto mb-2" />
          <div className="font-semibold">Annonseoppsett</div>
          <div className="text-sm text-slate-600 mt-1">
            {showAdSetup ? 'Aktivert' : 'Inaktiv'}
          </div>
        </button>
      </div>

      {/* Calendar Modal */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Velg publiseringsdager</h2>
              <button
                onClick={() => setShowCalendar(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <PublishingCalendar
                selectedDates={selectedDates}
                onDatesChange={setSelectedDates}
                maxDays={30}
              />
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => setShowCalendar(false)}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Ferdig
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Media Picker Modal */}
      {showMediaPicker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Velg media fra skylagring</h2>
              <button
                onClick={() => setShowMediaPicker(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {mediaFiles.length === 0 ? (
                  <div className="col-span-full text-center py-12 text-slate-500">
                    <Upload className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">Ingen mediafiler funnet</p>
                    <p className="text-sm mb-4">Last opp bilder og videoer for å komme i gang</p>
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                      Last opp filer
                    </button>
                  </div>
                ) : (
                  mediaFiles.map(file => (
                    <button
                      key={file.id}
                      onClick={() => {
                        if (selectedMedia.includes(file.id)) {
                          setSelectedMedia(selectedMedia.filter(id => id !== file.id));
                        } else {
                          setSelectedMedia([...selectedMedia, file.id]);
                        }
                      }}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedMedia.includes(file.id)
                          ? 'border-purple-600 ring-2 ring-purple-600'
                          : 'border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      <img
                        src={file.thumbnail || file.url}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                      {selectedMedia.includes(file.id) && (
                        <div className="absolute inset-0 bg-purple-600/20 flex items-center justify-center">
                          <div className="bg-purple-600 text-white rounded-full p-2">
                            <CheckCircle className="h-6 w-6" />
                          </div>
                        </div>
                      )}
                      {file.type === 'video' && (
                        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          📹 Video
                        </div>
                      )}
                    </button>
                  ))
                )}
              </div>
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  {selectedMedia.length} filer valgt
                </div>
                <button
                  onClick={() => setShowMediaPicker(false)}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
                >
                  Ferdig
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ad Setup Modal */}
      {showAdSetup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Annonseoppsett</h2>
              <button
                onClick={() => setShowAdSetup(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Daglig annonsebudsjett (NOK)
                </label>
                <input
                  type="number"
                  min="50"
                  value={config.ad_budget || 0}
                  onChange={(e) => setConfig({...config, ad_budget: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-lg"
                  placeholder="f.eks. 200"
                />
                <p className="text-xs text-slate-500 mt-2">Minimum 50 NOK per dag · Anbefalt 200-500 NOK</p>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg border border-emerald-200">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-emerald-600" />
                  <div>
                    <h3 className="font-medium text-slate-900">La AI håndtere alt</h3>
                    <p className="text-sm text-slate-600">AI optimaliserer målgruppe og budsjett automatisk</p>
                  </div>
                </div>
                <button
                  onClick={() => setConfig({...config, auto_ad_management: !config.auto_ad_management})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    config.auto_ad_management ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    config.auto_ad_management ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {!config.auto_ad_management && (
                <div className="space-y-4 p-4 bg-slate-50 rounded-lg">
                  <h4 className="font-medium text-slate-900">Manuelt oppsett</h4>
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">
                      Målgruppe alder
                    </label>
                    <div className="flex gap-3">
                      <input type="number" placeholder="Fra (f.eks. 25)" className="flex-1 px-3 py-2 border border-slate-300 rounded-lg" />
                      <input type="number" placeholder="Til (f.eks. 55)" className="flex-1 px-3 py-2 border border-slate-300 rounded-lg" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">
                      Geografisk område
                    </label>
                    <input
                      type="text"
                      placeholder="f.eks. Oslo, Norge"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">
                      Interesser (kommaseparert)
                    </label>
                    <input
                      type="text"
                      placeholder="f.eks. biler, vedlikehold, mekanikk"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <strong>Estimert rekkevidde:</strong> 5,000-15,000 personer per dag med budsjett på {config.ad_budget || 0} NOK
                    <p className="mt-1 text-xs">Dette kan generere 50-200 nye leads per måned</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowAdSetup(false)}
                className="w-full py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium"
              >
                Lagre annonseoppsett
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Configuration Panel */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-6">
        <h2 className="text-xl font-semibold text-slate-900">Konfigurasjon</h2>

        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
          <div>
            <h3 className="font-medium text-slate-900">Auto-Publishing</h3>
            <p className="text-sm text-slate-600">Automatisk publiser innhold til Facebook</p>
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
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  <div>
                    <h3 className="font-medium text-slate-900">AI-innhold</h3>
                    <p className="text-xs text-slate-600">Generer tekst automatisk</p>
                  </div>
                </div>
                <button
                  onClick={() => setConfig({...config, use_ai_content: !config.use_ai_content})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    config.use_ai_content ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    config.use_ai_content ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Upload className="h-5 w-5 text-purple-600" />
                  <div>
                    <h3 className="font-medium text-slate-900">Skylagring</h3>
                    <p className="text-xs text-slate-600">Bruk media fra skyen</p>
                  </div>
                </div>
                <button
                  onClick={() => setConfig({...config, use_cloud_storage: !config.use_cloud_storage})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    config.use_cloud_storage ? 'bg-purple-600' : 'bg-slate-300'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    config.use_cloud_storage ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg">
              <div>
                <h3 className="font-medium text-slate-900">Krev godkjenning</h3>
                <p className="text-sm text-slate-600">Godkjenn innlegg manuelt før publisering</p>
              </div>
              <button
                onClick={() => setConfig({...config, require_approval: !config.require_approval})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.require_approval ? 'bg-amber-600' : 'bg-slate-300'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  config.require_approval ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={saveConfig}
                disabled={saving}
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-400 transition-colors font-medium"
              >
                {saving ? 'Lagrer...' : 'Lagre konfigurasjon'}
              </button>
              <button
                onClick={createScheduledPosts}
                disabled={saving || selectedDates.length === 0}
                className="flex-1 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-slate-400 transition-colors font-medium"
              >
                {aiGenerating ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Genererer...
                  </span>
                ) : (
                  `Opprett ${selectedDates.length} innlegg`
                )}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Venter godkjenning</p>
              <p className="text-3xl font-bold text-amber-600 mt-1">{pendingApproval.length}</p>
            </div>
            <div className="bg-amber-100 rounded-full p-3">
              <AlertCircle className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Planlagt</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">{scheduled.length}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Publisert</p>
              <p className="text-3xl font-bold text-emerald-600 mt-1">{published.length}</p>
            </div>
            <div className="bg-emerald-100 rounded-full p-3">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Pending Approval */}
      {pendingApproval.length > 0 && (
        <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
          <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-amber-600" />
            Venter godkjenning ({pendingApproval.length})
          </h2>
          
          <div className="space-y-4">
            {pendingApproval.map(post => (
              <div key={post.id} className="border border-amber-200 bg-amber-50 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-4">
                  {(post.image_url || post.video_url) && (
                    <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={post.image_url || post.video_url} 
                        alt="Post media" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-slate-900 font-medium">{post.content_text}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {post.content_hashtags.map((tag, i) => (
                        <span key={i} className="text-blue-600 text-sm">#{tag}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                      <span>📅 {new Date(post.scheduled_for).toLocaleString('nb-NO')}</span>
                      {post.is_ad && <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded">💰 Annonse</span>}
                      {post.generated_by_ai && <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">🤖 AI-generert</span>}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2 border-t border-amber-200">
                  <button
                    onClick={() => previewPostContent(post)}
                    className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-medium flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Forhåndsvisning
                  </button>
                  <button
                    onClick={() => approvePost(post.id)}
                    className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium"
                  >
                    ✓ Godkjenn og publiser
                  </button>
                  <button
                    onClick={() => rejectPost(post.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
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
          <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
            <Calendar className="h-6 w-6 text-blue-600" />
            Planlagte innlegg ({scheduled.length})
          </h2>
          
          <div className="space-y-3">
            {scheduled.map(post => (
              <div key={post.id} className="border border-blue-200 rounded-lg p-4 flex items-center gap-4 hover:bg-blue-50 transition-colors">
                {(post.image_url || post.video_url) && (
                  <img 
                    src={post.image_url || post.video_url} 
                    alt="Post" 
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <p className="text-sm text-slate-900 font-medium line-clamp-2">{post.content_text}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                    <span>📅 {new Date(post.scheduled_for).toLocaleString('nb-NO')}</span>
                    {post.is_ad && <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">Annonse</span>}
                  </div>
                </div>
                <button
                  onClick={() => previewPostContent(post)}
                  className="px-3 py-2 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-medium flex items-center gap-1"
                >
                  <Eye className="h-4 w-4" />
                  Se
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && previewPost && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="bg-slate-100 border-b border-slate-200 p-4 flex items-center justify-between rounded-t-lg">
              <h3 className="font-semibold text-slate-900">Facebook-forhåndsvisning</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              {/* Facebook Post Preview */}
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      FB
                    </div>
                    <div>
                      <div className="font-semibold text-sm">Din Bedrift</div>
                      <div className="text-xs text-slate-500">
                        {new Date(previewPost.scheduled_for).toLocaleDateString('nb-NO')} · 🌍
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-900 mb-3 whitespace-pre-wrap">{previewPost.content_text}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {previewPost.content_hashtags.map((tag, i) => (
                      <span key={i} className="text-blue-600 text-sm hover:underline cursor-pointer">#{tag}</span>
                    ))}
                  </div>
                </div>
                {(previewPost.image_url || previewPost.video_url) && (
                  <img
                    src={previewPost.image_url || previewPost.video_url}
                    alt="Post media"
                    className="w-full object-cover"
                  />
                )}
                <div className="p-3 border-t border-slate-200 flex items-center justify-between text-slate-600 text-sm">
                  <button className="flex items-center gap-1 hover:text-blue-600">👍 Like</button>
                  <button className="flex items-center gap-1 hover:text-blue-600">💬 Kommenter</button>
                  <button className="flex items-center gap-1 hover:text-blue-600">↗ Del</button>
                </div>
              </div>
              {previewPost.is_ad && (
                <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-900">
                  <strong>💰 Annonse</strong> · Budsjett: {previewPost.ad_budget} NOK/dag
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
