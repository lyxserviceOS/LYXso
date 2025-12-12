// types/automation.ts
// Types for Automation module (Module 22)

export type TriggerType = 
  | "booking_created"
  | "booking_confirmed"
  | "booking_reminder"
  | "booking_completed"
  | "booking_cancelled"
  | "booking_no_show"
  | "coating_job_completed"
  | "coating_followup_due"
  | "customer_created"
  | "lead_created"
  | "payment_received"
  | "schedule"; // Time-based triggers

export type ActionType =
  | "send_sms"
  | "send_email"
  | "create_followup"
  | "create_booking"
  | "update_customer"
  | "flag_customer"
  | "notify_staff"
  | "webhook";

export interface AutomationRule {
  id: string;
  org_id: string;
  
  name: string;
  description: string | null;
  
  trigger_type: TriggerType;
  trigger_config: Record<string, unknown>; // Trigger-specific config (e.g., hours before for reminder)
  
  action_type: ActionType;
  action_config: Record<string, unknown>; // Action-specific config (e.g., message template)
  
  // Conditions (optional)
  conditions: AutomationCondition[] | null;
  
  is_active: boolean;
  is_system: boolean; // System rules can't be deleted
  
  last_run_at: string | null;
  run_count: number;
  
  created_at: string;
  updated_at: string;
}

export interface AutomationCondition {
  field: string;
  operator: "equals" | "not_equals" | "contains" | "greater_than" | "less_than";
  value: string | number | boolean;
}

export type AutomationEventStatus = "pending" | "running" | "completed" | "failed" | "skipped";

export interface AutomationEvent {
  id: string;
  rule_id: string;
  org_id: string;
  
  trigger_type: TriggerType;
  trigger_data: Record<string, unknown>; // Data that triggered the event
  
  action_type: ActionType;
  action_result: Record<string, unknown> | null; // Result of the action
  
  status: AutomationEventStatus;
  error_message: string | null;
  
  // Reference to related entity
  entity_type: string | null; // e.g., "booking", "customer"
  entity_id: string | null;
  
  scheduled_at: string;
  started_at: string | null;
  completed_at: string | null;
  
  created_at: string;
}

export interface Notification {
  id: string;
  org_id: string;
  
  recipient_type: "customer" | "staff" | "org";
  recipient_id: string | null;
  recipient_contact: string; // Email or phone
  
  channel: "sms" | "email" | "push";
  
  subject: string | null;
  message: string;
  
  status: "pending" | "sent" | "delivered" | "failed";
  sent_at: string | null;
  delivered_at: string | null;
  error_message: string | null;
  
  // Reference
  automation_event_id: string | null;
  
  created_at: string;
}

// Default automation templates
export interface AutomationTemplate {
  id: string;
  name: string;
  description: string;
  trigger_type: TriggerType;
  trigger_config: Record<string, unknown>;
  action_type: ActionType;
  action_config: Record<string, unknown>;
  category: string;
}
