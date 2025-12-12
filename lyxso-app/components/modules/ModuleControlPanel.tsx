/**
 * MODULE CONTROL PANEL - UI Component
 * Allow organizations to enable/disable modules
 */
'use client';

import { useState, useEffect } from 'react';
import { 
  Package, Warehouse, TrendingUp, MapPin, Users, Calendar,
  PaintBucket, Shield, CreditCard, Star, Mail, BarChart3,
  Wrench, Clock, Car, ShoppingCart, FileText, Save
} from 'lucide-react';
import { showToast } from '@/lib/toast';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';

interface ModuleSettings {
  // Core
  booking_enabled: boolean;
  calendar_enabled: boolean;
  customer_management_enabled: boolean;
  queue_system_enabled: boolean;
  employee_scheduling_enabled: boolean;
  time_tracking_enabled: boolean;
  
  // Inventory & Suppliers
  inventory_enabled: boolean;
  supplier_hub_enabled: boolean;
  auto_ordering_enabled: boolean;
  barcode_scanning_enabled: boolean;
  
  // Vehicle Modules
  tire_hotel_enabled: boolean;
  coating_enabled: boolean;
  ppf_enabled: boolean;
  damage_inspection_enabled: boolean;
  vehicle_lookup_enabled: boolean;
  
  // Business
  payments_enabled: boolean;
  invoicing_enabled: boolean;
  accounting_integration_enabled: boolean;
  dynamic_pricing_enabled: boolean;
  
  // AI & Marketing
  ai_booking_agent_enabled: boolean;
  ai_recommendations_enabled: boolean;
  review_automation_enabled: boolean;
  marketing_campaigns_enabled: boolean;
  sms_notifications_enabled: boolean;
  
  // Multi-location
  multi_location_enabled: boolean;
  location_analytics_enabled: boolean;
  
  // Analytics
  analytics_enabled: boolean;
  advanced_reporting_enabled: boolean;
}

const MODULE_CATEGORIES = [
  {
    name: 'Kjernefunksjoner',
    icon: Package,
    modules: [
      { key: 'booking_enabled', label: 'Booking system', icon: Calendar, description: 'Håndter bookinger og avtaler' },
      { key: 'calendar_enabled', label: 'Kalender', icon: Calendar, description: 'Visuell kalender og planlegging' },
      { key: 'customer_management_enabled', label: 'Kundestyring', icon: Users, description: 'CRM og kundedata' },
      { key: 'queue_system_enabled', label: 'Køsystem', icon: Clock, description: 'Drop-in kø management' },
      { key: 'employee_scheduling_enabled', label: 'Ansattplanlegging', icon: Users, description: 'Vaktplan og scheduling' },
      { key: 'time_tracking_enabled', label: 'Tidsstemplingssystem', icon: Clock, description: 'WiFi-validert tidsregistrering' }
    ]
  },
  {
    name: 'Varelager & Leverandører',
    icon: Warehouse,
    modules: [
      { key: 'inventory_enabled', label: 'Varelager', icon: Package, description: 'Lagerstyring og beholdning' },
      { key: 'supplier_hub_enabled', label: 'Leverandørhub', icon: ShoppingCart, description: 'Mekonomen, GS Bildeler, Bildeler.no' },
      { key: 'auto_ordering_enabled', label: 'Automatisk bestilling', icon: ShoppingCart, description: 'Auto-reorder når lager er lavt' },
      { key: 'barcode_scanning_enabled', label: 'Strekkodeskanning', icon: Package, description: 'Mobilkamera telling' }
    ]
  },
  {
    name: 'Bilbransje',
    icon: Car,
    modules: [
      { key: 'tire_hotel_enabled', label: 'Dekkhotell 3.0', icon: Car, description: 'Med AI-diagnose og QR-koder' },
      { key: 'coating_enabled', label: 'Coating workflow', icon: PaintBucket, description: 'Lakkbeskyttelse og oppfølging' },
      { key: 'ppf_enabled', label: 'PPF workflow', icon: Shield, description: 'Paint Protection Film stages' },
      { key: 'damage_inspection_enabled', label: 'Skadeinspeksjon', icon: FileText, description: 'DVI og bildeanalyse' },
      { key: 'vehicle_lookup_enabled', label: 'Biloppslag', icon: Car, description: 'Hent bildata fra reg.nr.' }
    ]
  },
  {
    name: 'Økonomi & Betaling',
    icon: CreditCard,
    modules: [
      { key: 'payments_enabled', label: 'Betalinger', icon: CreditCard, description: 'Vipps, Stripe, Klarna' },
      { key: 'invoicing_enabled', label: 'Fakturering', icon: FileText, description: 'Generer og send fakturaer' },
      { key: 'accounting_integration_enabled', label: 'Regnskap', icon: BarChart3, description: 'Fiken / Tripletex sync' },
      { key: 'dynamic_pricing_enabled', label: 'Dynamisk prising', icon: TrendingUp, description: 'Smart prismotor' }
    ]
  },
  {
    name: 'AI & Markedsføring',
    icon: Star,
    modules: [
      { key: 'ai_booking_agent_enabled', label: 'AI Booking Agent', icon: Star, description: 'Automatisk booking via chat' },
      { key: 'ai_recommendations_enabled', label: 'AI Anbefalinger', icon: Star, description: 'Smart mersalg' },
      { key: 'review_automation_enabled', label: 'Review-automatisering', icon: Star, description: 'Google reviews på autopilot' },
      { key: 'marketing_campaigns_enabled', label: 'Markedsføring', icon: Mail, description: 'Email/SMS kampanjer' },
      { key: 'sms_notifications_enabled', label: 'SMS-varsler', icon: Mail, description: 'Twilio integrasjon' }
    ]
  },
  {
    name: 'Multi-lokasjon',
    icon: MapPin,
    modules: [
      { key: 'multi_location_enabled', label: 'Flere lokasjoner', icon: MapPin, description: 'Kjede-styring' },
      { key: 'location_analytics_enabled', label: 'Lokasjon-analyse', icon: BarChart3, description: 'Sammenlign avdelinger' }
    ]
  },
  {
    name: 'Analyse & Rapportering',
    icon: BarChart3,
    modules: [
      { key: 'analytics_enabled', label: 'Analytics', icon: BarChart3, description: 'Business metrics dashboard' },
      { key: 'advanced_reporting_enabled', label: 'Avansert rapportering', icon: FileText, description: 'Custom rapporter' }
    ]
  }
];

