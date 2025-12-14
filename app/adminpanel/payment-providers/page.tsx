// app/adminpanel/payment-providers/page.tsx
'use client';
import { useState } from 'react';

type ValidationResult = {
  valid: boolean;
  account?: { id: string };
  error?: string;
};

type Provider = {
  id: string;
  provider_type: string;
  is_default?: boolean;
};

export default function PaymentProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [form, setForm] = useState({ provider_type: 'stripe', api_key: '' });
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchProviders() {
    // TODO: Hent fra backend
    setProviders([]);
  }

  async function handleValidate() {
    setLoading(true);
    setValidation(null);
    const res = await fetch('/api/orgs/me/payment-providers/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider_type: form.provider_type, credentials: { api_key: form.api_key } }),
    });
    const data = await res.json();
    setValidation(data);
    setLoading(false);
  }

  async function handleSave() {
    setLoading(true);
    await fetch('/api/orgs/me/payment-providers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider_type: form.provider_type, credentials: { api_key: form.api_key } }),
    });
    setLoading(false);
    fetchProviders();
  }

  return (
    <div>
      <h1>Betalingsleverandører</h1>
      <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
        <label>Provider type:
          <select value={form.provider_type} onChange={e => setForm(f => ({ ...f, provider_type: e.target.value }))}>
            <option value="stripe">Stripe</option>
            {/* <option value="vipps">Vipps</option> */}
          </select>
        </label>
        <label>API-nøkkel:
          <input type="text" value={form.api_key} onChange={e => setForm(f => ({ ...f, api_key: e.target.value }))} />
        </label>
        <button type="button" onClick={handleValidate} disabled={loading}>Valider nøkkel</button>
        <button type="submit" disabled={loading}>Lagre</button>
      </form>
      {validation && (
        <div>
          {validation.valid ? (
            <span style={{ color: 'green' }}>Gyldig nøkkel! Konto: {validation.account?.id}</span>
          ) : (
            <span style={{ color: 'red' }}>Ugyldig: {validation.error}</span>
          )}
        </div>
      )}
      <h2>Eksisterende leverandører</h2>
      <ul>
        {providers.map(p => (
          <li key={p.id}>{p.provider_type} {p.is_default ? '(default)' : ''}</li>
        ))}
      </ul>
    </div>
  );
}
