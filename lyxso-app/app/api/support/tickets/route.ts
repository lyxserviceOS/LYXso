// app/api/support/tickets/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET - List all tickets (admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    let query = supabase
      .from("support_tickets")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    // Filters
    if (status) {
      query = query.eq("status", status);
    }
    if (priority) {
      query = query.eq("priority", priority);
    }
    if (category) {
      query = query.eq("category", category);
    }
    if (search) {
      query = query.or(
        `ticket_number.ilike.%${search}%,email.ilike.%${search}%,name.ilike.%${search}%,subject.ilike.%${search}%`
      );
    }

    const { data: tickets, error, count } = await query;

    if (error) {
      console.error("Error fetching tickets:", error);
      return NextResponse.json(
        { error: "Kunne ikke hente tickets" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      tickets,
      total: count,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Error in tickets GET:", error);
    return NextResponse.json(
      { error: "En feil oppstod" },
      { status: 500 }
    );
  }
}

// POST - Create new ticket
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      company,
      subject,
      description,
      category,
      priority,
      user_id,
    } = body;

    // Validation
    if (!name || !email || !subject || !description) {
      return NextResponse.json(
        { error: "Navn, e-post, emne og beskrivelse er påkrevd" },
        { status: 400 }
      );
    }

    // Generate ticket number
    const ticketNumber = `SUP-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    // Create ticket
    const { data: ticket, error: ticketError } = await supabase
      .from("support_tickets")
      .insert({
        ticket_number: ticketNumber,
        user_id: user_id || null,
        name,
        email,
        company: company || null,
        subject,
        description,
        category: category || "general",
        priority: priority || "medium",
        status: "open",
        source: "portal",
      })
      .select()
      .single();

    if (ticketError) {
      console.error("Error creating ticket:", ticketError);
      return NextResponse.json(
        { error: "Kunne ikke opprette ticket" },
        { status: 500 }
      );
    }

    // Send notifications
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/support/notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "new_ticket",
          ticket,
        }),
      });
    } catch (error) {
      console.error("Notification failed:", error);
    }

    return NextResponse.json({
      success: true,
      ticket,
    });
  } catch (error) {
    console.error("Error in tickets POST:", error);
    return NextResponse.json(
      { error: "En feil oppstod" },
      { status: 500 }
    );
  }
}
