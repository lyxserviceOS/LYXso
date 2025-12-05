'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from 'react-hot-toast'
import { 
  Settings, 
  Calendar, 
  Users, 
  Package, 
  Truck, 
  Wrench,
  Sparkles,
  DollarSign,
  BarChart3,
  MessageSquare,
  Building2,
  Shield,
  Zap,
  CheckCircle2,
  XCircle,
  Info,
  Search,
  Save
} from 'lucide-react'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton'
import { useOptimisticUpdate } from '@/hooks/useOptimisticUpdate'

interface Module {
  id: string
  category: string
  name: string
  description: string
  icon: any
  enabled: boolean
  premium: boolean
  price?: number
}

const MODULE_DEFINITIONS: Module[] = [
  // Generelt
  {
    id: 'booking',
    category: 'Generelt',
    name: 'Booking',
    description: 'Online booking og tidsbestilling for kunder',
    icon: Calendar,
    enabled: true,
    premium: false
  },
  {
    id: 'calendar',
    category: 'Generelt',
    name: 'Kalenderboard',
    description: 'Oversikt over alle avtaler og bookinger',
    icon: Calendar,
    enabled: true,
    premium: false
  },
  {
    id: 'customers',
    category: 'Generelt',
    name: 'Kunderegister',
    description: 'Komplett database over kunder og kjøretøy',
    icon: Users,
    enabled: true,
    premium: false
  },
  {
    id: 'queue',
    category: 'Generelt',
    name: 'Køsystem',
    description: 'Håndter ventelister og drop-in kunder',
    icon: Users,
    enabled: false,
    premium: true,
    price: 299
  },
  {
    id: 'staff_planning',
    category: 'Generelt',
    name: 'Ansattplanlegging',
    description: 'Vaktplaner, fravær og timeregistrering',
    icon: Users,
    enabled: false,
    premium: true,
    price: 499
  },
  {
    id: 'settings',
    category: 'Generelt',
    name: 'Bedriftsinnstillinger',
    description: 'Konfigurer bedriftsprofil og preferanser',
    icon: Settings,
    enabled: true,
    premium: false
  },
  
  // Varelager / Leverandører
  {
    id: 'inventory',
    category: 'Varelager',
    name: 'Varelager',
    description: 'Lagerstyring med min/maks nivåer',
    icon: Package,
    enabled: false,
    premium: true,
    price: 599
  },
  {
    id: 'barcode_qr',
    category: 'Varelager',
    name: 'Strekkode & QR',
    description: 'Scan produkter med mobilkamera',
    icon: Package,
    enabled: false,
    premium: true,
    price: 299
  },
  {
    id: 'supplier_comparison',
    category: 'Varelager',
    name: 'Leverandørprisjakt',
    description: 'Sammenlign priser fra Mekonomen, GS, BilXtra ++',
    icon: Truck,
    enabled: false,
    premium: true,
    price: 799
  },
  {
    id: 'auto_ordering',
    category: 'Varelager',
    name: 'Automatisk bestilling',
    description: 'AI bestiller deler automatisk ved lavt lager',
    icon: Zap,
    enabled: false,
    premium: true,
    price: 999
  },
  {
    id: 'parts_accessories',
    category: 'Varelager',
    name: 'Deler & tilbehør',
    description: 'Database over bildeler og tilbehør',
    icon: Wrench,
    enabled: false,
    premium: true,
    price: 399
  },
  
  // Bilmoduler
  {
    id: 'tire_hotel',
    category: 'Bilmoduler',
    name: 'Dekkhotell',
    description: 'Lagring og administrasjon av dekk',
    icon: Package,
    enabled: false,
    premium: true,
    price: 699
  },
  {
    id: 'coating',
    category: 'Bilmoduler',
    name: 'Coating',
    description: 'Coating-pakker og oppfølgingsplaner',
    icon: Sparkles,
    enabled: false,
    premium: true,
    price: 499
  },
  {
    id: 'paint_damage',
    category: 'Bilmoduler',
    name: 'Lakk og skade',
    description: 'Skaderegistrering med AI-analyse',
    icon: Wrench,
    enabled: false,
    premium: true,
    price: 799
  },
  {
    id: 'ppf',
    category: 'Bilmoduler',
    name: 'PPF',
    description: 'Paint Protection Film workflows',
    icon: Shield,
    enabled: false,
    premium: true,
    price: 699
  },
  {
    id: 'wrapping',
    category: 'Bilmoduler',
    name: 'Foliering',
    description: 'Bilfoliering og wrapping',
    icon: Sparkles,
    enabled: false,
    premium: true,
    price: 499
  },
  {
    id: 'car_rental',
    category: 'Bilmoduler',
    name: 'Bilutleie / Tilhengerutleie',
    description: 'Administrer utleiebiler og tilhengere',
    icon: Truck,
    enabled: false,
    premium: true,
    price: 899
  },
  
  // Økonomi
  {
    id: 'invoicing',
    category: 'Økonomi',
    name: 'Faktura',
    description: 'Opprett og send fakturaer',
    icon: DollarSign,
    enabled: true,
    premium: false
  },
  {
    id: 'accounting',
    category: 'Økonomi',
    name: 'Regnskap',
    description: 'Integrasjon med Fiken/Tripletex',
    icon: DollarSign,
    enabled: false,
    premium: true,
    price: 599
  },
  {
    id: 'payments',
    category: 'Økonomi',
    name: 'Betalinger',
    description: 'Vipps, Stripe, Klarna integrasjoner',
    icon: DollarSign,
    enabled: false,
    premium: true,
    price: 399
  },
  
  // AI-moduler
  {
    id: 'ai_booking_agent',
    category: 'AI',
    name: 'AI Booking Agent',
    description: 'AI-assistent som tar imot bookinger 24/7',
    icon: Sparkles,
    enabled: false,
    premium: true,
    price: 1299
  },
  {
    id: 'ai_inventory_assistant',
    category: 'AI',
    name: 'AI Lagerassistent',
    description: 'Foreslår innkjøp basert på forbruk',
    icon: Sparkles,
    enabled: false,
    premium: true,
    price: 799
  },
  {
    id: 'ai_upsell',
    category: 'AI',
    name: 'AI Mersalgsmotor',
    description: 'Foreslår relevante tjenester til kunde',
    icon: Sparkles,
    enabled: false,
    premium: true,
    price: 999
  },
  {
    id: 'ai_campaign',
    category: 'AI',
    name: 'AI Kampanje-generator',
    description: 'Lag markedsføringskampanjer automatisk',
    icon: Sparkles,
    enabled: false,
    premium: true,
    price: 899
  },
  {
    id: 'ai_damage_analysis',
    category: 'AI',
    name: 'AI DVI / Skadeanalyse',
    description: 'Automatisk skadegjenkjenning fra bilder',
    icon: Sparkles,
    enabled: false,
    premium: true,
    price: 1499
  },
  
  // Markedsføring
  {
    id: 'campaigns',
    category: 'Markedsføring',
    name: 'Kampanjesenter',
    description: 'Lag og administrer kampanjer',
    icon: MessageSquare,
    enabled: false,
    premium: true,
    price: 599
  },
  {
    id: 'google_reviews',
    category: 'Markedsføring',
    name: 'Google review-motor',
    description: 'Automatisk be om anmeldelser',
    icon: MessageSquare,
    enabled: false,
    premium: true,
    price: 399
  },
  {
    id: 'sms_flows',
    category: 'Markedsføring',
    name: 'Automatiske SMS-løp',
    description: 'Påminnelser og oppfølging via SMS',
    icon: MessageSquare,
    enabled: false,
    premium: true,
    price: 499
  },
  {
    id: 'customer_journey',
    category: 'Markedsføring',
    name: 'Kundereisen',
    description: 'Visualiser og optimaliser kundeopplevelsen',
    icon: BarChart3,
    enabled: false,
    premium: true,
    price: 799
  },
  
  // Kjeder
  {
    id: 'multi_location',
    category: 'Kjeder',
    name: 'Flere lokasjoner',
    description: 'Administrer flere verksteder fra ett sted',
    icon: Building2,
    enabled: false,
    premium: true,
    price: 1999
  },
  {
    id: 'central_reporting',
    category: 'Kjeder',
    name: 'Sentral rapportering',
    description: 'Samlet rapportering på tvers av lokasjoner',
    icon: BarChart3,
    enabled: false,
    premium: true,
    price: 999
  },
  {
    id: 'admin_roles',
    category: 'Kjeder',
    name: 'Adminroller',
    description: 'Avansert tilgangsstyring for kjeder',
    icon: Shield,
    enabled: false,
    premium: true,
    price: 699
  }
]

