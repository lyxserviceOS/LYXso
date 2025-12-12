'use client';

import { FileText, Download } from 'lucide-react';

type Invoice = {
  id: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string | null;
  total_amount: number;
  paid_amount: number;
  status: string;
  created_at: string;
};

type Props = {
  invoices: Invoice[];
};

export default function InvoicesList({ invoices }: Props) {
  if (invoices.length === 0) {
    return (
      <div className="card text-center py-12">
        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-600">Ingen fakturaer funnet</p>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    paid: 'bg-green-100 text-green-800',
    partially_paid: 'bg-yellow-100 text-yellow-800',
    sent: 'bg-blue-100 text-blue-800',
    overdue: 'bg-red-100 text-red-800',
    draft: 'bg-slate-100 text-slate-800',
  };

  const statusLabels: Record<string, string> = {
    paid: 'Betalt',
    partially_paid: 'Delvis betalt',
    sent: 'Sendt',
    overdue: 'Forfalt',
    draft: 'Utkast',
  };

  return (
    <div className="space-y-4">
      {invoices.map((invoice) => (
        <div key={invoice.id} className="card">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-slate-900">
                  Faktura {invoice.invoice_number}
                </h3>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded ${
                    statusColors[invoice.status] || 'bg-slate-100 text-slate-800'
                  }`}
                >
                  {statusLabels[invoice.status] || invoice.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-slate-600">Fakturadato: </span>
                  <span className="text-slate-900">
                    {new Date(invoice.invoice_date).toLocaleDateString('nb-NO')}
                  </span>
                </div>

                {invoice.due_date && (
                  <div>
                    <span className="text-slate-600">Forfallsdato: </span>
                    <span className="text-slate-900">
                      {new Date(invoice.due_date).toLocaleDateString('nb-NO')}
                    </span>
                  </div>
                )}

                <div>
                  <span className="text-slate-600">Beløp: </span>
                  <span className="font-semibold text-slate-900">
                    {invoice.total_amount.toLocaleString('nb-NO')} kr
                  </span>
                </div>

                {invoice.paid_amount > 0 && (
                  <div>
                    <span className="text-slate-600">Betalt: </span>
                    <span className="font-semibold text-green-600">
                      {invoice.paid_amount.toLocaleString('nb-NO')} kr
                    </span>
                  </div>
                )}
              </div>
            </div>

            {invoice.status !== 'draft' && (
              <button
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 hover:text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                onClick={() => {
                  // TODO: Implementer PDF-nedlasting
                  alert('PDF-nedlasting kommer snart!');
                }}
              >
                <Download className="w-4 h-4" />
                Last ned
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
