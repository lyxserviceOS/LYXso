# Refactor remaining AI modules script

$modules = @(
    @{
        name = "crm"
        title = "AI CRM Assistent"
        desc = "AI-drevet kundebehandling og relasjonsledelse"
        icon = "Users"
        color = "blue"
        stats = @(
            "{ label: 'Kunder', value: '287', icon: Users, color: 'text-blue-600', subtitle: 'Aktive' }",
            "{ label: 'Lojalitet', value: '8.4', icon: Star, color: 'text-yellow-600', subtitle: 'Gj.snitt' }",
            "{ label: 'Engagement', value: '76%', icon: Heart, color: 'text-pink-600', subtitle: 'Respons' }",
            "{ label: 'Vekst', value: '+23%', icon: TrendingUp, color: 'text-green-600', subtitle: 'Retention' }"
        )
        features = @(
            "'Personaliser meldinger basert på kundehistorikk'",
            "'Identifiser churn-risiko tidlig'",
            "'Foreslå beste tidspunkt for oppfølging'"
        )
    },
    @{
        name = "capacity"
        title = "AI Kapasitetsplanlegger"
        desc = "AI-drevet ressursplanlegging og kapasitetsoptimalisering"
        icon = "BarChart3"
        color = "purple"
        stats = @(
            "{ label: 'Utnyttelse', value: '82%', icon: BarChart3, color: 'text-purple-600', subtitle: 'Gjennomsnitt' }",
            "{ label: 'Ledige timer', value: '24', icon: Clock, color: 'text-blue-600', subtitle: 'Neste uke' }",
            "{ label: 'Bookbare', value: '156', icon: Calendar, color: 'text-green-600', subtitle: 'Slots' }",
            "{ label: 'Optimalisering', value: '+18%', icon: TrendingUp, color: 'text-orange-600', subtitle: 'Forbedring' }"
        )
        features = @(
            "'Optimaliser ressursallokering'",
            "'Prediker toppbelastning'",
            "'Balanser kapasitet automatisk'"
        )
    },
    @{
        name = "coatvision"
        title = "LYX Vision - AI Bilanalyse"
        desc = "AI-drevet bildeanalyse for skader og tilstandsvurdering"
        icon = "Scan"
        color = "emerald"
        stats = @(
            "{ label: 'Analysert', value: '1.2k', icon: Image, color: 'text-emerald-600', subtitle: 'Bilder' }",
            "{ label: 'Nøyaktighet', value: '96%', icon: Target, color: 'text-green-600', subtitle: 'Presisjon' }",
            "{ label: 'Tid spart', value: '45min', icon: Clock, color: 'text-blue-600', subtitle: 'Per analyse' }",
            "{ label: 'Skader funnet', value: '87', icon: AlertCircle, color: 'text-red-600', subtitle: 'Identifisert' }"
        )
        features = @(
            "'Identifiser skader automatisk'",
            "'Vurder lakkstand og kvalitet'",
            "'Generer tilstandsrapporter'"
        )
    },
    @{
        name = "inventory"
        title = "AI Lager Assistent"
        desc = "AI-drevet lagerstyring og etterfylling"
        icon = "Package"
        color = "amber"
        stats = @(
            "{ label: 'Produkter', value: '342', icon: Package, color: 'text-amber-600', subtitle: 'På lager' }",
            "{ label: 'Verdi', value: '285k', icon: DollarSign, color: 'text-green-600', subtitle: 'Lagerverdi' }",
            "{ label: 'Etterfylling', value: '12', icon: TrendingDown, color: 'text-red-600', subtitle: 'Trengs' }",
            "{ label: 'Predikert', value: '94%', icon: Brain, color: 'text-purple-600', subtitle: 'Nøyaktighet' }"
        )
        features = @(
            "'Prediker lagerbehov'",
            "'Optimaliser bestillinger'",
            "'Identifiser langsomgående varer'"
        )
    },
    @{
        name = "pricing"
        title = "AI Prissetting"
        desc = "AI-drevet dynamisk prissetting og konkurranseanalyse"
        icon = "DollarSign"
        color = "green"
        stats = @(
            "{ label: 'Margin', value: '68%', icon: Percent, color: 'text-green-600', subtitle: 'Gjennomsnitt' }",
            "{ label: 'Konkurrenter', value: '24', icon: Users, color: 'text-blue-600', subtitle: 'Overvåket' }",
            "{ label: 'Prisjusteringer', value: '156', icon: TrendingUp, color: 'text-purple-600', subtitle: 'Automatiske' }",
            "{ label: 'Revenue', value: '+12%', icon: DollarSign, color: 'text-emerald-600', subtitle: 'Økning' }"
        )
        features = @(
            "'Dynamisk prissetting basert på etterspørsel'",
            "'Konkurranseovervåking'",
            "'Optimaliser marginer automatisk'"
        )
    },
    @{
        name = "upsell"
        title = "AI Upsell Assistent"
        desc = "AI-drevet mersalg og produktanbefalinger"
        icon = "TrendingUp"
        color = "indigo"
        stats = @(
            "{ label: 'Upsells', value: '234', icon: ShoppingCart, color: 'text-indigo-600', subtitle: 'Denne måneden' }",
            "{ label: 'Rate', value: '42%', icon: Percent, color: 'text-green-600', subtitle: 'Accept' }",
            "{ label: 'Ekstra omsetning', value: '125k', icon: DollarSign, color: 'text-emerald-600', subtitle: 'Fra AI' }",
            "{ label: 'AOV', value: '+35%', icon: TrendingUp, color: 'text-purple-600', subtitle: 'Økning' }"
        )
        features = @(
            "'Intelligent produktanbefaling'",
            "'Optimaliser bundling'",
            "'Identifiser upsell-muligheter'"
        )
    },
    @{
        name = "chat"
        title = "AI Chat Support"
        desc = "AI-drevet kundeservice og live chat"
        icon = "MessageCircle"
        color = "cyan"
        stats = @(
            "{ label: 'Samtaler', value: '1.2k', icon: MessageCircle, color: 'text-cyan-600', subtitle: 'Denne måneden' }",
            "{ label: 'Responstid', value: '< 2s', icon: Clock, color: 'text-green-600', subtitle: 'Gjennomsnitt' }",
            "{ label: 'Løst av AI', value: '78%', icon: CheckCircle, color: 'text-blue-600', subtitle: 'Automatisk' }",
            "{ label: 'Fornøydhet', value: '4.8', icon: Star, color: 'text-yellow-600', subtitle: 'Rating' }"
        )
        features = @(
            "'24/7 AI kundeservice'",
            "'Automatisk FAQ-respons'",
            "'Smart eskalering til menneske'"
        )
    }
)