export default function ModulesControlClient() {
  const [loading, setLoading] = useState(true)
  const [modules, setModules] = useState<Module[]>(MODULE_DEFINITIONS)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('Alle')
  const [hasChanges, setHasChanges] = useState(false)
  
  const supabase = createClientComponentClient()
  const { executeUpdate, isUpdating } = useOptimisticUpdate()

  const categories = ['Alle', ...Array.from(new Set(MODULE_DEFINITIONS.map(m => m.category)))]

  useEffect(() => {
    loadModuleSettings()
  }, [])

  async function loadModuleSettings() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profileData } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single()

      if (!profileData?.organization_id) return

      const { data: settingsData } = await supabase
        .from('organization_settings')
        .select('enabled_modules')
        .eq('organization_id', profileData.organization_id)
        .single()

      if (settingsData?.enabled_modules) {
        const enabledModules = settingsData.enabled_modules as string[]
        setModules(prev => 
          prev.map(module => ({
            ...module,
            enabled: enabledModules.includes(module.id)
          }))
        )
      }
    } catch (error) {
      console.error('Error loading module settings:', error)
    } finally {
      setLoading(false)
    }
  }

  async function saveModuleSettings() {
    await executeUpdate(
      async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')

        const { data: profileData } = await supabase
          .from('profiles')
          .select('organization_id')
          .eq('id', user.id)
          .single()

        if (!profileData?.organization_id) throw new Error('No organization')

        const enabledModules = modules.filter(m => m.enabled).map(m => m.id)

        const { error } = await supabase
          .from('organization_settings')
          .upsert({
            organization_id: profileData.organization_id,
            enabled_modules: enabledModules,
            updated_at: new Date().toISOString()
          })

        if (error) throw error

        return { success: true }
      },
      {
        successMessage: 'Modulinnstillinger lagret!',
        errorMessage: 'Kunne ikke lagre innstillinger'
      }
    )
    
    setHasChanges(false)
  }

  function toggleModule(moduleId: string) {
    setModules(prev =>
      prev.map(module =>
        module.id === moduleId
          ? { ...module, enabled: !module.enabled }
          : module
      )
    )
    setHasChanges(true)
  }

  const filteredModules = modules.filter(module => {
    const matchesSearch = module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         module.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'Alle' || module.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const groupedModules = categories.reduce((acc, category) => {
    if (category === 'Alle') return acc
    acc[category] = filteredModules.filter(m => m.category === category)
    return acc
  }, {} as Record<string, Module[]>)

  const enabledCount = modules.filter(m => m.enabled).length
  const premiumCount = modules.filter(m => m.enabled && m.premium).length
  const totalMonthlyCost = modules
    .filter(m => m.enabled && m.premium)
    .reduce((sum, m) => sum + (m.price || 0), 0)

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSkeleton type="card" count={3} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Settings className="w-8 h-8 text-blue-600" />
              Moduler
            </h1>
            <p className="text-slate-600 mt-1">
              Skru av/på funksjoner basert på hva bedriften din trenger
            </p>
          </div>
          
          {hasChanges && (
            <button
              onClick={saveModuleSettings}
              disabled={isUpdating}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              Lagre endringer
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-600">Aktiverte moduler</h3>
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900">
              {enabledCount}
            </div>
            <p className="text-sm text-slate-600 mt-1">
              av {modules.length} tilgjengelige
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-600">Premium moduler</h3>
              <Sparkles className="w-5 h-5 text-amber-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900">
              {premiumCount}
            </div>
            <p className="text-sm text-slate-600 mt-1">
              premium funksjoner aktivert
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-600">Månedlig kostnad</h3>
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900">
              {totalMonthlyCost} kr
            </div>
            <p className="text-sm text-slate-600 mt-1">
              for premium funksjoner
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Søk etter moduler..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        {selectedCategory === 'Alle' ? (
          Object.entries(groupedModules).map(([category, categoryModules]) => (
            categoryModules.length > 0 && (
              <div key={category} className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  {category}
                  <span className="text-sm font-normal text-slate-500">
                    ({categoryModules.length})
                  </span>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryModules.map(module => (
                    <ModuleCard 
                      key={module.id}
                      module={module}
                      onToggle={toggleModule}
                    />
                  ))}
                </div>
              </div>
            )
          ))
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModules.map(module => (
              <ModuleCard 
                key={module.id}
                module={module}
                onToggle={toggleModule}
              />
            ))}
          </div>
        )}

        {filteredModules.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-12 text-center">
            <Search className="w-12 h-12 mx-auto mb-4 text-slate-400" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Ingen moduler funnet
            </h3>
            <p className="text-slate-600">
              Prøv et annet søk eller velg en annen kategori
            </p>
          </div>
        )}

      </div>
    </div>
  )
}

