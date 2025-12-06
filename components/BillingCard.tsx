// lyxso-app/components/BillingCard.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  getCurrentSubscription, 
  cancelSubscription, 
  reactivateSubscription,
  getCustomerPortalUrl,
  getInvoices,
  formatCurrency 
} from '@/lib/stripe';
import toast from 'react-hot-toast';

interface BillingCardProps {
  orgId: string;
}

interface Subscription {
  id: string;
  status: string;
  plan_id: string;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
}

interface Invoice {
  id: string;
  number: string;
  amount: number;
  currency: string;
  status: string;
  paid: boolean;
  created: string;
  pdf_url: string;
  hosted_url: string;
}

export default function BillingCard({ orgId }: BillingCardProps) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadBillingData();
  }, [orgId]);

  async function loadBillingData() {
    try {
      setLoading(true);
      
      const [subData, invoicesData] = await Promise.all([
        getCurrentSubscription(orgId),
        getInvoices(orgId, 5),
      ]);

      setSubscription(subData.subscription);
      setInvoices(invoicesData.invoices || []);
    } catch (error) {
      console.error('Failed to load billing data:', error);
      toast.error('Kunne ikke laste faktureringsdata');
    } finally {
      setLoading(false);
    }
  }

  async function handleCancelSubscription() {
    if (!confirm('Er du sikker på at du vil kansellere abonnementet? Du vil fortsatt ha tilgang til slutten av perioden.')) {
      return;
    }

    try {
      setActionLoading(true);
      await cancelSubscription(orgId, false);
      toast.success('Abonnement kansellert. Du har tilgang til slutten av perioden.');
      await loadBillingData();
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      toast.error('Kunne ikke kansellere abonnement');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleReactivateSubscription() {
    try {
      setActionLoading(true);
      await reactivateSubscription(orgId);
      toast.success('Abonnement reaktivert!');
      await loadBillingData();
    } catch (error) {
      console.error('Failed to reactivate subscription:', error);
      toast.error('Kunne ikke reaktivere abonnement');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleOpenPortal() {
    try {
      setActionLoading(true);
      await getCustomerPortalUrl(orgId);
    } catch (error) {
      console.error('Failed to open portal:', error);
      toast.error('Kunne ikke åpne kundeportal');
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Subscription Card */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Abonnement</h2>
        
        {subscription ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-medium">
                    {subscription.plan_id === process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_STARTER && 'Starter'}
                    {subscription.plan_id === process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_GROWTH && 'Growth'}
                    {subscription.plan_id === process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_ENTERPRISE && 'Enterprise'}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    subscription.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : subscription.status === 'canceled'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {subscription.status === 'active' && 'Aktiv'}
                    {subscription.status === 'canceled' && 'Kansellert'}
                    {subscription.status === 'trialing' && 'Prøveperiode'}
                    {subscription.status === 'past_due' && 'Forfalt'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Fornyes {new Date(subscription.current_period_end).toLocaleDateString('nb-NO', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
                {subscription.cancel_at_period_end && (
                  <p className="text-sm text-orange-600 mt-1">
                    ⚠️ Abonnementet vil ikke fornyes
                  </p>
                )}
              </div>
              <button
                onClick={handleOpenPortal}
                disabled={actionLoading}
                className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-600 hover:border-blue-700 rounded-lg transition-colors disabled:opacity-50"
              >
                Administrer
              </button>
            </div>

            <div className="flex gap-3">
              {subscription.cancel_at_period_end ? (
                <button
                  onClick={handleReactivateSubscription}
                  disabled={actionLoading}
                  className="px-4 py-2 text-sm font-medium text-green-600 hover:text-green-700 border border-green-600 hover:border-green-700 rounded-lg transition-colors disabled:opacity-50"
                >
                  Reaktiver abonnement
                </button>
              ) : (
                <button
                  onClick={handleCancelSubscription}
                  disabled={actionLoading}
                  className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 border border-red-600 hover:border-red-700 rounded-lg transition-colors disabled:opacity-50"
                >
                  Kanseller abonnement
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Du har ikke noe aktivt abonnement</p>
            <a
              href="/priser"
              className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Se priser og planer
            </a>
          </div>
        )}
      </div>

      {/* Invoices Card */}
      {invoices.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Fakturaer</h2>
          
          <div className="space-y-3">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                <div>
                  <p className="font-medium">
                    {invoice.number || 'Faktura'} - {formatCurrency(invoice.amount, invoice.currency)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(invoice.created).toLocaleDateString('nb-NO', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    invoice.paid 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {invoice.paid ? 'Betalt' : 'Ubetalt'}
                  </span>
                  {invoice.pdf_url && (
                    <a
                      href={invoice.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Last ned
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {invoices.length >= 5 && (
            <button
              onClick={handleOpenPortal}
              className="mt-4 text-sm text-blue-600 hover:text-blue-700"
            >
              Se alle fakturaer →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
