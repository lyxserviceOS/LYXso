'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpIcon, ArrowDownIcon, TrendingUp, DollarSign, Users, Calendar } from 'lucide-react';
import RevenueChart from '@/components/reports/RevenueChart';
import BookingsChart from '@/components/reports/BookingsChart';
import CustomersTable from '@/components/reports/CustomersTable';

type DashboardData = {
  metrics?: Record<string, any>;
  trends?: {
    revenue_by_day?: any[];
    bookings_by_day?: any[];
  };
  top_customers?: any[];
};

export default function RapporterPage() {
  const [period, setPeriod] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetchDashboard();
  }, [period]);

  async function fetchDashboard() {
    setLoading(true);
    try {
      const response = await fetch(`/api/reports/dashboard?period=${period}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Laster rapporter...</p>
        </div>
      </div>
    );
  }

  const metrics = dashboardData?.metrics || {};

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Rapporter & Analytics</h1>
          <p className="text-muted-foreground">Oversikt over virksomhetens ytelse</p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Siste 7 dager</SelectItem>
            <SelectItem value="30d">Siste 30 dager</SelectItem>
            <SelectItem value="90d">Siste 90 dager</SelectItem>
            <SelectItem value="year">Siste år</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inntekt</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.revenue?.total?.toLocaleString('no-NO', { style: 'currency', currency: 'NOK' })}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {metrics.revenue?.growth > 0 ? (
                <><ArrowUpIcon className="h-3 w-3 text-green-600" /> +{metrics.revenue?.growth?.toFixed(1)}%</>
              ) : (
                <><ArrowDownIcon className="h-3 w-3 text-red-600" /> {metrics.revenue?.growth?.toFixed(1)}%</>
              )}
              <span className="ml-1">fra forrige periode</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bookinger</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.bookings?.total}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {metrics.bookings?.growth > 0 ? (
                <><ArrowUpIcon className="h-3 w-3 text-green-600" /> +{metrics.bookings?.growth?.toFixed(1)}%</>
              ) : (
                <><ArrowDownIcon className="h-3 w-3 text-red-600" /> {metrics.bookings?.growth?.toFixed(1)}%</>
              )}
              <span className="ml-1">fra forrige periode</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nye Kunder</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.customers?.new}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {metrics.customers?.growth > 0 ? (
                <><ArrowUpIcon className="h-3 w-3 text-green-600" /> +{metrics.customers?.growth?.toFixed(1)}%</>
              ) : (
                <><ArrowDownIcon className="h-3 w-3 text-red-600" /> {metrics.customers?.growth?.toFixed(1)}%</>
              )}
              <span className="ml-1">fra forrige periode</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fullføringsrate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.bookings?.total > 0 
                ? ((metrics.bookings?.completed / metrics.bookings?.total) * 100).toFixed(1)
                : 0
              }%
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.bookings?.completed} av {metrics.bookings?.total} bookinger
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different reports */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Oversikt</TabsTrigger>
          <TabsTrigger value="revenue">Inntekt</TabsTrigger>
          <TabsTrigger value="bookings">Bookinger</TabsTrigger>
          <TabsTrigger value="customers">Kunder</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Inntektsutvikling</CardTitle>
                <CardDescription>Daglig inntekt siste 30 dager</CardDescription>
              </CardHeader>
              <CardContent>
                <RevenueChart data={dashboardData?.trends?.revenue_by_day || []} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Booking-trend</CardTitle>
                <CardDescription>Antall bookinger per dag</CardDescription>
              </CardHeader>
              <CardContent>
                <BookingsChart data={dashboardData?.trends?.bookings_by_day || []} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <RevenueReport period={period} />
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          <BookingsReport period={period} />
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <CustomersReport period={period} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Revenue Report Component
function RevenueReport({ period }: { period: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [groupBy, setGroupBy] = useState('month');

  useEffect(() => {
    fetchRevenue();
  }, [period, groupBy]);

  async function fetchRevenue() {
    setLoading(true);
    try {
      const response = await fetch(`/api/reports/revenue?group_by=${groupBy}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Failed to fetch revenue:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Laster...</div>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Inntektsrapport</CardTitle>
          <CardDescription>Detaljert oversikt over inntekter</CardDescription>
        </div>
        <Select value={groupBy} onValueChange={setGroupBy}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Per dag</SelectItem>
            <SelectItem value="week">Per uke</SelectItem>
            <SelectItem value="month">Per måned</SelectItem>
            <SelectItem value="year">Per år</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Total inntekt</p>
              <p className="text-2xl font-bold">
                {data?.stats?.total_revenue?.toLocaleString('no-NO', { style: 'currency', currency: 'NOK' })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Betalt</p>
              <p className="text-2xl font-bold text-green-600">
                {data?.stats?.paid_revenue?.toLocaleString('no-NO', { style: 'currency', currency: 'NOK' })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ubetalt</p>
              <p className="text-2xl font-bold text-orange-600">
                {data?.stats?.unpaid_revenue?.toLocaleString('no-NO', { style: 'currency', currency: 'NOK' })}
              </p>
            </div>
          </div>
          <RevenueChart data={data?.grouped_data || []} />
        </div>
      </CardContent>
    </Card>
  );
}

// Bookings Report Component
function BookingsReport({ period }: { period: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, [period]);

  async function fetchBookings() {
    setLoading(true);
    try {
      const response = await fetch('/api/reports/bookings', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Laster...</div>;

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Booking-statistikk</CardTitle>
          <CardDescription>Analyse av bookinger</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Object.entries(data?.by_status || {}).map(([status, count]) => (
              <div key={status}>
                <p className="text-sm text-muted-foreground capitalize">{status}</p>
                <p className="text-2xl font-bold">{String(count)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Per lokasjon</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.entries(data?.by_location || {}).map(([location, count]) => (
              <div key={location} className="flex justify-between py-2">
                <span>{location}</span>
                <span className="font-bold">{String(count)}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Per tjeneste</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.entries(data?.by_service || {}).slice(0, 10).map(([service, count]) => (
              <div key={service} className="flex justify-between py-2">
                <span className="truncate">{service}</span>
                <span className="font-bold ml-2">{String(count)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Customers Report Component
function CustomersReport({ period }: { period: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, [period]);

  async function fetchCustomers() {
    setLoading(true);
    try {
      const response = await fetch('/api/reports/customers', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Laster...</div>;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Totalt</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{data?.stats?.total_customers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Aktive</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{data?.stats?.active_customers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Snitt bookinger</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{data?.stats?.avg_bookings_per_customer?.toFixed(1)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Snitt verdi</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {data?.stats?.avg_value_per_customer?.toLocaleString('no-NO', { style: 'currency', currency: 'NOK' })}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Topp kunder</CardTitle>
          <CardDescription>De 50 mest verdifulle kundene</CardDescription>
        </CardHeader>
        <CardContent>
          <CustomersTable customers={data?.top_customers || []} />
        </CardContent>
      </Card>
    </div>
  );
}