function ModuleCard({ 
  module, 
  onToggle 
}: { 
  module: Module
  onToggle: (id: string) => void 
}) {
  const Icon = module.icon

  return (
    <div className={`bg-white rounded-xl shadow-lg border-2 transition-all ${
      module.enabled 
        ? 'border-blue-500 ring-2 ring-blue-100' 
        : 'border-slate-200 hover:border-slate-300'
    }`}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl ${
            module.enabled ? 'bg-blue-100' : 'bg-slate-100'
          }`}>
            <Icon className={`w-6 h-6 ${
              module.enabled ? 'text-blue-600' : 'text-slate-600'
            }`} />
          </div>
          
          <button
            onClick={() => onToggle(module.id)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              module.enabled ? 'bg-blue-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                module.enabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-slate-900">{module.name}</h3>
            {module.premium && (
              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                Premium
              </span>
            )}
          </div>
          <p className="text-sm text-slate-600">{module.description}</p>
        </div>

        {module.premium && module.price && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <span className="text-sm text-slate-600">Pris</span>
            <span className="font-semibold text-slate-900">{module.price} kr/mnd</span>
          </div>
        )}

        {module.enabled && (
          <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
            <CheckCircle2 className="w-4 h-4" />
            <span className="font-medium">Aktivert</span>
          </div>
        )}
      </div>
    </div>
  )
}
