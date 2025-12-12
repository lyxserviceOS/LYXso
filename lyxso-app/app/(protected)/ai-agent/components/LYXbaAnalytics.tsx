'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { TrendingUp, MessageSquare, CheckCircle, Users, Clock } from 'lucide-react';
import { safePercent } from '@/lib/utils/recharts';

interface LYXbaAnalyticsProps {
  stats: {
    totalConversations: number;
    activeConversations: number;
    bookingsCreated: number;
    conversionRate: number;
    avgResponseTime: number;
    handoffRate: number;
  };
}

const channelData = [
  { name: 'SMS', value: 45, color: '#3b82f6' },
  { name: 'Chat', value: 68, color: '#8b5cf6' },
  { name: 'E-post', value: 12, color: '#10b981' },
  { name: 'Landingsside', value: 26, color: '#f59e0b' },
  { name: 'Telefon', value: 5, color: '#ef4444' },
];

const conversionBySource = [
  { source: 'Facebook Ads', leads: 45, bookings: 28, rate: 62.2 },
  { source: 'Google Ads', leads: 38, bookings: 22, rate: 57.9 },
  { source: 'Organic', leads: 42, bookings: 24, rate: 57.1 },
  { source: 'Referral', leads: 18, bookings: 12, rate: 66.7 },
  { source: 'Landingsside', leads: 13, bookings: 3, rate: 23.1 },
];

const weeklyTrend = [
  { day: 'Man', conversations: 18, bookings: 12 },
  { day: 'Tir', conversations: 22, bookings: 14 },
  { day: 'Ons', conversations: 25, bookings: 15 },
  { day: 'Tor', conversations: 28, bookings: 18 },
  { day: 'Fre', conversations: 24, bookings: 16 },
  { day: 'Lør', conversations: 16, bookings: 8 },
  { day: 'Søn', conversations: 12, bookings: 6 },
];

export function LYXbaAnalytics({ stats }: LYXbaAnalyticsProps) {
  return (
    <div className="space-y-6">
      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Høyeste konvertering
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">66.7%</p>
            <p className="text-sm text-gray-600 mt-1">Fra Referral-kilder</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              Mest brukt kanal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">Chat</p>
            <p className="text-sm text-gray-600 mt-1">68 samtaler (44%)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600" />
              Raskeste respons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-600">{stats.avgResponseTime}s</p>
            <p className="text-sm text-gray-600 mt-1">Gjennomsnittlig svartid</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Channel Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Samtaler per kanal</CardTitle>
            <CardDescription>Fordeling av kundehenvendelser</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={channelData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(safePercent(percent) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {channelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Ukentlig trend</CardTitle>
            <CardDescription>Samtaler vs. bookinger siste 7 dager</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="conversations" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  name="Samtaler"
                />
                <Line 
                  type="monotone" 
                  dataKey="bookings" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Bookinger"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Conversion by Source */}
      <Card>
        <CardHeader>
          <CardTitle>Konvertering per kilde</CardTitle>
          <CardDescription>Leads og bookinger fra forskjellige kilder</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={conversionBySource}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="source" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="leads" fill="#3b82f6" name="Leads" />
              <Bar dataKey="bookings" fill="#10b981" name="Bookinger" />
            </BarChart>
          </ResponsiveContainer>
          
          <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
            {conversionBySource.map((source) => (
              <div key={source.source} className="text-center">
                <p className="text-sm font-medium text-gray-700">{source.source}</p>
                <p className="text-2xl font-bold text-green-600">{source.rate}%</p>
                <p className="text-xs text-gray-500">{source.bookings}/{source.leads}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
