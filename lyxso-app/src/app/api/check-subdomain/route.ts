import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const subdomain = searchParams.get('subdomain');

    if (!subdomain) {
      return NextResponse.json(
        { available: false, message: 'Subdomen er påkrevd' },
        { status: 400 }
      );
    }

    // Validate subdomain format
    const subdomainRegex = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;
    if (!subdomainRegex.test(subdomain)) {
      return NextResponse.json(
        {
          available: false,
          message: 'Ugyldig format. Kun små bokstaver, tall og bindestrek.',
        },
        { status: 400 }
      );
    }

    if (subdomain.length < 3 || subdomain.length > 63) {
      return NextResponse.json(
        {
          available: false,
          message: 'Subdomen må være mellom 3 og 63 tegn',
        },
        { status: 400 }
      );
    }

    // Check reserved subdomains
    const reserved = ['www', 'api', 'app', 'admin', 'test', 'dev', 'staging', 'prod', 'production'];
    if (reserved.includes(subdomain)) {
      return NextResponse.json(
        {
          available: false,
          message: 'Dette subdomenet er reservert',
        },
        { status: 200 }
      );
    }

    const supabase = await createClient();

    // Check if subdomain is already taken in organizations table
    const { data: existingOrg, error } = await supabase
      .from('organizations')
      .select('id')
      .eq('subdomain', subdomain)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "no rows returned" which means available
      console.error('Subdomain check error:', error);
      return NextResponse.json(
        { available: false, message: 'Kunne ikke sjekke subdomen' },
        { status: 500 }
      );
    }

    const available = !existingOrg;

    return NextResponse.json({
      available,
      message: available
        ? `${subdomain}.lyxso.no er tilgjengelig!`
        : 'Dette subdomenet er allerede i bruk',
      subdomain,
    });
  } catch (error) {
    console.error('Subdomain check error:', error);
    return NextResponse.json(
      { available: false, message: 'En feil oppstod' },
      { status: 500 }
    );
  }
}
