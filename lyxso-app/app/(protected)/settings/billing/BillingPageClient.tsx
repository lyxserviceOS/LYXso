// app/(protected)/settings/billing/BillingPageClient.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { getApiBaseUrl } from '@/lib/apiConfig';

const API_BASE = getApiBaseUrl();
const ORG_ID = process.env.NEXT_PUBLIC_ORG_ID;

type Invoice = {
  id: string;
  invoice_number: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  due_date: string;
  paid_at?: string;
  pdf_url?: string;
};

export default function BillingPageClient() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<any>(null);

  useEffect(() => {
    fetchInvoices();
    fetchPaymentMethod();
  }, []);

  async function fetchInvoices() {
    try {
      // TODO: Implementer faktura-endpoint når Stripe er koblet til
      // const res = await fetch(`${API_BASE}/api/orgs/${ORG_ID}/invoices`);
      // if (res.ok) {
      //   const data = await res.json();
      //   setInvoices(data.invoices || []);
      // }
      
      // Dummy data for nå
      setInvoices([
        {
          id: '1',
          invoice_number: 'INV-2024-001',
          amount: 499,
          status: 'paid',
          due_date: '2024-01-31',
          paid_at: '2024-01-15',
          pdf_url: '/invoices/INV-2024-001.pdf'
        },
        {
          id: '2',
          invoice_number: 'INV-2024-002',
          amount: 499,
          status: 'paid',
          due_date: '2024-02-29',
          paid_at: '2024-02-10',
          pdf_url: '/invoices/INV-2024-002.pdf'
        },
        {
          id: '3',
          invoice_number: 'INV-2024-003',
          amount: 499,
          status: 'pending',
          due_date: '2024-03-31',
          pdf_url: '/invoices/INV-2024-003.pdf'
        },
      ]);
    } catch (err) {
      console.error('Error fetching invoices:', err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchPaymentMethod() {
    try {
      // TODO: Implementer payment method endpoint når Stripe er koblet til
      // const res = await fetch(`${API_BASE}/api/orgs/${ORG_ID}/payment-method`);
      // if (res.ok) {
      //   const data = await res.json();
      //   setPaymentMethod(data.paymentMethod);
      // }
      
      // Dummy data for nå
      setPaymentMethod({
        type: 'card',
        last4: '4242',
        brand: 'Visa',
        exp_month: 12,
        exp_year: 2025
      });
    } catch (err) {
      console.error('Error fetching payment method:', err);
    }
  }

  function getStatusBadge(status: string) {
    const styles = {
      paid: 'bg-emerald-100 text-emerald-800',
      pending: 'bg-amber-100 text-amber-800',
      overdue: 'bg-red-100 text-red-800'
    };

    const labels = {
      paid: 'Betalt',
      pending: 'Venter',
      overdue: 'Forfalt'
    };

    return (
      <span className={`inline-flex px-3 py-1 text-xs rounded-full ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Fakturering</h1>
        <p className="text-slate-600">Fakturahistorikk og betalingsinformasjon</p>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Betalingsmetode</h2>
            <p className="text-sm text-slate-600">Administrer din betalingsinformasjon</p>
          </div>
          <button className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors">
            Endre
          </button>
        </div>

        {paymentMethod ? (
          <div className="flex items-center gap-4 bg-slate-50 rounded-lg p-4">
            <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded flex items-center justify-center text-white font-bold text-xs">
              {paymentMethod.brand}
            </div>
            <div>
              <p className="font-medium text-slate-900">
                {paymentMethod.brand} •••• {paymentMethod.last4}
              </p>
              <p className="text-sm text-slate-600">
                Utløper {paymentMethod.exp_month}/{paymentMethod.exp_year}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-amber-800">Ingen betalingsmetode registrert</p>
          </div>
        )}
      </div>

      {/* Invoices */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">Fakturahistorikk</h2>

        {invoices.length === 0 ? (
          <p className="text-slate-500 text-center py-8">Ingen fakturaer ennå</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Fakturanummer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Dato
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Beløp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Handlinger
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm text-slate-900">
                        {invoice.invoice_number}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {new Date(invoice.due_date).toLocaleDateString('nb-NO')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-900">
                        {invoice.amount.toLocaleString('no-NO')} kr
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(invoice.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      {invoice.pdf_url && (
                        <a
                          href={invoice.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 mr-4"
                        >
                          Last ned PDF
                        </a>
                      )}
                      {invoice.status === 'pending' && (
                        <button className="text-emerald-600 hover:text-emerald-700">
                          Betal nå
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Billing Info */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Fakturaadresse</h2>
            <p className="text-sm text-slate-600">Adresse som vises på fakturaer</p>
          </div>
          <button className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors">
            Rediger
          </button>
        </div>

        <div className="bg-slate-50 rounded-lg p-4">
          <p className="font-medium text-slate-900">Din Bedrift AS</p>
          <p className="text-sm text-slate-600 mt-1">Eksempelveien 123</p>
          <p className="text-sm text-slate-600">0123 Oslo</p>
          <p className="text-sm text-slate-600 mt-2">Org.nr: 123 456 789</p>
        </div>
      </div>

      {/* Payment History Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <p className="text-sm text-slate-600 mb-1">Total betalt (i år)</p>
          <p className="text-2xl font-bold text-slate-900">
            {invoices
              .filter(i => i.status === 'paid')
              .reduce((sum, i) => sum + i.amount, 0)
              .toLocaleString('no-NO')} kr
          </p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <p className="text-sm text-slate-600 mb-1">Betalte fakturaer</p>
          <p className="text-2xl font-bold text-emerald-600">
            {invoices.filter(i => i.status === 'paid').length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <p className="text-sm text-slate-600 mb-1">Utestående</p>
          <p className="text-2xl font-bold text-amber-600">
            {invoices
              .filter(i => i.status === 'pending' || i.status === 'overdue')
              .reduce((sum, i) => sum + i.amount, 0)
              .toLocaleString('no-NO')} kr
          </p>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">Spørsmål om fakturering?</h3>
        <p className="text-sm text-blue-800 mb-4">
          Kontakt vår support hvis du har spørsmål om fakturaer eller betalinger.
        </p>
        <a
          href="mailto:support@lyxso.no"
          className="inline-flex px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          Kontakt support
        </a>
      </div>
    </div>
  );
}
