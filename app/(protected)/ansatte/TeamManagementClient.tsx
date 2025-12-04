"use client";

import { useState, useEffect } from "react";
import { useOrgPlan } from "@/hooks/useOrgPlan";

// Types
type TeamMember = {
  id: string;
  user_id: string;
  role: "owner" | "admin" | "manager" | "user";
  status: "active" | "pending" | "suspended" | "inactive";
  permissions: string[];
  joined_at: string;
  profile: {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
  };
  invited_by_profile: {
    full_name: string | null;
  };
};

type Invitation = {
  id: string;
  email: string;
  role: string;
  status: string;
  expires_at: string;
  created_at: string;
  invited_by_profile: {
    full_name: string | null;
    email: string;
  };
};

const ROLE_INFO = {
  owner: {
    label: "Eier",
    description: "Full tilgang til alt, inkludert billing og sletting",
    color: "bg-purple-100 text-purple-800",
    permissions: [
      "all:*",
    ],
  },
  admin: {
    label: "Administrator",
    description: "Full tilgang unntatt billing og kritiske innstillinger",
    color: "bg-blue-100 text-blue-800",
    permissions: [
      "bookings:*",
      "customers:*",
      "team:invite",
      "team:manage",
      "settings:view",
      "settings:edit",
      "reports:*",
    ],
  },
  manager: {
    label: "Manager",
    description: "Kan administrere bookinger, kunder og ansatte",
    color: "bg-green-100 text-green-800",
    permissions: [
      "bookings:view",
      "bookings:create",
      "bookings:edit",
      "customers:view",
      "customers:create",
      "customers:edit",
      "team:view",
      "reports:view",
    ],
  },
  user: {
    label: "Bruker",
    description: "Kan se bookinger og kunder, begrenset redigering",
    color: "bg-gray-100 text-gray-800",
    permissions: [
      "bookings:view",
      "customers:view",
      "team:view",
    ],
  },
};

