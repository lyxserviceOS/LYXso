'use client';

import { useState, useEffect } from 'react';
import { Shield, Edit2, Trash2, MoreVertical, Crown } from 'lucide-react';

type Member = {
  id: string;
  role: string;
  status: string;
  created_at: string;
  profile: {
    email: string;
    full_name?: string;
    avatar_url?: string;
  };
};

type Props = {
  onInvite: () => void;
};

const roleLabels: Record<string, { label: string; color: string }> = {
  owner: { label: 'Eier', color: 'bg-purple-100 text-purple-800' },
  admin: { label: 'Administrator', color: 'bg-blue-100 text-blue-800' },
  manager: { label: 'Manager', color: 'bg-green-100 text-green-800' },
  user: { label: 'Bruker', color: 'bg-slate-100 text-slate-800' },
};

export default function MembersList({ onInvite }: Props) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  async function fetchMembers() {
    setLoading(true);
    try {
      const response = await fetch('/api/org/team/members');
      if (response.ok) {
        const data = await response.json();
        setMembers(data.members || []);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    }
    setLoading(false);
  }

  async function handleRemove(memberId: string) {
    if (!confirm('Er du sikker på at du vil fjerne dette medlemmet?')) {
      return;
    }

    try {
      const response = await fetch(`/api/org/team/members/${memberId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchMembers();
      } else {
        const error = await response.json();
        alert(error.error || 'Kunne ikke fjerne medlem');
      }
    } catch (error) {
      console.error('Error removing member:', error);
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
          {members.length} team member{members.length !== 1 ? 's' : ''}
        </p>
        <button
          onClick={onInvite}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
        >
          <Shield className="w-5 h-5" />
          Inviter medlem
        </button>
      </div>

      {/* Members Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Medlem
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Rolle
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Lagt til
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Handlinger
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-semibold">
                        {member.profile.full_name?.[0] || member.profile.email[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">
                          {member.profile.full_name || member.profile.email}
                        </div>
                        <div className="text-sm text-slate-500">
                          {member.profile.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${roleLabels[member.role]?.color || 'bg-slate-100 text-slate-800'}`}>
                      {member.role === 'owner' && <Crown className="w-3 h-3" />}
                      {roleLabels[member.role]?.label || member.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                      member.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-slate-100 text-slate-800'
                    }`}>
                      {member.status === 'active' ? 'Aktiv' : member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(member.created_at).toLocaleDateString('nb-NO')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {member.role !== 'owner' && (
                      <button
                        onClick={() => handleRemove(member.id)}
                        className="text-red-600 hover:text-red-800 font-medium text-sm"
                      >
                        Fjern
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