Write-Output "Starting refactoring of $($modules.Count) modules..."

foreach ($module in $modules) {
    $content = @"
'use client';

import { useOrgPlan } from '@/components/OrgPlanContext';
import { AIModuleLayout } from '@/components/ai/AIModuleLayout';
import { $($module.icon) } from 'lucide-react';

export default function AI$($module.name.Substring(0,1).ToUpper() + $module.name.Substring(1))Page() {
  const { org } = useOrgPlan();

  const QuickAction = (
    <div className="p-8 text-center">
      <$($module.icon) className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <p className="text-gray-500">Funksjoner kommer snart</p>
    </div>
  );

  return (
    <AIModuleLayout
      module="$($module.name)"
      title="$($module.title)"
      description="$($module.desc)"
      icon={$($module.icon)}
      stats={[
        $($module.stats -join ",`n        ")
      ]}
      chatContext="$($module.name)"
      chatWelcomeMessage="Hei! Jeg er din AI $($module.name)-assistent."
      chatPlaceholder="Spør om $($module.name)-hjelp..."
      quickAction={QuickAction}
      features={[
        $($module.features -join ",`n        ")
      ]}
      requiredPlan="professional"
      orgId={org?.id || ''}
      hasAccess={true}
    />
  );
}
"@

    $filePath = "lyxso-app\app\(protected)\ai\$($module.name)\page.tsx"
    $content | Out-File -FilePath $filePath -Encoding UTF8
    Write-Output "✓ Refactored $($module.name)"
}

Write-Output "`nAll modules refactored successfully!"
