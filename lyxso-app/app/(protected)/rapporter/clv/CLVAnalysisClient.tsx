'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  AlertTriangle,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Download
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface CLVData {
  summary: {
    totalCustomers: number;
    avgCustomerLifetimeValue: number;
    totalHistoricValue: number;
    totalPredictedValue: number;
    potentialRevenue: number;
    segmentDistribution: Record<string, number>;
    churnRiskDistribution: Record<string, number>;
  };
  topCustomers: CustomerMetric[];
  allCustomers: CustomerMetric[];
}

interface CustomerMetric {
  id: string;
  name: string;
  email: string;
  customerSince: string;
  totalRevenue: number;
  totalPaid: number;
  totalBookings: number;
  avgOrderValue: number;
  purchaseFrequency: number;
  daysSinceLastPurchase: number | null;
  lastBookingDate: string | null;
  historicCLV: number;
  predictedCLV: number;
  customerLifetimeYears: number;
  segment: string;
  churnRisk: string;
  profitabilityScore: number;
}

export default function CLVAnalysisClient() {
  const [data, setData] = useState<CLVData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCLVData();
  }, [selectedSegment]);

  const fetchCLVData = async () => {
    try {
      setLoading(true);
      const orgId = localStorage.getItem('org_id');
      if (!orgId) throw new Error('Organization ID not found');

      const response = await fetch(`/api/org/analytics/clv?segment=${selectedSegment}`);
      if (!response.ok) throw new Error('Failed to fetch CLV data');
      
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getSegmentColor = (segment: string) => {
    const colors: Record<string, string> = {
      champion: 'bg-purple-100 text-purple-800',
      loyal: 'bg-blue-100 text-blue-800',
      promising: 'bg-green-100 text-green-800',
      new: 'bg-gray-100 text-gray-800',
      'at-risk': 'bg-red-100 text-red-800'
    };
    return colors[segment] || 'bg-gray-100 text-gray-800';
  };

  const getChurnRiskColor = (risk: string) => {
    const colors: Record<string, string> = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    return colors[risk] || 'bg-gray-100 text-gray-800';
  };

  const exportToCSV = () => {
    if (!data) return;

    const headers = [
      'Name',
      'Email',
      'Customer Since',
      'Total Revenue',
      'Bookings',
      'Avg Order Value',
      'Predicted CLV',
      'Segment',
      'Churn Risk'
    ];

    const rows = data.allCustomers.map(c => [
      c.name,
      c.email,
      new Date(c.customerSince).toLocaleDateString(),
      c.totalRevenue,
      c.totalBookings,
      c.avgOrderValue.toFixed(2),
      c.predictedCLV.toFixed(2),
      c.segment,
      c.churnRisk
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clv-analysis-${Date.now()}.csv`;
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">Customer Lifetime Value Analysis</h1>
          <p className="text-gray-600">
            Analyser kundeverdi, segmenter og identifiser vekstmuligheter
          </p>
        </div>
        <Button onClick={exportToCSV} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Eksporter CSV
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Totale Kunder</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.summary.totalCustomers}</div>
            <p className="text-xs text-gray-500 mt-1">
              Aktive kundeforhold
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Gjennomsnittlig CLV</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.summary.avgCustomerLifetimeValue.toLocaleString('nb-NO')} kr
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Per kunde over levetid
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Potensiell Inntekt</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {data.summary.potentialRevenue.toLocaleString('nb-NO')} kr
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Estimert fremtidig verdi
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Kunder i Risiko</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {data.summary.churnRiskDistribution.high || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Høy churn-risiko
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Segment Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Kundesegmenter</CardTitle>
          <CardDescription>Filtrer kunder basert på segment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Select value={selectedSegment} onValueChange={setSelectedSegment}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Velg segment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle kunder</SelectItem>
                <SelectItem value="champion">Champions</SelectItem>
                <SelectItem value="loyal">Lojale</SelectItem>
                <SelectItem value="promising">Lovende</SelectItem>
                <SelectItem value="new">Nye</SelectItem>
                <SelectItem value="at-risk">I risiko</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2 flex-wrap">
              <Badge variant="secondary">
                <Award className="mr-1 h-3 w-3" />
                Champions: {data.summary.segmentDistribution.champion || 0}
              </Badge>
              <Badge variant="secondary">
                Lojale: {data.summary.segmentDistribution.loyal || 0}
              </Badge>
              <Badge variant="secondary">
                Lovende: {data.summary.segmentDistribution.promising || 0}
              </Badge>
              <Badge variant="secondary">
                Nye: {data.summary.segmentDistribution.new || 0}
              </Badge>
              <Badge variant="secondary">
                I risiko: {data.summary.segmentDistribution['at-risk'] || 0}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Topp 50 Kunder etter Predikert CLV</CardTitle>
          <CardDescription>
            Mest verdifulle kunder basert på historisk data og prediksjon
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kunde</TableHead>
                  <TableHead>Segment</TableHead>
                  <TableHead className="text-right">Historisk Verdi</TableHead>
                  <TableHead className="text-right">Predikert CLV</TableHead>
                  <TableHead className="text-right">Bookinger</TableHead>
                  <TableHead className="text-right">Gj.snitt Verdi</TableHead>
                  <TableHead>Churn Risiko</TableHead>
                  <TableHead className="text-right">Siste Booking</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.topCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-gray-500">{customer.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getSegmentColor(customer.segment)}>
                        {customer.segment}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {customer.historicCLV.toLocaleString('nb-NO')} kr
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end">
                        {customer.predictedCLV > customer.historicCLV ? (
                          <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                        )}
                        <span className="font-bold">
                          {customer.predictedCLV.toLocaleString('nb-NO')} kr
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{customer.totalBookings}</TableCell>
                    <TableCell className="text-right">
                      {customer.avgOrderValue.toLocaleString('nb-NO')} kr
                    </TableCell>
                    <TableCell>
                      <Badge className={getChurnRiskColor(customer.churnRisk)}>
                        {customer.churnRisk}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-sm text-gray-500">
                      {customer.lastBookingDate 
                        ? new Date(customer.lastBookingDate).toLocaleDateString('nb-NO')
                        : 'Ingen'
                      }
                      {customer.daysSinceLastPurchase && (
                        <div className="text-xs">
                          ({customer.daysSinceLastPurchase} dager siden)
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Innsikt & Anbefalinger</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.summary.churnRiskDistribution.high > 5 && (
            <div className="p-4 border-l-4 border-red-500 bg-red-50">
              <h4 className="font-semibold text-red-800 mb-1">
                Høy churn-risiko oppdaget
              </h4>
              <p className="text-sm text-red-700">
                {data.summary.churnRiskDistribution.high} kunder har høy risiko for churn. 
                Vurder å sende reaktiveringstilbud eller personlig oppfølging.
              </p>
            </div>
          )}

          {data.summary.segmentDistribution.champion > 0 && (
            <div className="p-4 border-l-4 border-purple-500 bg-purple-50">
              <h4 className="font-semibold text-purple-800 mb-1">
                Champion-kunder identifisert
              </h4>
              <p className="text-sm text-purple-700">
                Du har {data.summary.segmentDistribution.champion} champion-kunder. 
                Disse er perfekte for upsell, referrals og testimonials.
              </p>
            </div>
          )}

          {data.summary.potentialRevenue > data.summary.totalHistoricValue * 0.5 && (
            <div className="p-4 border-l-4 border-green-500 bg-green-50">
              <h4 className="font-semibold text-green-800 mb-1">
                Stort vekstpotensial
              </h4>
              <p className="text-sm text-green-700">
                Predikert fremtidig verdi er {Math.round((data.summary.potentialRevenue / data.summary.totalHistoricValue) * 100)}% 
                av historisk verdi. Fokuser på kundebevaring og øk frekvens.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