export default function ModuleControlPanel() {
  const [settings, setSettings] = useState<ModuleSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/modules');
      const data = await res.json();
      if (data.success) setSettings(data.modules);
    } catch (error) {
      showToast.error('Kunne ikke laste innstillinger');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (key: keyof ModuleSettings) => {
    if (!settings) return;
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      const res = await fetch('/api/modules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });

      const data = await res.json();

      if (!res.ok) {
        showToast.error(data.error || 'Kunne ikke lagre');
        return;
      }

      showToast.success('Innstillinger lagret!', {
        description: 'Modulene er oppdatert'
      });
    } catch (error) {
      showToast.error('Noe gikk galt');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSkeleton rows={10} />;
  if (!settings) return null;

  const enabledCount = Object.values(settings).filter(Boolean).length;
  const totalCount = Object.keys(settings).length;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Modulkontroll</h1>
        <p className="text-slate-600">Skru moduler av/på etter behov. Betal kun for det du bruker.</p>
        <div className="mt-4 flex items-center gap-4">
          <div className="text-sm text-slate-600">
            <span className="font-semibold text-blue-600">{enabledCount}</span> av {totalCount} moduler aktivert
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Lagrer...' : 'Lagre endringer'}
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-6">
        {MODULE_CATEGORIES.map((category) => {
          const CategoryIcon = category.icon;
          const categoryEnabledCount = category.modules.filter(m => settings[m.key as keyof ModuleSettings]).length;

          return (
            <div key={category.name} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CategoryIcon className="w-6 h-6 text-blue-600" />
                    <h2 className="text-lg font-bold text-slate-900">{category.name}</h2>
                  </div>
                  <div className="text-sm text-slate-600">
                    {categoryEnabledCount} / {category.modules.length} aktiv
                  </div>
                </div>
              </div>

              <div className="divide-y divide-slate-200">
                {category.modules.map((module) => {
                  const ModuleIcon = module.icon;
                  const isEnabled = settings[module.key as keyof ModuleSettings];

                  return (
                    <div key={module.key} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <ModuleIcon className={`w-5 h-5 ${isEnabled ? 'text-green-600' : 'text-slate-400'}`} />
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-900">{module.label}</h3>
                            <p className="text-sm text-slate-600">{module.description}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleToggle(module.key as keyof ModuleSettings)}
                          className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                            isEnabled ? 'bg-green-600' : 'bg-slate-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                              isEnabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
