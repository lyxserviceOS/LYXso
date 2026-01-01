// app/api/support/tickets/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createApiClient } from "@/lib/supabase/api-client";

const supabase = createApiClient();

// Hjelpefunksjon for å hente id uansett om params er Promise eller vanlig objekt
async function getIdFromContext(context: any): Promise<string> {
  const params = await context?.params;
  if (!params || !params.id) {
    throw new Error("Mangler ticket-id i route params");
  }
  return params.id as string;
}

// GET - Get single ticket with replies
export async function GET(request: NextRequest, context: any) {
  try {
    const id = await getIdFromContext(context);

    // Get ticket
    const { data: ticket, error: ticketError } = await supabase
      .from("support_tickets")
      .select("*")
      .eq("id", id)
      .single();

    if (ticketError || !ticket) {
      return NextResponse.json(
        { error: "Ticket ikke funnet" },
        { status: 404 }
      );
    }

    // Get replies
    const { data: replies, error: repliesError } = await supabase
      .from("support_replies")
      .select("*")
      .eq("ticket_id", id)
      .order("created_at", { ascending: true });

    if (repliesError) {
      console.error("Error fetching replies:", repliesError);
    }

    return NextResponse.json({
      ticket,
      replies: replies || [],
    });
  } catch (error) {
    console.error("Error in ticket GET:", error);
    return NextResponse.json(
      { error: "En feil oppstod" },
      { status: 500 }
    );
  }
}

// PATCH - Update ticket
export async function PATCH(request: NextRequest, context: any) {
  try {
    const id = await getIdFromContext(context);
    const body = await request.json();
    const { status, priority, assigned_to, internal_notes } = body;

    const updates: Record<string, any> = {};
    if (status) updates.status = status;
    if (priority) updates.priority = priority;
    if (assigned_to !== undefined) updates.assigned_to = assigned_to;
    if (internal_notes !== undefined) updates.internal_notes = internal_notes;

    // Hvis vi lukker saken, sett resolved_at
    if (status === "closed" || status === "resolved") {
      updates.resolved_at = new Date().toISOString();
    }

    const { data: ticket, error } = await supabase
      .from("support_tickets")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating ticket:", error);
      return NextResponse.json(
        { error: "Kunne ikke oppdatere ticket" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ticket });
  } catch (error) {
    console.error("Error in ticket PATCH:", error);
    return NextResponse.json(
      { error: "En feil oppstod" },
      { status: 500 }
    );
  }
}

// DELETE - Delete ticket (soft delete)
export async function DELETE(request: NextRequest, context: any) {
  try {
    const id = await getIdFromContext(context);

    const { error } = await supabase
      .from("support_tickets")
      .update({
        status: "deleted",
        deleted_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error("Error deleting ticket:", error);
      return NextResponse.json(
        { error: "Kunne ikke slette ticket" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in ticket DELETE:", error);
    return NextResponse.json(
      { error: "En feil oppstod" },
      { status: 500 }
    );
  }
}
