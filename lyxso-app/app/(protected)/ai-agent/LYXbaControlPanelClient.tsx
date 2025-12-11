'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  MessageSquare, 
  Settings, 
  TrendingUp, 
  Users, 
  Calendar,
  Bell,
  Activity,
  CheckCircle,
  Clock,
  ArrowRight,
  Phone,
  Mail,
  MessageCircle,
  Globe
} from 'lucide-react';
import { LYXbaConversationsList } from './components/LYXbaConversationsList';
import { LYXbaConfiguration } from './components/LYXbaConfiguration';
import { LYXbaAnalytics } from './components/LYXbaAnalytics';
import { LYXbaNotifications } from './components/LYXbaNotifications';

interface LYXbaStats {
  totalConversations: number;
  activeConversations: number;
  bookingsCreated: number;
  conversionRate: number;
  avgResponseTime: number;
  handoffRate: number;
}

export default function LYXbaControlPanelClient() {
  const [stats, setStats] = useState<LYXbaStats>({
    totalConversations: 0,
    activeConversations: 0,
    bookingsCreated: 0,
    conversionRate: 0,
    avgResponseTime: 0,
    handoffRate: 0,
  });
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    // Mock data - replace with real API call
    setStats({
      totalConversations: 156,
      activeConversations: 8,
      bookingsCreated: 89,
      conversionRate: 57.1,
      avgResponseTime: 8,
      handoffRate: 14.7,
    });
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl shadow-lg">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">LYXba Control Panel</h1>
              <p className="text-gray-600 mt-1">
                AI-drevet kundeservice som håndterer samtaler automatisk
              </p>
            </div>
          </div>
          <Badge 
            variant={isEnabled ? "default" : "secondary"} 
            className={`text-sm py-2 px-4 ${isEnabled ? 'bg-green-600' : 'bg-gray-400'}`}
          >
            <Activity className={`w-4 h-4 mr-2 ${isEnabled ? 'animate-pulse' : ''}`} />
            {isEnabled ? 'Aktiv' : 'Inaktiv'}
          </Badge>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-600" />
                Totalt
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{stats.totalConversations}</p>
              <p className="text-xs text-gray-500 mt-1">Samtaler</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" />
                Aktive
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">{stats.activeConversations}</p>
              <p className="text-xs text-gray-500 mt-1">Pågående</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Bookinger
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{stats.bookingsCreated}</p>
              <p className="text-xs text-gray-500 mt-1">Opprettet</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-emerald-600">{stats.conversionRate}%</p>
              <p className="text-xs text-gray-500 mt-1">Konvertering</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-600" />
                Respons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-orange-600">{stats.avgResponseTime}s</p>
              <p className="text-xs text-gray-500 mt-1">Gjennomsnitt</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-600" />
                Handoff
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-amber-600">{stats.handoffRate}%</p>
              <p className="text-xs text-gray-500 mt-1">Til menneske</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="conversations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="conversations" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Samtaler</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <span className="hidden sm:inline">Analyse</span>
          </TabsTrigger>
          <TabsTrigger value="configuration" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Konfigurasjon</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Varsler</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="conversations">
          <LYXbaConversationsList />
        </TabsContent>

        <TabsContent value="analytics">
          <LYXbaAnalytics stats={stats} />
        </TabsContent>

        <TabsContent value="configuration">
          <LYXbaConfiguration />
        </TabsContent>

        <TabsContent value="notifications">
          <LYXbaNotifications />
        </TabsContent>
      </Tabs>
    </div>
  );
}
