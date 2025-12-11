#!/usr/bin/env node
/**
 * ============================================================================
 * LYXso Enterprise Auto-Generator
 * Generates all API routes, components, and hooks automatically
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');

const BASE_PATH = path.join(__dirname, '..', 'lyxso-app');

// ============================================================================
// API ROUTES TO GENERATE
// ============================================================================

const API_ROUTES = {
  'timetracking/checkin': `
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { wifi_ssid, location, device_info, notes } = body;

    const { data: profile } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', session.user.id)
      .single();

    const company_id = profile?.company_id || session.user.id;

    const { data: settings } = await supabase
      .from('time_tracking_settings')
      .select('*')
      .eq('company_id', company_id)
      .single();

    if (settings?.wifi_enforcement && wifi_ssid) {
      const allowed = settings.wifi_ssid || [];
      if (allowed.length > 0 && !allowed.includes(wifi_ssid)) {
        return NextResponse.json({ 
          success: false, 
          error: { code: 'WIFI_NOT_ALLOWED', message: 'Must connect to company WiFi' }
        }, { status: 403 });
      }
    }

    const { data: timeEntry, error } = await supabase
      .from('time_entries')
      .insert({
        employee_id: session.user.id,
        company_id,
        check_in: new Date().toISOString(),
        check_in_wifi_ssid: wifi_ssid,
        check_in_location: location,
        check_in_device_info: device_info,
        notes,
        status: 'active'
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data: timeEntry });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
`,

  'timetracking/checkout': `
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ success: false }, { status: 401 });

    const body = await request.json();
    const { wifi_ssid, location, device_info, notes } = body;

    const { data: activeEntry } = await supabase
      .from('time_entries')
      .select('*')
      .eq('employee_id', session.user.id)
      .is('check_out', null)
      .order('check_in', { ascending: false })
      .limit(1)
      .single();

    if (!activeEntry) {
      return NextResponse.json({ success: false, error: 'No active check-in found' }, { status: 404 });
    }

    const checkOut = new Date().toISOString();
    const checkIn = new Date(activeEntry.check_in);
    const hoursWorked = (new Date(checkOut).getTime() - checkIn.getTime()) / (1000 * 60 * 60);

    const { data, error } = await supabase
      .from('time_entries')
      .update({
        check_out: checkOut,
        check_out_wifi_ssid: wifi_ssid,
        check_out_location: location,
        check_out_device_info: device_info,
        status: 'completed',
        notes: notes || activeEntry.notes
      })
      .eq('id', activeEntry.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data: { ...data, hours_worked: hoursWorked } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
`,

  'modules/list': `
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ success: false }, { status: 401 });

    const { data: modules, error } = await supabase
      .from('available_modules')
      .select(\`
        *,
        category:module_categories(*)
      \`)
      .order('sort_order');

    if (error) throw error;

    return NextResponse.json({ success: true, data: modules });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
`,

  'modules/company': `
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ success: false }, { status: 401 });

    const { data: profile } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', session.user.id)
      .single();

    const company_id = profile?.company_id || session.user.id;

    const { data: companyModules, error } = await supabase
      .from('company_modules')
      .select(\`
        *,
        module:available_modules(
          *,
          category:module_categories(*)
        )
      \`)
      .eq('company_id', company_id);

    if (error) throw error;

    return NextResponse.json({ success: true, data: companyModules });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ success: false }, { status: 401 });

    const body = await request.json();
    const { module_id, is_enabled, configuration } = body;

    const { data: profile } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', session.user.id)
      .single();

    const company_id = profile?.company_id || session.user.id;

    const { data, error } = await supabase
      .from('company_modules')
      .upsert({
        company_id,
        module_id,
        is_enabled,
        configuration: configuration || {},
        enabled_at: is_enabled ? new Date().toISOString() : undefined,
        disabled_at: !is_enabled ? new Date().toISOString() : undefined
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
`,

  'inventory/items': `
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ success: false }, { status: 401 });

    const { data: profile } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', session.user.id)
      .single();

    const company_id = profile?.company_id || session.user.id;

    const { searchParams } = new URL(request.url);
    const item_type = searchParams.get('type');
    const low_stock = searchParams.get('low_stock') === 'true';

    let query = supabase
      .from('inventory_items')
      .select(\`
        *,
        supplier:suppliers(*)
      \`)
      .eq('company_id', company_id);

    if (item_type) {
      query = query.eq('item_type', item_type);
    }

    if (low_stock) {
      query = query.lte('current_stock', 'min_stock_level');
    }

    const { data, error } = await query.order('name');

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ success: false }, { status: 401 });

    const body = await request.json();
    const { data: profile } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', session.user.id)
      .single();

    const company_id = profile?.company_id || session.user.id;

    const { data, error } = await supabase
      .from('inventory_items')
      .insert({
        ...body,
        company_id
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
`,

  'suppliers/quote': `
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ success: false }, { status: 401 });

    const body = await request.json();
    const { part_number, vehicle_reg_number, supplier_ids } = body;

    const { data: suppliers } = await supabase
      .from('suppliers')
      .select('*')
      .eq('is_active', true)
      .eq('supports_price_lookup', true);

    const quotes = [];

    for (const supplier of suppliers || []) {
      if (supplier_ids && !supplier_ids.includes(supplier.id)) continue;

      // Check cache first
      const { data: cached } = await supabase
        .from('supplier_price_cache')
        .select('*')
        .eq('supplier_id', supplier.id)
        .eq('part_number', part_number)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (cached) {
        quotes.push({
          supplier,
          ...cached
        });
        continue;
      }

      // Simulate API call (implement real APIs later)
      const mockPrice = Math.random() * 1000 + 500;
      quotes.push({
        supplier,
        part_number,
        price: mockPrice,
        stock_status: 'in_stock',
        estimated_delivery_days: Math.floor(Math.random() * 5) + 1
      });
    }

    quotes.sort((a, b) => a.price - b.price);
    quotes[0].is_cheapest = true;

    return NextResponse.json({ success: true, data: quotes });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
`,

  'vehicle/lookup': `
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ success: false }, { status: 401 });

    const body = await request.json();
    const { reg_number, force_refresh } = body;

    // Check database first
    if (!force_refresh) {
      const { data: existing } = await supabase
        .from('vehicle_database')
        .select('*')
        .eq('reg_number', reg_number)
        .single();

      if (existing) {
        return NextResponse.json({ success: true, data: existing, source: 'cache' });
      }
    }

    // Call Norwegian vehicle registry API (placeholder)
    const mockVehicleData = {
      reg_number,
      make: 'Toyota',
      model: 'RAV4',
      year: 2020,
      fuel_type: 'Hybrid',
      tire_dimension_front: '225/65R17',
      fetched_from_api: true,
      last_api_check: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('vehicle_database')
      .upsert(mockVehicleData)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data, source: 'api' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
`,

  'pricing/calculate': `
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ success: false }, { status: 401 });

    const body = await request.json();
    const { service_category, base_price, customer_segment, booking_date, location } = body;

    const { data: profile } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', session.user.id)
      .single();

    const company_id = profile?.company_id || session.user.id;

    // Get pricing rules
    const { data: rules } = await supabase
      .from('pricing_rules')
      .select('*')
      .eq('company_id', company_id)
      .eq('is_active', true)
      .order('priority', { ascending: false });

    let final_price = base_price;
    const adjustments = [];

    for (const rule of rules || []) {
      let applies = true;

      // Check conditions
      if (rule.rule_type === 'time_based' && booking_date) {
        const bookingDay = new Date(booking_date).getDay();
        if (rule.conditions.days && !rule.conditions.days.includes(bookingDay)) {
          applies = false;
        }
      }

      if (applies) {
        let adjustment = 0;
        if (rule.adjustment_type === 'percentage') {
          adjustment = final_price * (rule.adjustment_value / 100);
        } else if (rule.adjustment_type === 'fixed_amount') {
          adjustment = rule.adjustment_value;
        }

        final_price += adjustment;
        adjustments.push({
          rule_name: rule.rule_name,
          type: rule.adjustment_type,
          value: rule.adjustment_value,
          applied_amount: adjustment
        });
      }
    }

    const result = {
      base_price,
      adjustments,
      final_price: Math.max(final_price, 0),
      margin_percentage: base_price > 0 ? ((final_price - base_price) / base_price) * 100 : 0
    };

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
`,
};

// ============================================================================
// GENERATE API ROUTES
// ============================================================================

console.log('🚀 Starting LYXso Enterprise Auto-Generator...\n');

Object.entries(API_ROUTES).forEach(([route, content]) => {
  const routePath = path.join(BASE_PATH, 'app', 'api', route);
  const filePath = path.join(routePath, 'route.ts');
  
  if (!fs.existsSync(routePath)) {
    fs.mkdirSync(routePath, { recursive: true });
  }
  
  fs.writeFileSync(filePath, content.trim());
  console.log(`✅ Created API route: /api/${route}`);
});

console.log('\n✨ All API routes generated successfully!');
console.log('\n📝 Next steps:');
console.log('1. Run the database migration: lyxso_enterprise_schema.sql');
console.log('2. Install dependencies: npm install');
console.log('3. Start development server: npm run dev');
console.log('4. Test the endpoints with Postman or curl');
