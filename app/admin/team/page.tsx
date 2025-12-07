'use client';

import { useState, useEffect } from 'react';
import {
  Users, UserPlus, Shield, Trash2, Edit, Mail, Phone, Calendar,
  CheckCircle, XCircle, Search, Crown, Lock, MoreVertical, Settings
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface TeamMember {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  role: 'owner' | 'admin' | 'manager' | 'employee' | 'viewer';
  status: 'active' | 'inactive' | 'invited';
  created_at: string;
  last_sign_in_at?: string;
}

const ROLES = [
  { value: 'owner', label: 'Eier', color: 'text-purple-400', icon: Crown },
  { value: 'admin', label: 'Administrator', color: 'text-red-400', icon: Shield },
  { value: 'manager', label: 'Leder', color: 'text-blue-400', icon: Users },
  { value: 'employee', label: 'Ansatt', color: 'text-green-400', icon: CheckCircle },
  { value: 'viewer', label: 'Leser', color: 'text-slate-400', icon: Lock },
];

export default function TeamManagementPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');

  const supabase = createClient();

  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = async () => {
    setLoading(true);
    try {
      // Mock data for now - replace with actual API call
      const mockData: TeamMember[] = [
        {
          id: '1',
          email: 'eier@lyxso.no',
          full_name: 'Nikolai Raugstad',
          phone: '+47 123 45 678',
          role: 'owner',
          status: 'active',
          created_at: '2024-01-01',
          last_sign_in_at: '2024-12-04T20:00:00',
        },
        {
          id: '2',
          email: 'admin@lyxso.no',
          full_name: 'Admin Bruker',
          phone: '+47 234 56 789',
          role: 'admin',
          status: 'active',
          created_at: '2024-02-15',
          last_sign_in_at: '2024-12-03T15:30:00',
        },
        {
          id: '3',
          email: 'ansatt@lyxso.no',
          full_name: 'Test Ansatt',
          role: 'employee',
          status: 'invited',
          created_at: '2024-12-01',
        },
      ];
      setTeamMembers(mockData);
    } catch (error) {
      console.error('Error loading team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = 
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.full_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = filterRole === 'all' || member.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-blue-400" />
            <h1 className="text-4xl font-bold text-slate-100">Team Management</h1>
          </div>
          <p className="text-slate-400">Administrer teammedlemmer, roller og tilganger</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 p-5 rounded-xl border border-blue-700/30">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-blue-300 font-medium">Totalt</span>
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-blue-100">{teamMembers.length}</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 p-5 rounded-xl border border-green-700/30">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-green-300 font-medium">Aktive</span>
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-3xl font-bold text-green-100">
              {teamMembers.filter(m => m.status === 'active').length}
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-amber-900/30 to-amber-800/20 p-5 rounded-xl border border-amber-700/30">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-amber-300 font-medium">Invitert</span>
              <Mail className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-3xl font-bold text-amber-100">
              {teamMembers.filter(m => m.status === 'invited').length}
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 p-5 rounded-xl border border-purple-700/30">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-purple-300 font-medium">Admins</span>
              <Shield className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-3xl font-bold text-purple-100">
              {teamMembers.filter(m => m.role === 'admin' || m.role === 'owner').length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Søk etter navn eller e-post..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Alle roller</option>
              {ROLES.map(role => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>
            <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">
              <UserPlus className="w-5 h-5" />
              Inviter medlem
            </button>
          </div>
        </div>

        {/* Team List */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-800/50 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Medlem</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Rolle</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Sist aktiv</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase">Handlinger</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredMembers.map((member) => {
                  const roleConfig = ROLES.find(r => r.value === member.role);
                  const RoleIcon = roleConfig?.icon || Users;
                  
                  return (
                    <tr key={member.id} className="hover:bg-slate-800/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white font-semibold">
                            {member.full_name?.charAt(0) || member.email.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-slate-100">{member.full_name || 'Ingen navn'}</p>
                            <p className="text-sm text-slate-400">{member.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <RoleIcon className={`w-4 h-4 ${roleConfig?.color}`} />
                          <span className={`font-medium ${roleConfig?.color}`}>{roleConfig?.label}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          member.status === 'active' ? 'bg-green-900/30 text-green-400' :
                          member.status === 'invited' ? 'bg-blue-900/30 text-blue-400' :
                          'bg-slate-900/30 text-slate-400'
                        }`}>
                          {member.status === 'active' ? <CheckCircle className="w-3 h-3" /> : <Mail className="w-3 h-3" />}
                          {member.status === 'active' ? 'Aktiv' : member.status === 'invited' ? 'Invitert' : 'Inaktiv'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">
                        {member.last_sign_in_at ? new Date(member.last_sign_in_at).toLocaleDateString('nb-NO') : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 hover:bg-slate-700 rounded-lg">
                            <Edit className="w-4 h-4 text-blue-400" />
                          </button>
                          {member.role !== 'owner' && (
                            <button className="p-2 hover:bg-red-900/30 rounded-lg">
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
