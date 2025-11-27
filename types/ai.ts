// types/ai.ts
// Types for LYXba AI Agent module (Module 26)
// AI-powered booking agent that handles leads, lookups, and bookings

export type AIConversationStatus = 
  | "active"
  | "waiting_response"
  | "completed"
  | "failed"
  | "handed_off";

export type AIConversationChannel = 
  | "sms"
  | "email"
  | "chat"
  | "phone"
  | "landing_page";

export interface AIConversation {
  id: string;
  org_id: string;
  customer_id: string | null;
  lead_id: string | null;
  
  channel: AIConversationChannel;
  status: AIConversationStatus;
  
  // Contact info
  contact_phone: string | null;
  contact_email: string | null;
  contact_name: string | null;
  
  // Conversation context
  intent: string | null; // booking, inquiry, support, etc.
  service_interest: string | null;
  preferred_date: string | null;
  preferred_time: string | null;
  
  // Outcome
  booking_id: string | null;
  outcome: "booked" | "no_capacity" | "no_response" | "declined" | "handed_off" | null;
  
  // Timestamps
  started_at: string;
  last_message_at: string;
  completed_at: string | null;
  
  created_at: string;
  updated_at: string;
}

export interface AIMessage {
  id: string;
  conversation_id: string;
  
  role: "user" | "assistant" | "system";
  content: string;
  
  // For function calls
  function_call: string | null;
  function_result: string | null;
  
  // Metadata
  channel: AIConversationChannel;
  is_read: boolean;
  
  created_at: string;
}

export interface AIAgentConfig {
  id: string;
  org_id: string;
  
  // General settings
  is_enabled: boolean;
  name: string; // Agent persona name
  greeting_message: string;
  
  // Channels
  enabled_channels: AIConversationChannel[];
  
  // Operating hours
  operating_hours: Record<string, { start: string; end: string }>;
  timezone: string;
  
  // Behavior
  max_contact_attempts: number;
  response_delay_seconds: number;
  
  // Services AI can book
  allowed_service_ids: string[];
  
  // Tone and style
  tone: "formal" | "friendly" | "casual";
  language: string;
  
  created_at: string;
  updated_at: string;
}

export interface AIAgentKPIs {
  org_id: string;
  period: string; // YYYY-MM or YYYY-MM-DD
  
  // Volume
  total_conversations: number;
  conversations_by_channel: Record<AIConversationChannel, number>;
  
  // Outcomes
  bookings_created: number;
  leads_handled: number;
  handed_off_count: number;
  no_response_count: number;
  
  // Rates (percentage 0-100)
  booking_rate: number;
  response_rate: number;
  handoff_rate: number;
  
  // Performance by campaign source
  conversions_by_source: Record<string, {
    leads: number;
    bookings: number;
    /** Conversion rate as percentage (0-100) */
    rate: number;
  }>;
  
  // Timing
  avg_response_time_seconds: number;
  avg_conversation_duration_minutes: number;
  
  created_at: string;
  updated_at: string;
}

export interface ServiceLookupResult {
  service_id: string;
  service_name: string;
  description: string | null;
  price: number | null;
  duration_minutes: number | null;
  next_available_slot: string | null;
  slots_this_week: number;
}

export interface CapacityLookupResult {
  date: string;
  available_slots: number;
  total_slots: number;
  times: string[];
}

// AI function call types
export type AIFunctionName = 
  | "lookup_services"
  | "check_capacity"
  | "create_booking"
  | "get_customer_info"
  | "log_conversation"
  | "handoff_to_human";

export interface AIFunctionCall {
  name: AIFunctionName;
  arguments: Record<string, unknown>;
}

export interface AIFunctionResult {
  success: boolean;
  data: unknown;
  error: string | null;
}
