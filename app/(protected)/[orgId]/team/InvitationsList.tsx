'use client';

import { useState, useEffect } from 'react';
import { Mail, RefreshCw, X as XIcon } from 'lucide-react';

type Invitation = {
  id: string;
  email: string;
  role: string;
  status: string;
  expires_at: string;
  created_at: string;
  invited_by_profile?: {
    full_name: string;
  };
};

type Props = {
  onInvite: () => void;
};

const roleLabels: Record<string, string> = {
  admin: 'Administrator',
  manager: 'Manager',
  user: 'Bruker',
};

export default function InvitationsList({ onInvite }: Props) {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvitations();
  }, []);

  async function fetchInvitations() {
    setLoading(true);
    try {
      const response = await fetch('/api/org/team/invitations');
      if (response.ok) {
        const data = await response.json();
        setInvitations(data.invitations || []);
      }
    } catch (error) {
      console.error('Error fetching invitations:', error);
    }
    setLoading(false);
  }

  async function handleResend(invitationId: string) {
    try {
      const response = await fetch(`/api/org/team/invitations/${invitationId}/resend`, {
        method: 'POST',
      });

      if (response.ok) {
        alert('Invitasjon sendt på nytt');
      } else {
        const error = await response.json();
        alert(error.error || 'Kunne ikke sende invitasjon');
      }
    } catch (error) {
      console.error('Error resending invitation:', error);
      alert('Noe gikk galt');
    }
  }

  async function handleCancel(invitationId: string) {
    if (!confirm('Er du sikker på at du vil kansellere denne invitasjonen?')) {
      return;
    }

    try {
      const response = await fetch(`/api/org/team/invitations/${invitationId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchInvitations();
      } else {
        const error = await response.json();
        alert(error.error || 'Kunne ikke kansellere invitasjon');
      }
    } catch (error) {
      console.error('Error cancelling invitation:', error);
      alert('Noe gikk galt');
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          {invitations.length} aktiv{invitations.length !== 1 ? 'e' : ''} invitasjon{invitations.length !== 1 ? 'er' : ''}
        </p>
        <button
          onClick={onInvite}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
        >
          <Mail className="w-5 h-5" />
          Send invitasjon
        </button>
      </div>

      {/* Invitations */}
      {invitations.length === 0 ? (
        <div className="card text-center py-12">
          <Mail className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 mb-4">Ingen aktive invitasjoner</p>
          <button
            onClick={onInvite}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Mail className="w-5 h-5" />
            Send invitasjon
          </button>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    E-post
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Rolle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Invitert av
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Utløper
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Handlinger
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {invitations.map((invitation) => {
                  const expiresAt = new Date(invitation.expires_at);
                  const isExpiringSoon = expiresAt.getTime() - Date.now() < 24 * 60 * 60 * 1000;

                  return (
                    <tr key={invitation.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-slate-400" />
                          <span className="font-medium text-slate-900">
                            {invitation.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600">
                          {roleLabels[invitation.role] || invitation.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {invitation.invited_by_profile?.full_name || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm ${isExpiringSoon ? 'text-orange-600 font-medium' : 'text-slate-600'}`}>
                          {expiresAt.toLocaleDateString('nb-NO')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleResend(invitation.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Send på nytt"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleCancel(invitation.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Kanseller"
                          >
                            <XIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
