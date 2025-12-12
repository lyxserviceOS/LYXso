// app/api/support/notify/route.ts
import { NextRequest, NextResponse } from "next/server";

// Email notification handler
// In production, integrate with SendGrid, Resend, or similar
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, ticket, reply } = body;

    // For now, just log (in production, send real emails)
    console.log("📧 Email Notification:", {
      type,
      ticket_number: ticket?.ticket_number,
      email: ticket?.email,
      subject: ticket?.subject,
    });

    // TODO: Implement actual email sending
    // Example with SendGrid or Resend would go here

    return NextResponse.json({
      success: true,
      message: "Notification sent (simulated)",
    });
  } catch (error) {
    console.error("Error in notify:", error);
    return NextResponse.json(
      { error: "Kunne ikke sende notifikasjon" },
      { status: 500 }
    );
  }
}
