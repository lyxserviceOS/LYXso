/**
 * INVENTORY TRANSACTIONS
 */
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: 'Ikke autentisert' }, { status: 401 });

    const { item_id, transaction_type, quantity, notes } = await request.json();

    const { data: item } = await supabase.from('inventory_items').select('*').eq('id', item_id).single();
    if (!item) return NextResponse.json({ error: 'Vare ikke funnet' }, { status: 404 });

    const quantity_before = item.current_quantity;
    let quantity_after = quantity_before;

    if (['purchase', 'return'].includes(transaction_type)) quantity_after = quantity_before + quantity;
    else if (['sale', 'loss'].includes(transaction_type)) {
      quantity_after = quantity_before - Math.abs(quantity);
      if (quantity_after < 0) return NextResponse.json({ error: 'Ikke nok på lager' }, { status: 400 });
    }

    const { data: transaction } = await supabase
      .from('inventory_transactions')
      .insert({ item_id, user_id: user.id, transaction_type, quantity: Math.abs(quantity), quantity_before, quantity_after, notes })
      .select()
      .single();

    await supabase.from('inventory_items').update({ current_quantity: quantity_after }).eq('id', item_id);

    return NextResponse.json({ success: true, transaction, new_quantity: quantity_after });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
