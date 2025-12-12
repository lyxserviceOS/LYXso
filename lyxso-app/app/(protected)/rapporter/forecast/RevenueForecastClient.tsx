'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Calendar,
  BarChart3,
  LineChart,
  Download
} from 'lucide-react';

interface ForecastData {
  historical: MonthData[];
  forecast: ForecastMonth[];
  metrics: {
    avgMonthlyRevenue: number;
    monthlyGrowthRate: number;
    trend: string;
    predictedAnnualRevenue: number;
  };
}

interface MonthData {
  month: string;
  revenue: number;
}

interface ForecastMonth {
  month: string;
  predictedRevenue: number;
  confidence: string;
  lowerBound: number;
  upperBound: number;
}

export default function RevenueForecastClient() {
  const [data, setData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [forecastMonths, setForecastMonths] = useState('6');

  useEffect(() => {
    fetchForecast();
  }, [forecastMonths]);

  const fetchForecast = async () => {
    try {
      setLoading(true);
      const orgId = localStorage.getItem('org_id');
      if (!orgId) throw new Error('Organization ID not found');

      const response = await fetch(`/api/org/analytics/revenue-forecast?months=${forecastMonths}`);
      if (!response.ok) throw new Error('Failed to fetch forecast data');
      
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'increasing') return <TrendingUp className="h-5 w-5 text-green-600" />;
    if (trend === 'decreasing') return <TrendingDown className="h-5 w-5 text-red-600" />;
    return <LineChart className="h-5 w-5 text-gray-600" />;
  };

  const getTrendColor = (trend: string) => {
    if (trend === 'increasing') return 'text-green-600';
    if (trend === 'decreasing') return 'text-red-600';
    return 'text-gray-600';
  };

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('nb-NO', { year: 'numeric', month: 'long' });
  };

  const exportToCSV = () => {
    if (!data) return;

    const headers = ['Month', 'Type', 'Revenue', 'Lower Bound', 'Upper Bound'];
    
    const historicalRows = data.historical.map(h => [
      h.month,
      'Historical',
      h.revenue,
      '',
      ''
    ]);

    const forecastRows = data.forecast.map(f => [
      f.month,
      'Forecast',
      f.predictedRevenue,
      f.lowerBound,
      f.upperBound
    ]);

    const csv = [
      headers.join(','),
      ...historicalRows.map(r => r.join(',')),
      ...forecastRows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `revenue-forecast-${Date.now()}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">Error</CardTitle>
            <CardDescription className="text-red-600">{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!data) return null;

  const maxRevenue = Math.max(
    ...data.historical.map(h => h.revenue),
    ...data.forecast.map(f => f.upperBound)
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">Revenue Forecast</h1>
          <p className="text-gray-600">
            Prediker fremtidig inntekt basert på historiske data og trender
          </p>
        </div>
        <Button onClick={exportToCSV} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Eksporter CSV
        </Button>
      </div>

      {/* Forecast Period Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Prognoseperiode</CardTitle>
          <CardDescription>Velg hvor mange måneder fremover du vil se</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={forecastMonths} onValueChange={setForecastMonths}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Velg periode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 måneder</SelectItem>
              <SelectItem value="6">6 måneder</SelectItem>
              <SelectItem value="12">12 måneder</SelectItem>
              <SelectItem value="24">24 måneder</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Gj.snitt Månedsinn.</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.metrics.avgMonthlyRevenue.toLocaleString('nb-NO')} kr
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Basert på historikk
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Månedlig Vekst</CardTitle>
            {getTrendIcon(data.metrics.trend)}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getTrendColor(data.metrics.trend)}`}>
              {data.metrics.monthlyGrowthRate > 0 ? '+' : ''}
              {data.metrics.monthlyGrowthRate.toFixed(1)}%
            </div>
            <p className="text-xs text-gray-500 mt-1 capitalize">
              Trend: {data.metrics.trend}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Predikert Årsinnt.</CardTitle>
            <BarChart3 className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.metrics.predictedAnnualRevenue.toLocaleString('nb-NO')} kr
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Neste 12 måneder
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Prognoseperiode</CardTitle>
            <Calendar className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {forecastMonths} mnd
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {data.forecast.length} datapunkter
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Visual Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Inntekts Trend & Prognose</CardTitle>
          <CardDescription>
            Blå = Historisk data, Grønn = Prognose med konfidensintervall
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {/* Historical Data */}
            <div className="mb-6">
              <h4 className="font-semibold text-sm mb-3 text-gray-700">Historisk Data</h4>
              {data.historical.map((month, index) => (
                <div key={index} className="flex items-center gap-3 mb-2">
                  <div className="w-32 text-sm text-gray-600">
                    {formatMonth(month.month)}
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                    <div
                      className="bg-blue-500 h-full flex items-center justify-end pr-2"
                      style={{ width: `${(month.revenue / maxRevenue) * 100}%` }}
                    >
                      <span className="text-xs text-white font-medium">
                        {month.revenue.toLocaleString('nb-NO')} kr
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Forecast Data */}
            <div>
              <h4 className="font-semibold text-sm mb-3 text-gray-700">Prognose</h4>
              {data.forecast.map((month, index) => (
                <div key={index} className="flex items-center gap-3 mb-2">
                  <div className="w-32 text-sm text-gray-600">
                    {formatMonth(month.month)}
                  </div>
                  <div className="flex-1 relative">
                    {/* Confidence interval */}
                    <div className="absolute inset-0 bg-gray-100 rounded-full h-8 overflow-hidden">
                      <div
                        className="bg-green-100 h-full"
                        style={{ 
                          width: `${(month.upperBound / maxRevenue) * 100}%`,
                          marginLeft: `${(month.lowerBound / maxRevenue) * 100}%`
                        }}
                      />
                    </div>
                    {/* Predicted value */}
                    <div className="relative bg-gray-100 rounded-full h-8 overflow-hidden">
                      <div
                        className="bg-green-500 h-full flex items-center justify-end pr-2"
                        style={{ width: `${(month.predictedRevenue / maxRevenue) * 100}%` }}
                      >
                        <span className="text-xs text-white font-medium">
                          {month.predictedRevenue.toLocaleString('nb-NO')} kr
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {month.confidence}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Forecast Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detaljert Prognose</CardTitle>
          <CardDescription>
            Månedsvis prognose med konfidensintervall
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Måned</th>
                  <th className="text-right py-3 px-4">Predikert Inntekt</th>
                  <th className="text-right py-3 px-4">Laveste Estimat</th>
                  <th className="text-right py-3 px-4">Høyeste Estimat</th>
                  <th className="text-center py-3 px-4">Konfidans</th>
                </tr>
              </thead>
              <tbody>
                {data.forecast.map((month, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">
                      {formatMonth(month.month)}
                    </td>
                    <td className="text-right py-3 px-4 font-bold">
                      {month.predictedRevenue.toLocaleString('nb-NO')} kr
                    </td>
                    <td className="text-right py-3 px-4 text-gray-600">
                      {month.lowerBound.toLocaleString('nb-NO')} kr
                    </td>
                    <td className="text-right py-3 px-4 text-gray-600">
                      {month.upperBound.toLocaleString('nb-NO')} kr
                    </td>
                    <td className="text-center py-3 px-4">
                      <Badge variant="outline" className="capitalize">
                        {month.confidence}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Innsikt & Anbefalinger</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.metrics.trend === 'increasing' && (
            <div className="p-4 border-l-4 border-green-500 bg-green-50">
              <h4 className="font-semibold text-green-800 mb-1">
                Positiv veksttrend
              </h4>
              <p className="text-sm text-green-700">
                Inntekten vokser med {Math.abs(data.metrics.monthlyGrowthRate).toFixed(1)}% per måned. 
                Fortsett dagens strategi og vurder å skalere marketing investeringer.
              </p>
            </div>
          )}

          {data.metrics.trend === 'decreasing' && (
            <div className="p-4 border-l-4 border-red-500 bg-red-50">
              <h4 className="font-semibold text-red-800 mb-1">
                Negativ trend oppdaget
              </h4>
              <p className="text-sm text-red-700">
                Inntekten synker med {Math.abs(data.metrics.monthlyGrowthRate).toFixed(1)}% per måned. 
                Vurder å justere prising, øke marketing eller forbedre kundeopplevelsen.
              </p>
            </div>
          )}

          {data.metrics.trend === 'stable' && (
            <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
              <h4 className="font-semibold text-blue-800 mb-1">
                Stabil inntekt
              </h4>
              <p className="text-sm text-blue-700">
                Inntekten er stabil. Vurder vekstmuligheter som nye markeder, produkter eller tjenester 
                for å akselerere veksten.
              </p>
            </div>
          )}

          <div className="p-4 border-l-4 border-purple-500 bg-purple-50">
            <h4 className="font-semibold text-purple-800 mb-1">
              Prognose metodikk
            </h4>
            <p className="text-sm text-purple-700">
              Prognosen er basert på lineær regresjon av historiske data fra de siste 12 månedene. 
              Konfidensintervallet representerer ±20% varians. For mer nøyaktige prognoser, 
              vurder å inkludere sesongvariasjoner og eksterne faktorer.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
