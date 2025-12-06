'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  MessageSquare, 
  Phone, 
  Mail, 
  Globe,
  User,
  Calendar,
  ArrowRight,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { LYXbaTrainingPanel } from '@/components/ai/LYXbaTrainingPanel';

interface Conversation {
  id: string;
  customerName: string;
  contactPhone?: string;
  contactEmail?: string;
  channel: 'sms' | 'email' | 'chat' | 'phone' | 'landing_page';
  status: 'active' | 'completed' | 'handed_off';
  outcome: 'booked' | 'inquiry' | 'support' | null;
  serviceInterest?: string;
  lastMessage: string;
  lastMessageAt: string;
  messages: Array<{
    id: string;
    sender: 'customer' | 'bot';
    text: string;
    timestamp: string;
  }>;
}

// Mock data
const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    customerName: 'Ola Nordmann',
    contactPhone: '+47 912 34 567',
    channel: 'sms',
    status: 'completed',
    outcome: 'booked',
    serviceInterest: 'Keramisk coating',
    lastMessage: 'Takk! Gleder meg til avtalen.',
    lastMessageAt: '2024-12-06T14:45:00Z',
    messages: [
      {
        id: 'msg-1',
        sender: 'customer',
        text: 'Hei, jeg lurer på pris for coating av hele bilen min',
        timestamp: '2024-12-06T14:30:00Z',
      },
      {
        id: 'msg-2',
        sender: 'bot',
        text: 'Hei! For keramisk coating tilbyr vi fra 15.000,- inkludert forbehandling og 5 års garanti. Når passer det?',
        timestamp: '2024-12-06T14:31:00Z',
      },
      {
        id: 'msg-3',
        sender: 'customer',
        text: 'Kan jeg komme på mandag?',
        timestamp: '2024-12-06T14:33:00Z',
      },
      {
        id: 'msg-4',
        sender: 'bot',
        text: 'Perfekt! Jeg har ledig kl 10:00 på mandag 9. desember. Passer det?',
        timestamp: '2024-12-06T14:34:00Z',
      },
      {
        id: 'msg-5',
        sender: 'customer',
        text: 'Ja, det passer! Book meg på det',
        timestamp: '2024-12-06T14:35:00Z',
      },
      {
        id: 'msg-6',
        sender: 'bot',
        text: 'Flott! Booking er bekreftet for mandag 9. desember kl 10:00. Du får bekreftelse på SMS. Takk!',
        timestamp: '2024-12-06T14:36:00Z',
      },
    ],
  },
  {
    id: 'conv-2',
    customerName: 'Kari Hansen',
    contactEmail: 'kari@example.com',
    contactPhone: '+47 987 65 432',
    channel: 'landing_page',
    status: 'active',
    outcome: null,
    serviceInterest: 'Dekkskift',
    lastMessage: 'Hvor ligger dere?',
    lastMessageAt: '2024-12-06T15:20:00Z',
    messages: [
      {
        id: 'msg-1',
        sender: 'customer',
        text: 'Hei, jeg trenger dekkskift. Hva koster det?',
        timestamp: '2024-12-06T15:15:00Z',
      },
      {
        id: 'msg-2',
        sender: 'bot',
        text: 'Hei Kari! Dekkskift koster 500,- for personbil. Vi har ledige tider i morgen. Passer det?',
        timestamp: '2024-12-06T15:16:00Z',
      },
      {
        id: 'msg-3',
        sender: 'customer',
        text: 'Hvor ligger dere?',
        timestamp: '2024-12-06T15:20:00Z',
      },
    ],
  },
  {
    id: 'conv-3',
    customerName: 'Erik Olsen',
    contactPhone: '+47 456 78 901',
    contactEmail: 'erik@example.com',
    channel: 'chat',
    status: 'handed_off',
    outcome: 'handed_off',
    lastMessage: 'Jeg vil snakke med en person',
    lastMessageAt: '2024-12-06T16:10:00Z',
    messages: [
      {
        id: 'msg-1',
        sender: 'customer',
        text: 'Jeg har et spesielt problem med lakken min',
        timestamp: '2024-12-06T16:00:00Z',
      },
      {
        id: 'msg-2',
        sender: 'bot',
        text: 'Kan du beskrive problemet nærmere? Da kan jeg hjelpe deg best mulig.',
        timestamp: '2024-12-06T16:01:00Z',
      },
      {
        id: 'msg-3',
        sender: 'customer',
        text: 'Jeg vil snakke med en person',
        timestamp: '2024-12-06T16:10:00Z',
      },
      {
        id: 'msg-4',
        sender: 'bot',
        text: 'Selvfølgelig! Jeg kobler deg til en av våre fagpersoner. De kontakter deg innen 30 minutter.',
        timestamp: '2024-12-06T16:11:00Z',
      },
    ],
  },
];

export function LYXbaConversationsList() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed' | 'handed_off'>('all');

  useEffect(() => {
    setConversations(MOCK_CONVERSATIONS);
  }, []);

  const handleFeedbackSubmit = async (conversationId: string, messageId: string, feedback: any) => {
    console.log('Feedback submitted:', { conversationId, messageId, feedback });
    // Replace with real API call
    return Promise.resolve();
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = 
      conv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.contactPhone?.includes(searchQuery) ||
      conv.contactEmail?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || conv.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getChannelIcon = (channel: Conversation['channel']) => {
    switch (channel) {
      case 'sms':
      case 'phone':
        return <Phone className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'chat':
        return <MessageSquare className="w-4 h-4" />;
      case 'landing_page':
        return <Globe className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: Conversation['status']) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            <Clock className="w-3 h-3 mr-1" />
            Aktiv
          </Badge>
        );
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Fullført
          </Badge>
        );
      case 'handed_off':
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Overført
          </Badge>
        );
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Left: Conversation List */}
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Samtaler</CardTitle>
            <CardDescription>
              Alle kundesamtaler håndtert av LYXba
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search and Filter */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Søk etter navn, telefon, epost..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">Alle</option>
                <option value="active">Aktive</option>
                <option value="completed">Fullført</option>
                <option value="handed_off">Overført</option>
              </select>
            </div>

            {/* Conversation List */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filteredConversations.map((conv) => (
                <Card
                  key={conv.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedConversation?.id === conv.id ? 'border-blue-500 border-2' : ''
                  }`}
                  onClick={() => setSelectedConversation(conv)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-gray-100 rounded-full">
                          {getChannelIcon(conv.channel)}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{conv.customerName}</p>
                          <p className="text-xs text-gray-500">
                            {conv.contactPhone || conv.contactEmail}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(conv.status)}
                    </div>
                    {conv.serviceInterest && (
                      <p className="text-xs text-gray-600 mb-2">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        {conv.serviceInterest}
                      </p>
                    )}
                    <p className="text-sm text-gray-700 truncate">{conv.lastMessage}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(conv.lastMessageAt).toLocaleString('nb-NO')}
                    </p>
                  </CardContent>
                </Card>
              ))}

              {filteredConversations.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">Ingen samtaler funnet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right: Conversation Detail with Training */}
      <div className="lg:col-span-3">
        {selectedConversation ? (
          <LYXbaTrainingPanel
            conversation={selectedConversation}
            onFeedbackSubmit={handleFeedbackSubmit}
          />
        ) : (
          <Card className="h-full flex items-center justify-center">
            <CardContent className="text-center py-12">
              <Eye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Velg en samtale
              </h3>
              <p className="text-sm text-gray-500">
                Klikk på en samtale til venstre for å se detaljer og gi AI-en feedback
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
