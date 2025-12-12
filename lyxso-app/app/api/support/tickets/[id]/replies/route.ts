// app/api/support/tickets/[id]/replies/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST - Add reply to ticket
export async function POST(request: NextRequest, context: any) {
  try {
    const params = await context?.params;
    if (!params || !params.id) {
      return NextResponse.json(
        { error: "Missing id in route params" },
        { status: 400 }
      );
    }
    const { id: ticketId } = params as { id: string };
    const body = await request.json();
    const { message, user_id, is_admin, user_name, user_email } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Melding er påkrevd" },
        { status: 400 }
      );
    }

    // Get ticket to verify it exists
    const { data: ticket, error: ticketError } = await supabase
      .from("support_tickets")
      .select("*")
      .eq("id", ticketId)
      .single();

    if (ticketError || !ticket) {
      return NextResponse.json(
        { error: "Ticket ikke funnet" },
        { status: 404 }
      );
    }

    // Create reply
    const { data: reply, error: replyError } = await supabase
      .from("support_replies")
      .insert({
        ticket_id: ticketId,
        user_id: user_id || null,
        message,
        is_admin: is_admin || false,
        user_name: user_name || null,
        user_email: user_email || null,
      })
      .select()
      .single();

    if (replyError) {
      console.error("Error creating reply:", replyError);
      return NextResponse.json(
        { error: "Kunne ikke legge til svar" },
        { status: 500 }
      );
    }

    // Update ticket status if it was closed
    if (ticket.status === "closed" || ticket.status === "resolved") {
      await supabase
        .from("support_tickets")
        .update({ status: "in_progress" })
        .eq("id", ticketId);
    }

    // Send notification
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/support/notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "new_reply",
          ticket,
          reply,
        }),
      });
    } catch (error) {
      console.error("Notification failed:", error);
    }

    return NextResponse.json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("Error in reply POST:", error);
    return NextResponse.json(
      { error: "En feil oppstod" },
      { status: 500 }
    );
  }
}
