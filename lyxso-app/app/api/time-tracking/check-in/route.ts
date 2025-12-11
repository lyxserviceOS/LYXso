/**
 * TIME TRACKING API - Check In
 * POST /api/time-tracking/check-in
 */

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Ikke autentisert' }, { status: 401 });
    }

    const body = await request.json();
    const { location_id, latitude, longitude, wifi_ssid, wifi_mac, ip_address, notes } = body;

    const { data: profile } = await supabase
      .from('profiles')
      .select('org_id')
      .eq('id', user.id)
      .single();

    if (!profile?.org_id) {
      return NextResponse.json({ error: 'Ingen organisasjon funnet' }, { status: 400 });
    }

    const { data: modules } = await supabase
      .from('organization_modules')
      .select('time_tracking_enabled, wifi_validation_required')
      .eq('org_id', profile.org_id)
      .single();

    if (!modules?.time_tracking_enabled) {
      return NextResponse.json({ error: 'Tidsregistrering er ikke aktivert' }, { status: 403 });
    }

    const { data: existingCheckin } = await supabase
      .from('time_tracking_checkins')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'checked_in')
      .is('check_out_time', null)
      .single();

    if (existingCheckin) {
      return NextResponse.json({ error: 'Du er allerede innstemplet' }, { status: 400 });
    }

    let location_validated = !modules.wifi_validation_required;
    let wifi_validated = !modules.wifi_validation_required;
    let validation_method = 'manual';

    if (modules.wifi_validation_required) {
      const { data: workLocations } = await supabase
        .from('work_locations')
        .select('*')
        .eq('org_id', profile.org_id)
        .eq('is_active', true);

      if (!workLocations || workLocations.length === 0) {
        return NextResponse.json({ error: 'Ingen arbeidslokasjoner er konfigurert' }, { status: 400 });
      }

      if (wifi_ssid && wifi_mac) {
        for (const loc of workLocations) {
          const wifiNetworks = loc.wifi_networks as Array<{ ssid: string; mac: string }>;
          if (wifiNetworks) {
            const matchingNetwork = wifiNetworks.find(
              (network: { ssid: string; mac: string }) =>
                network.ssid === wifi_ssid && network.mac === wifi_mac
            );
            if (matchingNetwork) {
              wifi_validated = true;
              validation_method = 'wifi';
              break;
            }
          }
        }
      }

      if (!wifi_validated && latitude && longitude) {
        for (const loc of workLocations) {
          if (loc.latitude && loc.longitude) {
            const distance = calculateDistance(latitude, longitude, loc.latitude, loc.longitude);
            if (distance <= (loc.geofence_radius || 100)) {
              location_validated = true;
              validation_method = 'gps';
              break;
            }
          }
        }
      }

      if (!wifi_validated && !location_validated && ip_address) {
        for (const loc of workLocations) {
          const ipRanges = loc.ip_ranges as string[];
          if (ipRanges && ipRanges.length > 0) {
            const matchingRange = ipRanges.find((range: string) => 
              ip_address.startsWith(range.split('/')[0].substring(0, 10))
            );
            if (matchingRange) {
              location_validated = true;
              validation_method = 'ip';
              break;
            }
          }
        }
      }

      if (!wifi_validated && !location_validated) {
        return NextResponse.json({
          error: 'Du må være på bedriftens WiFi eller innenfor arbeidsområdet',
          details: { wifi_found: !!wifi_ssid, gps_available: !!(latitude && longitude), ip_address: !!ip_address }
        }, { status: 403 });
      }
    }

    const { data: checkin, error: checkinError } = await supabase
      .from('time_tracking_checkins')
      .insert({
        user_id: user.id,
        org_id: profile.org_id,
        location_id: location_id || null,
        check_in_time: new Date().toISOString(),
        check_in_latitude: latitude,
        check_in_longitude: longitude,
        check_in_wifi_ssid: wifi_ssid,
        check_in_wifi_mac: wifi_mac,
        check_in_ip_address: ip_address,
        location_validated,
        wifi_validated,
        validation_method,
        work_type: 'regular',
        status: 'checked_in',
        notes
      })
      .select()
      .single();

    if (checkinError) {
      console.error('Check-in error:', checkinError);
      return NextResponse.json({ error: 'Kunne ikke opprette innstemplingsrekord' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      checkin,
      message: 'Innstemplet!',
      validation: { location_validated, wifi_validated, method: validation_method }
    });

  } catch (error) {
    console.error('Check-in error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
