'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Target,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface MarketingROIData {
  summary: {
    period: {
      start: string;
      end: string;
    };
    totalSpent: number;
    totalRevenue: number;
    totalBookings: number;
    totalConversions: number;
    overallROI: number;
    overallROAS: number;
    avgCustomerAcquisitionCost: number;
    avgOrderValue: number;
  };
  channels: Channel[];
  insights: {
    topPerformers: Channel[];
    underperformers: Channel[];
    breakeven: Channel[];
    bestChannel: Channel | null;
    worstChannel: Channel | null;
    recommendations: Recommendation[];
  };
}

interface Channel {
  source: string;
  campaign: string;
  medium: string;
  bookings: number;
  revenue: number;
  conversions: number;
  avgOrderValue: number;
  conversionRate: number;
  spent: number;
  roi: number;
  roas: number;
  cac: number;
}

interface Recommendation {
  type: string;
  title: string;
  message: string;
  priority: string;
}

export default function MarketingROIClient() {
  const [data, setData] = useState<MarketingROIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    // Set default dates (last 90 days)
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 90);
    
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
    
    fetchMarketingROI(start.toISOString(), end.toISOString());
  }, []);

  const fetchMarketingROI = async (start?: string, end?: string) => {
    try {
      setLoading(true);
      const orgId = localStorage.getItem('org_id');
      if (!orgId) throw new Error('Organization ID not found');

      const params = new URLSearchParams();
      if (start) params.append('startDate', start);
      if (end) params.append('endDate', end);

      const response = await fetch(`/api/org/analytics/marketing-roi?${params}`);
      if (!response.ok) throw new Error('Failed to fetch marketing ROI data');
      
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = () => {
    if (startDate && endDate) {
      fetchMarketingROI(new Date(startDate).toISOString(), new Date(endDate).toISOString());
    }
  };

  const getROIColor = (roi: number) => {
    if (roi > 100) return 'text-green-600';
    if (roi > 0) return 'text-blue-600';
    return 'text-red-600';
  };

  const getROIBadgeColor = (roi: number) => {
    if (roi > 100) return 'bg-green-100 text-green-800';
    if (roi > 0) return 'bg-blue-100 text-blue-800';
    return 'bg-red-100 text-red-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      critical: 'border-red-500 bg-red-50',
      high: 'border-orange-500 bg-orange-50',
      medium: 'border-yellow-500 bg-yellow-50',
      low: 'border-blue-500 bg-blue-50'
    };
    return colors[priority] || 'border-gray-500 bg-gray-50';
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, any> = {
      success: <CheckCircle2 className="h-5 w-5 text-green-600" />,
      warning: <AlertCircle className="h-5 w-5 text-yellow-600" />,
      danger: <AlertCircle className="h-5 w-5 text-red-600" />,
      info: <AlertCircle className="h-5 w-5 text-blue-600" />
    };
    return icons[type] || <AlertCircle className="h-5 w-5" />;
  };

  const exportToCSV = () => {
    if (!data) return;

    const headers = [
      'Source',
      'Campaign',
      'Medium',
      'Spent',
      'Revenue',
      'Bookings',
      'Conversions',
      'ROI %',
      'ROAS',
      'CAC',
      'Avg Order Value'
    ];

    const rows = data.channels.map(c => [
      c.source,
      c.campaign,
      c.medium,
      c.spent,
      c.revenue,
      c.bookings,
      c.conversions,
      c.roi.toFixed(2),
      c.roas.toFixed(2),
      c.cac.toFixed(2),
      c.avgOrderValue.toFixed(2)
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `marketing-roi-${Date.now()}.csv`;
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
          <h1 className="text-3xl font-bold mb-2">Marketing ROI Analysis</h1>
          <p className="text-gray-600">
            Analyser marketing effektivitet, ROI og optimaliser kampanjer
          </p>
        </div>
        <Button onClick={exportToCSV} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Eksporter CSV
        </Button>
      </div>

      {/* Date Range Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Tidsperiode</CardTitle>
          <CardDescription>Velg datoperiode for analyse</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Fra dato</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Til dato</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <Button onClick={handleDateChange}>Oppdater</Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Totalt Brukt</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.summary.totalSpent.toLocaleString('nb-NO')} kr
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Marketing investering
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Inntekt</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.summary.totalRevenue.toLocaleString('nb-NO')} kr
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Fra marketing kanaler
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Samlet ROI</CardTitle>
            <BarChart3 className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getROIColor(data.summary.overallROI)}`}>
              {data.summary.overallROI.toFixed(1)}%
            </div>
            <p className="text-xs text-gray-500 mt-1">
              ROAS: {data.summary.overallROAS.toFixed(2)}x
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Gj.snitt CAC</CardTitle>
            <Target className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.summary.avgCustomerAcquisitionCost.toLocaleString('nb-NO')} kr
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {data.summary.totalConversions} konverteringer
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      {data.insights.recommendations.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Anbefalinger</h2>
          {data.insights.recommendations.map((rec, index) => (
            <Card key={index} className={`border-l-4 ${getPriorityColor(rec.priority)}`}>
              <CardHeader>
                <div className="flex items-start gap-3">
                  {getTypeIcon(rec.type)}
                  <div className="flex-1">
                    <CardTitle className="text-base">{rec.title}</CardTitle>
                    <CardDescription className="mt-2">{rec.message}</CardDescription>
                  </div>
                  <Badge variant="outline" className="uppercase text-xs">
                    {rec.priority}
                  </Badge>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {/* Channel Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Kanal Performance</CardTitle>
          <CardDescription>
            Detaljert oversikt over alle marketing kanaler
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kanal</TableHead>
                  <TableHead className="text-right">Brukt</TableHead>
                  <TableHead className="text-right">Inntekt</TableHead>
                  <TableHead className="text-right">ROI</TableHead>
                  <TableHead className="text-right">ROAS</TableHead>
                  <TableHead className="text-right">Bookinger</TableHead>
                  <TableHead className="text-right">Konverteringer</TableHead>
                  <TableHead className="text-right">CAC</TableHead>
                  <TableHead className="text-right">Gj.snitt Ordre</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.channels.map((channel, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{channel.source}</div>
                        <div className="text-sm text-gray-500">
                          {channel.campaign} • {channel.medium}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {channel.spent.toLocaleString('nb-NO')} kr
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {channel.revenue.toLocaleString('nb-NO')} kr
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge className={getROIBadgeColor(channel.roi)}>
                        {channel.roi > 0 ? (
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3 mr-1" />
                        )}
                        {channel.roi.toFixed(1)}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {channel.roas.toFixed(2)}x
                    </TableCell>
                    <TableCell className="text-right">
                      {channel.bookings}
                    </TableCell>
                    <TableCell className="text-right">
                      {channel.conversions}
                      <div className="text-xs text-gray-500">
                        ({channel.conversionRate.toFixed(1)}%)
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {channel.cac.toLocaleString('nb-NO')} kr
                    </TableCell>
                    <TableCell className="text-right">
                      {channel.avgOrderValue.toLocaleString('nb-NO')} kr
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Top & Bottom Performers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Performers */}
        {data.insights.topPerformers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                Topp Ytere
              </CardTitle>
              <CardDescription>Kanaler med ROI over 100%</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.insights.topPerformers.map((channel, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <div>
                      <div className="font-medium">{channel.source}</div>
                      <div className="text-sm text-gray-600">{channel.campaign}</div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      ROI: {channel.roi.toFixed(0)}%
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Underperformers */}
        {data.insights.underperformers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingDown className="h-5 w-5 mr-2 text-red-600" />
                Underperformers
              </CardTitle>
              <CardDescription>Kanaler med negativ ROI</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.insights.underperformers.map((channel, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <div>
                      <div className="font-medium">{channel.source}</div>
                      <div className="text-sm text-gray-600">{channel.campaign}</div>
                    </div>
                    <Badge className="bg-red-100 text-red-800">
                      ROI: {channel.roi.toFixed(0)}%
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
