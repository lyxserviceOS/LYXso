'use client';

import { useState, useEffect } from 'react';
import { X, Save, Shield } from 'lucide-react';

type Role = {
  value: string;
  label: string;
  description: string;
  permissions: string[];
};

type Props = {
  onClose: () => void;
};

export default function InviteModal({ onClose }: Props) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRoles();
  }, []);

  async function fetchRoles() {
    try {
      const response = await fetch('/api/org/team/roles');
      if (response.ok) {
        const data = await response.json();
        setRoles(data.roles.filter((r: Role) => r.value !== 'owner'));
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/org/team/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role }),
      });

      if (response.ok) {
        onClose();
      } else {
        const data = await response.json();
        setError(data.error || 'Kunne ikke sende invitasjon');
      }
    } catch (err) {
      setError('Noe gikk galt');
    }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Inviter team medlem</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              E-postadresse <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="navn@example.com"
              required
            />
            <p className="text-xs text-slate-500 mt-1">
              Personen vil motta en invitasjon på e-post
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Rolle <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              {roles.map((r) => (
                <label
                  key={r.value}
                  className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    role === r.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={r.value}
                    checked={role === r.value}
                    onChange={(e) => setRole(e.target.value)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Shield className="w-4 h-4 text-slate-400" />
                      <span className="font-semibold text-slate-900">{r.label}</span>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{r.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {r.permissions.slice(0, 3).map((perm) => (
                        <span
                          key={perm}
                          className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded"
                        >
                          {perm}
                        </span>
                      ))}
                      {r.permissions.length > 3 && (
                        <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                          +{r.permissions.length - 3} flere
                        </span>
                      )}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
            >
              Avbryt
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Sender...' : 'Send invitasjon'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
