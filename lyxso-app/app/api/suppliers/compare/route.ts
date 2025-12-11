/**
 * SUPPLIER PRICE COMPARISON - Norwegian Suppliers
 */
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: 'Ikke autentisert' }, { status: 401 });

    const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
    if (!profile?.org_id) return NextResponse.json({ error: 'Ingen organisasjon' }, { status: 400 });

    const { search_term, vehicle_reg } = await request.json();

    const { data: suppliers } = await supabase
      .from('suppliers')
      .select('*')
      .or(`org_id.eq.${profile.org_id},org_id.is.null`)
      .eq('is_active', true);

    const results = await Promise.all((suppliers || []).map(async (supplier) => {
      const { data: products } = await supabase
        .from('supplier_products')
        .select('*')
        .eq('supplier_id', supplier.id)
        .ilike('name', `%${search_term}%`)
        .eq('in_stock', true)
        .limit(10);

      return {
        supplier_id: supplier.id,
        supplier_name: supplier.name,
        supplier_type: supplier.supplier_type,
        products: (products || []).map(p => ({
          ...p,
          final_price: p.cost_price * (1 + (supplier.default_margin_percentage || 25) / 100),
          total_cost: p.cost_price * (1 + (supplier.default_margin_percentage || 25) / 100) + (supplier.shipping_cost || 0)
        }))
      };
    }));

    const allProducts = results.flatMap(r => r.products.map(p => ({ ...p, supplier: r.supplier_name })));
    allProducts.sort((a, b) => a.total_cost - b.total_cost);

    return NextResponse.json({
      success: true,
      results,
      sorted_products: allProducts,
      cheapest: allProducts[0],
      message: `Fant ${allProducts.length} produkter`
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
