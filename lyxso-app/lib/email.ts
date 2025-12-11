// Email notification functions for support tickets
// Currently using placeholder - set up Resend or SendGrid for production

interface TicketEmailData {
  ticket_number: string;
  name: string;
  email: string;
  subject: string;
  description: string;
  category?: string;
}

interface ReplyEmailData {
  ticket_number: string;
  customer_name: string;
  customer_email: string;
  subject: string;
  reply_message: string;
  admin_name?: string;
}

/**
 * Send email notification when a new ticket is created
 */
export async function sendTicketCreatedEmail(ticket: TicketEmailData) {
  console.log('📧 Ticket Created Email:', {
    to: ['support@lyxso.no', ticket.email],
    ticket: ticket.ticket_number,
    subject: ticket.subject,
  });

  // TODO: Implement with Resend or SendGrid
  // For now, this is a placeholder that logs to console
  
  /*
  // Example implementation with Resend:
  import { Resend } from 'resend';
  const resend = new Resend(process.env.RESEND_API_KEY);

  // To support team
  await resend.emails.send({
    from: 'LYXso Support <support@lyxso.no>',
    to: 'support@lyxso.no',
    subject: `New Support Ticket: ${ticket.subject}`,
    html: generateTicketCreatedHtml(ticket),
  });

  // Auto-reply to customer
  await resend.emails.send({
    from: 'LYXso Support <support@lyxso.no>',
    to: ticket.email,
    subject: `We received your message - ${ticket.ticket_number}`,
    html: generateCustomerConfirmationHtml(ticket),
  });
  */

  return {
    success: true,
    message: 'Email notification logged (production email not configured)',
  };
}

/**
 * Send email notification when a reply is added to a ticket
 */
export async function sendReplyEmail(reply: ReplyEmailData) {
  console.log('📧 Reply Email:', {
    to: reply.customer_email,
    ticket: reply.ticket_number,
    from: reply.admin_name || 'Support Team',
  });

  // TODO: Implement with Resend or SendGrid
  // For now, this is a placeholder that logs to console

  /*
  // Example implementation with Resend:
  import { Resend } from 'resend';
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: 'LYXso Support <support@lyxso.no>',
    to: reply.customer_email,
    subject: `Re: ${reply.subject} [${reply.ticket_number}]`,
    html: generateReplyHtml(reply),
  });
  */

  return {
    success: true,
    message: 'Email notification logged (production email not configured)',
  };
}

// Email template functions (for future implementation)
function generateTicketCreatedHtml(ticket: TicketEmailData): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
          .ticket-info { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #2563eb; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Support Ticket</h1>
          </div>
          <div class="content">
            <div class="ticket-info">
              <p><strong>Ticket:</strong> ${ticket.ticket_number}</p>
              <p><strong>From:</strong> ${ticket.name} (${ticket.email})</p>
              ${ticket.category ? `<p><strong>Category:</strong> ${ticket.category}</p>` : ''}
              <p><strong>Subject:</strong> ${ticket.subject}</p>
            </div>
            <p><strong>Message:</strong></p>
            <p>${ticket.description.replace(/\n/g, '<br>')}</p>
            <a href="https://lyxso.no/support/${ticket.ticket_number}" class="button">
              View Ticket
            </a>
          </div>
          <div class="footer">
            <p>LYXso Support System</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

function generateCustomerConfirmationHtml(ticket: TicketEmailData): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
          .ticket-number { font-size: 20px; font-weight: bold; color: #2563eb; margin: 15px 0; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thanks for reaching out!</h1>
          </div>
          <div class="content">
            <p>Hi ${ticket.name},</p>
            <p>We've received your support request and will respond as soon as possible.</p>
            <div class="ticket-number">
              Your ticket number: ${ticket.ticket_number}
            </div>
            <p><strong>Subject:</strong> ${ticket.subject}</p>
            <p>You can track your ticket status in the customer portal.</p>
          </div>
          <div class="footer">
            <p>Best regards,<br>LYXso Support Team</p>
            <p><a href="https://lyxso.no">lyxso.no</a></p>
          </div>
        </div>
      </body>
    </html>
  `;
}

function generateReplyHtml(reply: ReplyEmailData): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
          .reply-box { background: white; padding: 15px; margin: 15px 0; 
                       border-left: 4px solid #10b981; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Reply to Your Support Ticket</h1>
          </div>
          <div class="content">
            <p>Hi ${reply.customer_name},</p>
            <p>${reply.admin_name || 'Our support team'} replied to your ticket:</p>
            <div class="reply-box">
              <p>${reply.reply_message.replace(/\n/g, '<br>')}</p>
            </div>
            <a href="https://lyxso.no/support/${reply.ticket_number}" class="button">
              View Full Conversation
            </a>
          </div>
          <div class="footer">
            <p>Best regards,<br>LYXso Support Team</p>
            <p><a href="https://lyxso.no">lyxso.no</a></p>
          </div>
        </div>
      </body>
    </html>
  `;
}

// Setup instructions for production
export const EMAIL_SETUP_INSTRUCTIONS = `
To enable email notifications in production:

1. Choose an email service:
   - Resend (recommended): https://resend.com
   - SendGrid: https://sendgrid.com
   - Postmark: https://postmarkapp.com

2. Sign up and get API key

3. Install package:
   npm install resend
   # or
   npm install @sendgrid/mail

4. Add to .env.local:
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   # or
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxx

5. Update this file (lib/email.ts) to use the actual service

6. Verify domain and set up SPF/DKIM records

7. Test email delivery thoroughly
`;
