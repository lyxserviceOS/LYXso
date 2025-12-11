import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function PATCH(request: NextRequest, context: any) {
  try {
    const params = await context?.params;
    if (!params || !params.bookingId) {
      return NextResponse.json(
        { error: "Missing bookingId in route params" },
        { status: 400 }
      );
    }
    const { bookingId } = params as { bookingId: string };
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    // Verify user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get customer ID
    const { data: customer } = await supabase
      .from('customers')
      .select('id')
      .eq('email', user.email)
      .single();

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Verify booking belongs to customer
    const { data: booking } = await supabase
      .from('bookings')
      .select('id')
      .eq('id', bookingId)
      .eq('customer_id', customer.id)
      .single();

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Forward request to backend API
    const response = await fetch(
      `${API_URL}/api/customers/${customer.id}/bookings/${bookingId}/cancel`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
