"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Bot, User, Loader2, Check, X, Clock, MessageSquare } from "lucide-react";
import { getApiBaseUrl, getDefaultOrgId } from "@/lib/apiConfig";

interface LeadChatProps {
  leadId: string;
  leadName: string;
  leadPhone: string;
  onMessageSent?: () => void;
}

type SMSMessage = {
  id: string;
  from: string;
  to: string;
  body: string;
  status: string;
  direction: string;
  createdAt: string;
  updatedAt: string;
};

export default function LeadChat({ leadId, leadName, leadPhone, onMessageSent }: LeadChatProps) {
  const [messages, setMessages] = useState<SMSMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const API_BASE = getApiBaseUrl();
  const ORG_ID = getDefaultOrgId();

  // Load SMS history from Twilio
  useEffect(() => {
    loadMessages();
    // Poll for new messages every 15 seconds
    const interval = setInterval(loadMessages, 15000);
    return () => clearInterval(interval);
  }, [leadId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadMessages = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/api/orgs/${ORG_ID}/leads/${leadId}/sms-history`,
        { credentials: 'include' }
      );
      
      if (!res.ok) {
        throw new Error("Failed to load messages");
      }
      
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    setSending(true);

    try {
      const res = await fetch(
        `${API_BASE}/api/orgs/${ORG_ID}/leads/${leadId}/sms`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ message: newMessage })
        }
      );

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      setNewMessage("");
      await loadMessages(); // Reload to show sent message
      onMessageSent?.(); // Notify parent to refresh lead data
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Kunne ikke sende SMS. Sjekk at Twilio er konfigurert.");
    } finally {
      setSending(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return <Check className="w-3 h-3 text-green-400" />;
      case 'sent':
        return <Check className="w-3 h-3 text-blue-400" />;
      case 'failed':
      case 'undelivered':
        return <X className="w-3 h-3 text-red-400" />;
      default:
        return <Clock className="w-3 h-3 text-slate-400" />;
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      delivered: 'Levert',
      sent: 'Sendt',
      failed: 'Feilet',
      undelivered: 'Ikke levert',
      queued: 'I kø',
      sending: 'Sender...',
    };
    return statusMap[status?.toLowerCase()] || status;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-950">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
              {leadName[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h3 className="font-semibold text-slate-100">{leadName}</h3>
              <p className="text-sm text-slate-400">{leadPhone}</p>
            </div>
          </div>
          <div className="text-xs text-slate-500">
            {messages.length} melding{messages.length !== 1 ? 'er' : ''}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-950/60">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageSquare className="w-12 h-12 text-slate-700 mb-3" />
            <p className="text-slate-500 text-sm">Ingen meldinger ennå</p>
            <p className="text-slate-600 text-xs mt-1">Send første melding nedenfor</p>
          </div>
        )}

        {messages.map((msg, index) => {
          const isOutbound = msg.direction === 'outbound-api' || msg.from !== leadPhone;
          const isInbound = !isOutbound;

          return (
            <div
              key={msg.id || index}
              className={`flex items-start gap-3 ${isInbound ? '' : 'flex-row-reverse'}`}
            >
              {/* Avatar */}
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  isInbound
                    ? 'bg-slate-700'
                    : 'bg-blue-600'
                }`}
              >
                {isInbound ? (
                  <User className="w-4 h-4 text-slate-200" />
                ) : (
                  <Send className="w-3.5 h-3.5 text-white" />
                )}
              </div>

              {/* Message Bubble */}
              <div className={`flex-1 max-w-md`}>
                <div
                  className={`px-4 py-3 rounded-2xl ${
                    isInbound
                      ? 'bg-slate-800 text-slate-100 rounded-tl-none'
                      : 'bg-blue-600 text-white rounded-tr-none'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">{msg.body}</p>
                </div>
                
                {/* Metadata */}
                <div className={`flex items-center gap-2 mt-1 px-2 ${isInbound ? '' : 'justify-end'}`}>
                  <span className="text-xs text-slate-500">
                    {new Date(msg.createdAt).toLocaleTimeString('nb-NO', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  
                  {isOutbound && (
                    <>
                      <span className="text-slate-700">•</span>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(msg.status)}
                        <span className="text-xs text-slate-500">
                          {getStatusText(msg.status)}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <div className="flex gap-2">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !sending) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Skriv SMS-melding..."
            rows={3}
            className="flex-1 px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            disabled={sending}
          />
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="text-xs text-slate-500">
            {newMessage.length}/160 tegn
            {newMessage.length > 160 && (
              <span className="text-yellow-400 ml-2">
                ({Math.ceil(newMessage.length / 160)} SMS)
              </span>
            )}
          </div>

          <button
            onClick={sendMessage}
            disabled={!newMessage.trim() || sending}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg disabled:bg-slate-700 disabled:cursor-not-allowed flex items-center gap-2 transition-colors font-medium"
          >
            {sending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sender...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send SMS
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-slate-600 mt-2">
          💡 Trykk Enter for å sende, Shift+Enter for ny linje
        </p>
      </div>
    </div>
  );
}
