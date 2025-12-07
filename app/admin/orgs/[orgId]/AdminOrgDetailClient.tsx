// app/(protected)/admin/orgs/[orgId]/AdminOrgDetailClient.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Building2, Users, Calendar, CreditCard, Settings, 
  Trash2, AlertTriangle, CheckCircle, XCircle, Edit,
  Database, Activity, Mail, Phone, MapPin
} from "lucide-react";
import { getApiBaseUrl } from "@/lib/apiConfig";

const API_BASE_URL = getApiBaseUrl();

type OrgDetail = {
  id: string;
  name: string | null;
  org_number: string | null;
  is_active: boolean;
  plan: string | null;
  created_at: string;
  updated_at: string;
  contact_email: string | null;
  contact_phone: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
  website: string | null;
  industry: string | null;
  employee_count: number | null;
};

type OrgUser = {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  created_at: string;
  last_sign_in_at: string | null;
};

type OrgStats = {
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
  activeSubscription: boolean;
  lastActivity: string | null;
};

export default function AdminOrgDetailClient({ orgId }: { orgId: string }) {
  const [org, setOrg] = useState<OrgDetail | null>(null);
  const [users, setUsers] = useState<OrgUser[]>([]);
  const [stats, setStats] = useState<OrgStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'settings' | 'danger'>('overview');
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<OrgDetail>>({});

  useEffect(() => {
    loadOrgData();
  }, [orgId]);

  async function loadOrgData() {
    try {
      setLoading(true);
      setError(null);

      // Load org details
      const orgRes = await fetch(`${API_BASE_URL}/api/admin/orgs/${orgId}`);
      if (!orgRes.ok) throw new Error("Kunne ikke laste organisasjon");
      const orgData = await orgRes.json();
      setOrg(orgData.org);
      setEditForm(orgData.org);

      // Load org users
      const usersRes = await fetch(`${API_BASE_URL}/api/admin/orgs/${orgId}/users`);
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.users || []);
      }

      // Load org stats
      const statsRes = await fetch(`${API_BASE_URL}/api/admin/orgs/${orgId}/stats`);
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
      }
    } catch (err: any) {
      console.error("Error loading org data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateOrg() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/orgs/${orgId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (!res.ok) throw new Error("Kunne ikke oppdatere organisasjon");

      const data = await orgRes.json();
      setOrg(data.org);
      setEditing(false);
      alert("Organisasjon oppdatert! ✓");
    } catch (err: any) {
      alert(`Feil: ${err.message}`);
    }
  }

  async function handleToggleActive() {
    if (!org) return;
    
    const confirmed = confirm(
      `Er du sikker på at du vil ${org.is_active ? 'deaktivere' : 'aktivere'} denne organisasjonen?`
    );
    
    if (!confirmed) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/orgs/${orgId}/toggle-active`, {
        method: "PATCH",
      });

      if (!res.ok) throw new Error("Kunne ikke endre status");

      await loadOrgData();
      alert(`Organisasjon ${org.is_active ? 'deaktivert' : 'aktivert'}! ✓`);
    } catch (err: any) {
      alert(`Feil: ${err.message}`);
    }
  }

  async function handleDeleteOrg() {
    if (!org) return;
    
    const confirmed = confirm(
      `⚠️ ADVARSEL: Er du HELT sikker på at du vil slette "${org.name}"?\n\n` +
      `Dette vil permanent slette:\n` +
      `- Organisasjonen og alle tilhørende data\n` +
      `- Alle brukere tilknyttet organisasjonen\n` +
      `- Alle bookinger, kunder, og historikk\n\n` +
      `DENNE HANDLINGEN KAN IKKE ANGRES!\n\n` +
      `Skriv "SLETT" i neste prompt for å bekrefte.`
    );

    if (!confirmed) return;

    const confirmation = prompt('Skriv "SLETT" for å bekrefte sletting:');
    if (confirmation !== "SLETT") {
      alert("Sletting avbrutt.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/orgs/${orgId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Kunne ikke slette organisasjon");

      alert("Organisasjon slettet! Sender deg tilbake til admin...");
      window.location.href = "/admin/orgs";
    } catch (err: any) {
      alert(`Feil: ${err.message}`);
    }
  }

  async function handleRemoveUser(userId: string) {
    const confirmed = confirm("Er du sikker på at du vil fjerne denne brukeren fra organisasjonen?");
    if (!confirmed) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/orgs/${orgId}/users/${userId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Kunne ikke fjerne bruker");

      await loadOrgData();
      alert("Bruker fjernet! ✓");
    } catch (err: any) {
      alert(`Feil: ${err.message}`);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Laster organisasjonsdetaljer...</p>
        </div>
      </div>
    );
  }

  if (error || !org) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-red-800 font-semibold mb-2">Kunne ikke laste organisasjon</h2>
          <p className="text-red-600">{error || "Organisasjon ikke funnet"}</p>
          <Link 
            href="/admin/orgs"
            className="mt-4 inline-block text-red-600 hover:text-red-700 font-medium"
          >
            ← Tilbake til organisasjoner
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/admin/orgs"
              className="text-slate-600 hover:text-slate-900"
            >
              ← Tilbake
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                <Building2 className="w-8 h-8" />
                {org.name || "Uten navn"}
              </h1>
              <p className="text-slate-600 mt-1">Org ID: {org.id}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {org.is_active ? (
              <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                <CheckCircle className="w-4 h-4" />
                Aktiv
              </span>
            ) : (
              <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                <XCircle className="w-4 h-4" />
                Deaktivert
              </span>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200">
          <div className="flex gap-4">
            {[
              { id: 'overview', label: 'Oversikt', icon: Activity },
              { id: 'users', label: 'Brukere', icon: Users },
              { id: 'settings', label: 'Innstillinger', icon: Settings },
              { id: 'danger', label: 'Farlig sone', icon: AlertTriangle },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <>
              {/* Quick Stats */}
              {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg border border-slate-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600">Totalt brukere</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{stats.totalUsers}</p>
                      </div>
                      <Users className="w-8 h-8 text-purple-600" />
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg border border-slate-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600">Bookinger</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{stats.totalBookings}</p>
                      </div>
                      <Calendar className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-slate-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600">Omsetning</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">
                          {stats.totalRevenue.toLocaleString()} kr
                        </p>
                      </div>
                      <CreditCard className="w-8 h-8 text-green-600" />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-slate-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600">Abonnement</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">
                          {stats.activeSubscription ? 'Aktiv' : 'Inaktiv'}
                        </p>
                      </div>
                      <CheckCircle className={`w-8 h-8 ${stats.activeSubscription ? 'text-green-600' : 'text-gray-400'}`} />
                    </div>
                  </div>
                </div>
              )}

              {/* Org Details */}
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Organisasjonsdetaljer</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-700">Organisasjonsnavn</label>
                      <p className="mt-1 text-slate-900">{org.name || '—'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">Organisasjonsnummer</label>
                      <p className="mt-1 text-slate-900">{org.org_number || '—'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">Plan</label>
                      <p className="mt-1 text-slate-900 capitalize">{org.plan || 'free'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">Bransje</label>
                      <p className="mt-1 text-slate-900">{org.industry || '—'}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-2">
                      <Mail className="w-4 h-4 text-slate-600 mt-1" />
                      <div>
                        <label className="text-sm font-medium text-slate-700">E-post</label>
                        <p className="mt-1 text-slate-900">{org.contact_email || '—'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Phone className="w-4 h-4 text-slate-600 mt-1" />
                      <div>
                        <label className="text-sm font-medium text-slate-700">Telefon</label>
                        <p className="mt-1 text-slate-900">{org.contact_phone || '—'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-slate-600 mt-1" />
                      <div>
                        <label className="text-sm font-medium text-slate-700">Adresse</label>
                        <p className="mt-1 text-slate-900">
                          {org.address || '—'}
                          {org.postal_code && org.city && (
                            <><br />{org.postal_code} {org.city}</>
                          )}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">Nettside</label>
                      <p className="mt-1 text-slate-900">
                        {org.website ? (
                          <a href={org.website} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                            {org.website}
                          </a>
                        ) : '—'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t grid grid-cols-2 gap-4 text-sm text-slate-600">
                  <div>
                    <span className="font-medium">Opprettet:</span> {new Date(org.created_at).toLocaleDateString('nb-NO')}
                  </div>
                  <div>
                    <span className="font-medium">Sist oppdatert:</span> {new Date(org.updated_at).toLocaleDateString('nb-NO')}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'users' && (
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900">Brukere ({users.length})</h2>
              </div>

              {users.length === 0 ? (
                <p className="text-center text-slate-600 py-8">Ingen brukere funnet</p>
              ) : (
                <div className="space-y-3">
                  {users.map(user => (
                    <div key={user.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{user.full_name || user.email}</p>
                        <p className="text-sm text-slate-600">{user.email}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full capitalize">
                            {user.role}
                          </span>
                          <span className="text-xs text-slate-500">
                            Registrert: {new Date(user.created_at).toLocaleDateString('nb-NO')}
                          </span>
                          {user.last_sign_in_at && (
                            <span className="text-xs text-slate-500">
                              Sist innlogget: {new Date(user.last_sign_in_at).toLocaleDateString('nb-NO')}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveUser(user.id)}
                        className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Fjern bruker"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900">Innstillinger</h2>
                <button
                  onClick={() => setEditing(!editing)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  {editing ? 'Avbryt' : 'Rediger'}
                </button>
              </div>

              {editing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Organisasjonsnavn</label>
                    <input
                      type="text"
                      value={editForm.name || ''}
                      onChange={e => setEditForm({...editForm, name: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">E-post</label>
                      <input
                        type="email"
                        value={editForm.contact_email || ''}
                        onChange={e => setEditForm({...editForm, contact_email: e.target.value})}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Telefon</label>
                      <input
                        type="text"
                        value={editForm.contact_phone || ''}
                        onChange={e => setEditForm({...editForm, contact_phone: e.target.value})}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Adresse</label>
                    <input
                      type="text"
                      value={editForm.address || ''}
                      onChange={e => setEditForm({...editForm, address: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Postnummer</label>
                      <input
                        type="text"
                        value={editForm.postal_code || ''}
                        onChange={e => setEditForm({...editForm, postal_code: e.target.value})}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">By</label>
                      <input
                        type="text"
                        value={editForm.city || ''}
                        onChange={e => setEditForm({...editForm, city: e.target.value})}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Land</label>
                      <input
                        type="text"
                        value={editForm.country || ''}
                        onChange={e => setEditForm({...editForm, country: e.target.value})}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nettside</label>
                    <input
                      type="url"
                      value={editForm.website || ''}
                      onChange={e => setEditForm({...editForm, website: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button
                      onClick={handleUpdateOrg}
                      className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                    >
                      Lagre endringer
                    </button>
                    <button
                      onClick={() => {
                        setEditing(false);
                        setEditForm(org);
                      }}
                      className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      Avbryt
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-slate-600">Klikk "Rediger" for å endre organisasjonsinnstillinger</p>
              )}
            </div>
          )}

          {activeTab === 'danger' && (
            <div className="bg-white rounded-lg border border-red-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <h2 className="text-xl font-semibold text-red-900">Farlig sone</h2>
              </div>
              <p className="text-slate-600 mb-6">
                Handlinger i denne seksjonen kan ha permanente konsekvenser. Vær forsiktig!
              </p>

              <div className="space-y-4">
                <div className="p-4 border border-slate-200 rounded-lg">
                  <h3 className="font-semibold text-slate-900 mb-2">
                    {org.is_active ? 'Deaktiver' : 'Aktiver'} organisasjon
                  </h3>
                  <p className="text-sm text-slate-600 mb-3">
                    {org.is_active 
                      ? 'Deaktivering vil hindre alle brukere i organisasjonen fra å logge inn.'
                      : 'Aktivering vil gi brukerne tilgang til systemet igjen.'}
                  </p>
                  <button
                    onClick={handleToggleActive}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      org.is_active
                        ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {org.is_active ? 'Deaktiver organisasjon' : 'Aktiver organisasjon'}
                  </button>
                </div>

                <div className="p-4 border border-red-300 rounded-lg bg-red-50">
                  <h3 className="font-semibold text-red-900 mb-2">Slett organisasjon permanent</h3>
                  <p className="text-sm text-red-700 mb-3">
                    ⚠️ ADVARSEL: Dette vil slette organisasjonen, alle brukere, bookinger og relatert data permanent. 
                    Denne handlingen kan IKKE angres!
                  </p>
                  <button
                    onClick={handleDeleteOrg}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    <Trash2 className="w-4 h-4 inline mr-2" />
                    Slett organisasjon permanent
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
