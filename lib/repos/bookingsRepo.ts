// lib/repos/bookingsRepo.ts

import { supabase } from "../supabaseClient";

// Type for booking creation payload
type CreateBookingPayload = {
  customer_id?: string;
  start_time?: string;
  end_time?: string;
  status?: string;
  notes?: string;
  service_name?: string;
  customer_name?: string;
  [key: string]: string | undefined;
};

// Henter alle bookinger for en gitt org
export async function getBookingsForOrg(orgId: string) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("org_id", orgId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching bookings for org", orgId, error);
    return [];
  }

  return data ?? [];
}

// Oppretter en ny booking for en gitt org
// payload er et objekt med resten av feltene (customer_id, timeslot osv.)
export async function createBookingForOrg(orgId: string, payload: CreateBookingPayload) {
  const { data, error } = await supabase
    .from("bookings")
    .insert([{ org_id: orgId, ...payload }])
    .select("*")
    .single();

  if (error) {
    console.error("Error creating booking for org", orgId, error);
    throw error;
  }

  return data;
}

// Oppdaterer status på en booking (f.eks. "planned", "completed", "cancelled")
export async function updateBookingStatus(
  orgId: string,
  bookingId: string,
  newStatus: string
) {
  const { data, error } = await supabase
    .from("bookings")
    .update({ status: newStatus })
    .eq("id", bookingId)
    .eq("org_id", orgId)
    .select("*")
    .single();

  if (error) {
    console.error(
      "Error updating booking status",
      { orgId, bookingId, newStatus },
      error
    );
    throw error;
  }

  return data;
}
