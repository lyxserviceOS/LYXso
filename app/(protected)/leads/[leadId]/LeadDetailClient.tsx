"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Mail, Phone, Calendar, Tag, AlertCircle, 
  MessageSquare, User2, CheckCircle2, Clock, XCircle,
  MoreVertical, Pencil, Trash2
} from "lucide-react";
import LeadChat from "@/components/leads/LeadChat";
import { getApiBaseUrl, getDefaultOrgId } from "@/lib/apiConfig";

const API_BASE = getApiBaseUrl();
const ORG_ID = getDefaultOrgId();

type Lead = {
  id: string;
  org_id: string;
  customer_id: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  source: string | null;
  source_campaign: string | null;
  status: string;
  notes: string | null;
  interested_services: string[] | null;
  assigned_to: string | null;
  last_contact_at: string | null;
  converted_at: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  customers?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
};

type Conversation = {
  id: string;
  channel: string;
  status: string;
  started_at: string;
  closed_at: string | null;
};

type Booking = {
  id: string;
  starts_at: string;
  ends_at: string;
  status: string;
  service_id: string;
  services?: {
    name: string;
  };
};

type LeadDetailClientProps = {
  leadId: string;
};

export default function LeadDetailClient({ leadId }: LeadDetailClientProps) {
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState(false);

  useEffect(() => {
    loadLead();
  }, [leadId]);

  const loadLead = async () => {
    if (!API_BASE || !ORG_ID) {
      setError("Mangler NEXT_PUBLIC_API_BASE eller NEXT_PUBLIC_ORG_ID");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/orgs/${ORG_ID}/leads/${leadId}`, {
        cache: "no-store",
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error(`API error (${res.status})`);
      }

      const data = await res.json();
      
      setLead(data.lead);
      setConversations(data.conversations || []);
      setBookings(data.bookings || []);
    } catch (err: any) {
      setError(err?.message ?? "Ukjent feil");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    if (!API_BASE || !ORG_ID || !lead) return;

    setUpdatingStatus(true);

    try {
      const res = await fetch(`${API_BASE}/api/orgs/${ORG_ID}/leads/${leadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error("Kunne ikke oppdatere status");
      }

      const updatedLead = await res.json();
      setLead(updatedLead);
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Kunne ikke oppdatere status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const deleteLead = async () => {
    if (!API_BASE || !ORG_ID) return;
    
    if (!confirm('Er du sikker på at du vil slette denne leaden?')) return;

    try {
      const res = await fetch(`${API_BASE}/api/orgs/${ORG_ID}/leads/${leadId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Kunne ikke slette lead');

      router.push('/leads');
    } catch (err) {
      alert('Kunne ikke slette lead');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => router.push("/leads")}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-300"
        >
          <ArrowLeft className="w-4 h-4" />
          Tilbake til leads
        </button>
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle className="w-5 h-5" />
            <p className="font-medium">{error || "Lead ikke funnet"}</p>
          </div>
        </div>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    new: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    contacted: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    interested: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    qualified: "bg-green-500/20 text-green-300 border-green-500/30",
    converted: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    unqualified: "bg-gray-500/20 text-gray-300 border-gray-500/30",
    lost: "bg-red-500/20 text-red-300 border-red-500/30",
  };

  const statusIcons: Record<string, any> = {
    new: Clock,
    contacted: MessageSquare,
    interested: CheckCircle2,
    qualified: CheckCircle2,
    converted: CheckCircle2,
    unqualified: XCircle,
    lost: XCircle,
  };

  const StatusIcon = statusIcons[lead.status] || Clock;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/leads")}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Tilbake til leads
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowConvertModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <CheckCircle2 className="w-4 h-4 inline mr-2" />
            Konverter til kunde
          </button>

          <button
            onClick={deleteLead}
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Lead Info Card */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {(lead.name || lead.customers?.name || 'U')[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-slate-100 mb-2">
                {lead.name || lead.customers?.name || "Uten navn"}
              </h1>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border inline-flex items-center gap-1.5 ${
                    statusColors[lead.status] || statusColors.new
                  }`}
                >
                  <StatusIcon className="w-3.5 h-3.5" />
                  {lead.status}
                </span>
                {lead.source && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 capitalize">
                    {lead.source}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Status selector */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-slate-400">Endre status:</label>
            <select
              value={lead.status}
              onChange={(e) => updateStatus(e.target.value)}
              disabled={updatingStatus}
              className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-blue-500 disabled:opacity-50"
            >
              <option value="new">Ny</option>
              <option value="contacted">Kontaktet</option>
              <option value="interested">Interessert</option>
              <option value="qualified">Kvalifisert</option>
              <option value="converted">Konvertert</option>
              <option value="unqualified">Ukvalifisert</option>
              <option value="lost">Tapt</option>
            </select>
          </div>
        </div>

        {/* Contact Info Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg border border-slate-800">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Phone className="w-5 h-5 text-blue-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-500">Telefon</p>
              <p className="text-sm text-slate-200 truncate">{lead.phone || lead.customers?.phone || "—"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg border border-slate-800">
            <div className="flex-shrink-0 w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-purple-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-500">E-post</p>
              <p className="text-sm text-slate-200 truncate">{lead.email || lead.customers?.email || "—"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg border border-slate-800">
            <div className="flex-shrink-0 w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <Tag className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-500">Kilde</p>
              <p className="text-sm text-slate-200 capitalize">{lead.source || "—"}</p>
              {lead.source_campaign && (
                <p className="text-xs text-slate-500 truncate">{lead.source_campaign}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg border border-slate-800">
            <div className="flex-shrink-0 w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-500">Opprettet</p>
              <p className="text-sm text-slate-200">
                {new Date(lead.created_at).toLocaleDateString("nb-NO", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Interested Services */}
        {lead.interested_services && lead.interested_services.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-800">
            <p className="text-xs font-medium text-slate-400 mb-2">Interessert i:</p>
            <div className="flex flex-wrap gap-2">
              {lead.interested_services.map((service, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-300 rounded text-xs"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {lead.notes && (
          <div className="mt-4 pt-4 border-t border-slate-800">
            <p className="text-xs font-medium text-slate-400 mb-2">Notater</p>
            <p className="text-sm text-slate-300 bg-slate-900/50 rounded-lg p-3 border border-slate-800">
              {lead.notes}
            </p>
          </div>
        )}

        {/* Stats Row */}
        <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-slate-500">Konversasjoner</p>
            <p className="text-lg font-semibold text-slate-100">{conversations.length}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Bookinger</p>
            <p className="text-lg font-semibold text-slate-100">{bookings.length}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Sist kontakt</p>
            <p className="text-sm text-slate-300">
              {lead.last_contact_at 
                ? new Date(lead.last_contact_at).toLocaleDateString("nb-NO", {
                    day: "2-digit",
                    month: "short",
                  })
                : "Aldri"}
            </p>
          </div>
        </div>
      </div>

      {/* Bookings */}
      {bookings.length > 0 && (
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Bookinger</h3>
          <div className="space-y-3">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-800"
              >
                <div>
                  <p className="text-sm font-medium text-slate-200">
                    {booking.services?.name || 'Tjeneste'}
                  </p>
                  <p className="text-xs text-slate-400">
                    {new Date(booking.starts_at).toLocaleString("nb-NO", {
                      weekday: "short",
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  booking.status === 'confirmed' 
                    ? 'bg-green-500/20 text-green-300'
                    : 'bg-yellow-500/20 text-yellow-300'
                }`}>
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chat Component */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800">
          <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-400" />
            SMS-samtale
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Send SMS eller la AI-agenten svare automatisk
          </p>
        </div>
        <div className="h-[600px]">
          <LeadChat
            leadId={leadId}
            leadName={lead.name || lead.customers?.name || "Ukjent"}
            leadPhone={lead.phone || lead.customers?.phone || "Ingen telefon"}
            onMessageSent={loadLead}
          />
        </div>
      </div>
    </div>
  );
}