export default function TeamManagementClient() {
  const { org } = useOrgPlan();
  const [activeTab, setActiveTab] = useState<"members" | "invitations" | "roles">("members");
  
  // State
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Invite modal
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "manager" | "user">("user");
  const [inviting, setInviting] = useState(false);

  // Load data
  useEffect(() => {
    if (org?.id) {
      loadMembers();
      loadInvitations();
    }
  }, [org?.id]);

  async function loadMembers() {
    if (!org?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/org/team/members?orgId=${org.id}`);
      
      if (!response.ok) {
        throw new Error("Kunne ikke laste team members");
      }
      
      const data = await response.json();
      setMembers(data.members || []);
    } catch (err: any) {
      console.error("Error loading members:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadInvitations() {
    if (!org?.id) return;
    
    try {
      const response = await fetch(`/api/org/team/invitations?orgId=${org.id}`);
      
      if (!response.ok) {
        throw new Error("Kunne ikke laste invitasjoner");
      }
      
      const data = await response.json();
      setInvitations(data.invitations || []);
    } catch (err: any) {
      console.error("Error loading invitations:", err);
    }
  }

  async function handleInvite() {
    if (!org?.id || !inviteEmail || !inviteRole) return;
    
    try {
      setInviting(true);
      
      const response = await fetch("/api/org/team/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orgId: org.id,
          email: inviteEmail,
          role: inviteRole,
          permissions: ROLE_INFO[inviteRole].permissions,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Kunne ikke sende invitasjon");
      }
      
      // Success
      setShowInviteModal(false);
      setInviteEmail("");
      setInviteRole("user");
      
      // Reload data
      loadInvitations();
      
      alert("Invitasjon sendt! ✅");
    } catch (err: any) {
      console.error("Error inviting:", err);
      alert(`Feil: ${err.message}`);
    } finally {
      setInviting(false);
    }
  }

  function getRoleBadge(role: string) {
    const info = ROLE_INFO[role as keyof typeof ROLE_INFO] || ROLE_INFO.user;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${info.color}`}>
        {info.label}
      </span>
    );
  }

  function getStatusBadge(status: string) {
    const colors = {
      active: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      suspended: "bg-red-100 text-red-800",
      inactive: "bg-gray-100 text-gray-800",
    };
    
    const labels = {
      active: "Aktiv",
      pending: "Venter",
      suspended: "Suspendert",
      inactive: "Inaktiv",
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors] || colors.inactive}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Laster team...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Team & Tilgang</h1>
            <p className="mt-2 text-slate-600">
              Administrer team members, invitasjoner og tilgangskontroll
            </p>
          </div>
          
          <button
            onClick={() => setShowInviteModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Inviter medlem
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 mb-6">
        <nav className="flex gap-8">
          <button
            onClick={() => setActiveTab("members")}
            className={`pb-4 px-1 border-b-2 font-medium transition-colors ${
              activeTab === "members"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Team Members ({members.length})
          </button>
          <button
            onClick={() => setActiveTab("invitations")}
            className={`pb-4 px-1 border-b-2 font-medium transition-colors ${
              activeTab === "invitations"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Invitasjoner ({invitations.length})
          </button>
          <button
            onClick={() => setActiveTab("roles")}
            className={`pb-4 px-1 border-b-2 font-medium transition-colors ${
              activeTab === "roles"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Roller & Permissions
          </button>
        </nav>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      {/* Members Tab */}
      {activeTab === "members" && (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-slate-700">Medlem</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-700">Rolle</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-700">Status</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-700">Ble med</th>
                <th className="text-right p-4 text-sm font-semibold text-slate-700">Handlinger</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {members.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    Ingen team members enda. Inviter ditt første medlem!
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
                          {member.profile.full_name?.[0]?.toUpperCase() || member.profile.email[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">
                            {member.profile.full_name || member.profile.email}
                          </div>
                          <div className="text-sm text-slate-500">{member.profile.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">{getRoleBadge(member.role)}</td>
                    <td className="p-4">{getStatusBadge(member.status)}</td>
                    <td className="p-4 text-sm text-slate-600">
                      {new Date(member.joined_at).toLocaleDateString("nb-NO")}
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-slate-400 hover:text-slate-600 p-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Invitations Tab */}
      {activeTab === "invitations" && (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-slate-700">E-post</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-700">Rolle</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-700">Invitert av</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-700">Utløper</th>
                <th className="text-right p-4 text-sm font-semibold text-slate-700">Handlinger</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {invitations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    Ingen aktive invitasjoner
                  </td>
                </tr>
              ) : (
                invitations.map((invitation) => (
                  <tr key={invitation.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-slate-900">{invitation.email}</div>
                    </td>
                    <td className="p-4">{getRoleBadge(invitation.role)}</td>
                    <td className="p-4 text-sm text-slate-600">
                      {invitation.invited_by_profile.full_name || invitation.invited_by_profile.email}
                    </td>
                    <td className="p-4 text-sm text-slate-600">
                      {new Date(invitation.expires_at).toLocaleDateString("nb-NO")}
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium mr-4">
                        Send på nytt
                      </button>
                      <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                        Kanseller
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Roles Tab */}
      {activeTab === "roles" && (
        <div className="space-y-6">
          {Object.entries(ROLE_INFO).map(([role, info]) => (
            <div key={role} className="bg-white rounded-lg border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-slate-900">{info.label}</h3>
                    {getRoleBadge(role)}
                  </div>
                  <p className="text-slate-600">{info.description}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Tillatelser:</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {info.permissions.map((perm) => (
                    <div key={perm} className="flex items-center gap-2 text-sm text-slate-600">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {perm}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Inviter team medlem</h2>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-slate-400 hover:text-slate-600 p-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  E-postadresse
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="navn@eksempel.no"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Rolle
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                >
                  {Object.entries(ROLE_INFO)
                    .filter(([role]) => role !== "owner")
                    .map(([role, info]) => (
                      <option key={role} value={role}>
                        {info.label} - {info.description}
                      </option>
                    ))}
                </select>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">
                  Tillatelser for {ROLE_INFO[inviteRole].label}:
                </h4>
                <ul className="space-y-1">
                  {ROLE_INFO[inviteRole].permissions.map((perm) => (
                    <li key={perm} className="text-sm text-blue-800 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {perm}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowInviteModal(false)}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
              >
                Avbryt
              </button>
              <button
                onClick={handleInvite}
                disabled={inviting || !inviteEmail}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {inviting ? "Sender..." : "Send invitasjon"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
