'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, ThumbsDown, Save, User, Bot, CheckCircle, AlertCircle } from 'lucide-react';

interface Message {
  id: string;
  sender: 'customer' | 'bot';
  text: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  customerName: string;
  contactPhone?: string;
  contactEmail?: string;
  channel: 'sms' | 'email' | 'chat' | 'phone' | 'landing_page';
  status: 'active' | 'completed' | 'handed_off';
  outcome: 'booked' | 'inquiry' | 'support' | 'handed_off' | null;
  serviceInterest?: string;
  lastMessage: string;
  lastMessageAt: string;
  messages: Message[];
}

interface LYXbaTrainingPanelProps {
  conversation: Conversation;
  onFeedbackSubmit: (conversationId: string, messageId: string, feedback: any) => Promise<void>;
}

export function LYXbaTrainingPanel({ conversation, onFeedbackSubmit }: LYXbaTrainingPanelProps) {
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [suggestedReply, setSuggestedReply] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});

  const handleFeedback = async (messageId: string, wasGood: boolean) => {
    setSelectedMessageId(messageId);
    
    if (wasGood) {
      setSubmitting(true);
      try {
        await onFeedbackSubmit(conversation.id, messageId, { wasGood: true });
        setSubmitted(prev => ({ ...prev, [messageId]: true }));
        setTimeout(() => setSelectedMessageId(null), 2000);
      } catch (error) {
        console.error('Failed to submit feedback:', error);
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleSuggestedReplySubmit = async (messageId: string) => {
    if (!suggestedReply.trim()) return;

    setSubmitting(true);
    try {
      await onFeedbackSubmit(conversation.id, messageId, {
        wasGood: false,
        suggestedReply: suggestedReply.trim(),
      });
      setSubmitted(prev => ({ ...prev, [messageId]: true }));
      setSuggestedReply('');
      setTimeout(() => setSelectedMessageId(null), 2000);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = () => {
    switch (conversation.status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Fullført</Badge>;
      case 'handed_off':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Overført til menneske</Badge>;
      case 'active':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Aktiv</Badge>;
    }
  };

  const getOutcomeBadge = () => {
    if (!conversation.outcome) return null;
    
    switch (conversation.outcome) {
      case 'booked':
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Booking opprettet ✓</Badge>;
      case 'inquiry':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Henvendelse</Badge>;
      case 'support':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Support</Badge>;
    }
  };

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">
              Samtale #{conversation.id.slice(0, 8)} - {conversation.customerName}
            </CardTitle>
            <CardDescription className="mt-1">
              Tren AI-en til å gi bedre svar for din bedrift
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {getStatusBadge()}
            {getOutcomeBadge()}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {conversation.messages.map((message) => (
            <div key={message.id} className="space-y-3">
              <div className={`flex items-start gap-3 ${message.sender === 'bot' ? 'bg-blue-50 border border-blue-200' : 'bg-slate-50 border border-slate-200'} rounded-lg p-4`}>
                <div className={`p-2 rounded-full ${message.sender === 'bot' ? 'bg-blue-600' : 'bg-slate-600'}`}>
                  {message.sender === 'bot' ? (
                    <Bot className="w-4 h-4 text-white" />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">
                      {message.sender === 'bot' ? 'LYXba' : conversation.customerName}
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(message.timestamp).toLocaleTimeString('nb-NO', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-slate-800 whitespace-pre-wrap">{message.text}</p>
                </div>
              </div>

              {message.sender === 'bot' && (
                <div className="ml-14 space-y-3">
                  {submitted[message.id] ? (
                    <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg p-3">
                      <CheckCircle className="w-4 h-4" />
                      <span>Takk for tilbakemeldingen! AI-en lærer av dine forslag.</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-slate-700">Var dette svaret bra?</span>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleFeedback(message.id, true)}
                            disabled={submitting || selectedMessageId !== null}
                            className="text-green-600 hover:bg-green-50 border-green-300"
                          >
                            <ThumbsUp className="w-4 h-4 mr-1" />
                            Ja
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleFeedback(message.id, false)}
                            disabled={submitting || selectedMessageId !== null}
                            className="text-red-600 hover:bg-red-50 border-red-300"
                          >
                            <ThumbsDown className="w-4 h-4 mr-1" />
                            Nei
                          </Button>
                        </div>
                      </div>

                      {selectedMessageId === message.id && (
                        <div className="space-y-2 animate-slide-up">
                          <label className="text-sm font-medium text-slate-700">
                            Hvordan ville du svart? (valgfritt)
                          </label>
                          <Textarea
                            value={suggestedReply}
                            onChange={(e) => setSuggestedReply(e.target.value)}
                            placeholder="Skriv hvordan DU ville svart denne kunden..."
                            rows={4}
                            className="resize-none"
                          />
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setSelectedMessageId(null);
                                setSuggestedReply('');
                              }}
                            >
                              Avbryt
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleSuggestedReplySubmit(message.id)}
                              disabled={submitting || !suggestedReply.trim()}
                            >
                              <Save className="w-4 h-4 mr-2" />
                              Lagre feedback
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {conversation.messages.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-sm">Ingen meldinger i denne samtalen ennå</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
