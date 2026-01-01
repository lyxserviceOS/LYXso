// app/api/support/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createApiClient } from "@/lib/supabase/api-client";

const supabase = createApiClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, category, subject, message } = body;

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Navn, e-post og melding er påkrevd" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Ugyldig e-postadresse" },
        { status: 400 }
      );
    }

    // Generate ticket number
    const ticketNumber = `SUP-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    // Create support ticket
    const { data: ticket, error: ticketError } = await supabase
      .from("support_tickets")
      .insert({
        ticket_number: ticketNumber,
        name,
        email,
        company: company || null,
        category: category || "general",
        subject: subject || "Kontaktskjema henvendelse",
        description: message,
        status: "open",
        priority: "medium",
        source: "contact_form",
      })
      .select()
      .single();

    if (ticketError) {
      console.error("Error creating ticket:", ticketError);
      return NextResponse.json(
        { error: "Kunne ikke opprette support-ticket" },
        { status: 500 }
      );
    }

    // Send email notification to support team
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/support/notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "new_ticket",
          ticket,
        }),
      });
    } catch (emailError) {
      console.error("Email notification failed:", emailError);
      // Don't fail the request if email fails
    }

    // Send auto-reply to user
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/support/notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "auto_reply",
          ticket,
        }),
      });
    } catch (emailError) {
      console.error("Auto-reply failed:", emailError);
    }

    return NextResponse.json({
      success: true,
      ticket_number: ticketNumber,
      message: "Takk for din henvendelse! Vi tar kontakt snart.",
    });
  } catch (error) {
    console.error("Error in contact endpoint:", error);
    return NextResponse.json(
      { error: "En feil oppstod. Prøv igjen senere." },
      { status: 500 }
    );
  }
}
