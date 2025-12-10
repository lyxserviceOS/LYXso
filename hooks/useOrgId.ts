'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useOrgId() {
  const [orgId, setOrgId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrgId() {
      try {
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError) {
          setError('Autentiseringsfeil');
          setLoading(false);
          return;
        }

        if (!user) {
          setError('Ikke innlogget');
          setLoading(false);
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('org_id')
          .eq('id', user.id)
          .single();
        
        if (profileError) {
          setError('Kunne ikke hente profil');
          setLoading(false);
          return;
        }

        if (!profile?.org_id) {
          setError('Ingen organisasjon tilknyttet bruker');
          setLoading(false);
          return;
        }

        setOrgId(profile.org_id);
      } catch (err) {
        setError('En uventet feil oppstod');
      } finally {
        setLoading(false);
      }
    }
    
    fetchOrgId();
  }, []);

  return { orgId, loading, error };
}
