"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type User = {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  orgs: {
    id: string;
    name: string;
    role: string;
  }[];
};

export default function AdminUsersClient() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/admin/users");
      
      if (!response.ok) {
        throw new Error("Kunne ikke laste brukere");
      }

      const data = await response.json();
      setUsers(data.users || []);
    } catch (err: any) {
      console.error("Error loading users:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.email.toLowerCase().includes(query) ||
      user.full_name?.toLowerCase().includes(query) ||
      user.id.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Laster brukere...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Brukere</h1>
          <p className="mt-2 text-slate-600">
            Administrer alle brukere på plattformen
          </p>
        </div>

        <Link
          href="/admin/dashboard"
          className="px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium"
        >
          ← Tilbake til Dashboard
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      {/* Search & Stats */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Søk etter e-post, navn eller ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-600">
              <span className="font-semibold text-slate-900">{users.length}</span> totalt brukere
            </div>
            <div className="text-sm text-slate-600">
              <span className="font-semibold text-slate-900">{filteredUsers.length}</span> vises
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left p-4 text-sm font-semibold text-slate-700">Bruker</th>
              <th className="text-left p-4 text-sm font-semibold text-slate-700">Organisasjoner</th>
              <th className="text-left p-4 text-sm font-semibold text-slate-700">Siste innlogging</th>
              <th className="text-left p-4 text-sm font-semibold text-slate-700">Opprettet</th>
              <th className="text-right p-4 text-sm font-semibold text-slate-700">Handlinger</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  {searchQuery ? "Ingen brukere funnet" : "Ingen brukere enda"}
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
                        {user.full_name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">
                          {user.full_name || "Uten navn"}
                        </div>
                        <div className="text-sm text-slate-500">{user.email}</div>
                        <div className="text-xs text-slate-400 font-mono">{user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    {user.orgs.length === 0 ? (
                      <span className="text-sm text-slate-500">Ingen organisasjoner</span>
                    ) : (
                      <div className="space-y-1">
                        {user.orgs.map((org) => (
                          <div key={org.id} className="flex items-center gap-2">
                            <Link
                              href={`/admin/orgs/${org.id}`}
                              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                              {org.name}
                            </Link>
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
                              {org.role}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-sm text-slate-600">
                    {user.last_sign_in_at
                      ? new Date(user.last_sign_in_at).toLocaleString("nb-NO")
                      : "Aldri"}
                  </td>
                  <td className="p-4 text-sm text-slate-600">
                    {new Date(user.created_at).toLocaleDateString("nb-NO")}
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Detaljer
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
