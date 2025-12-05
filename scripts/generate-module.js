#!/usr/bin/env node
/**
 * LYXSO MODULE GENERATOR
 * Generates complete modules with API, UI, and pages
 */

const fs = require('fs');
const path = require('path');

const MODULE_TEMPLATES = {
  api: (moduleName, ModuleName) => `/**
 * ${ModuleName.toUpperCase()} - API Route
 */
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: 'Ikke autentisert' }, { status: 401 });

    const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
    if (!profile?.org_id) return NextResponse.json({ error: 'Ingen organisasjon' }, { status: 400 });

    const { data: items } = await supabase
      .from('${moduleName}')
      .select('*')
      .eq('org_id', profile.org_id)
      .order('created_at', { ascending: false });

    return NextResponse.json({ success: true, items: items || [] });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: 'Ikke autentisert' }, { status: 401 });

    const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
    if (!profile?.org_id) return NextResponse.json({ error: 'Ingen organisasjon' }, { status: 400 });

    const body = await request.json();
    const { data: item } = await supabase
      .from('${moduleName}')
      .insert({ ...body, org_id: profile.org_id })
      .select()
      .single();

    return NextResponse.json({ success: true, item, message: '${ModuleName} opprettet' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
`,

  component: (moduleName, ModuleName) => `/**
 * ${ModuleName.toUpperCase()} - Main Component
 */
'use client';

import { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { showToast } from '@/lib/toast';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import EmptyState from '@/components/ui/EmptyState';

export default function ${ModuleName}Manager() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/${moduleName}');
      const data = await res.json();
      if (data.success) setItems(data.items);
    } catch (error) {
      showToast.error('Kunne ikke laste data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSkeleton rows={5} />;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-slate-900">${ModuleName}</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Ny
        </button>
      </div>

      {items.length === 0 ? (
        <EmptyState title="Ingen data" description="Kom i gang ved å legge til første ${moduleName}" />
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Content here */}
          <p>Listing {items.length} items</p>
        </div>
      )}
    </div>
  );
}
`
};

function generateModule(moduleName) {
  const ModuleName = moduleName.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join('');
  
  const apiDir = path.join(process.cwd(), 'app', 'api', moduleName);
  const componentDir = path.join(process.cwd(), 'components', moduleName);

  [apiDir, componentDir].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  fs.writeFileSync(path.join(apiDir, 'route.ts'), MODULE_TEMPLATES.api(moduleName, ModuleName));
  fs.writeFileSync(path.join(componentDir, `${ModuleName}Manager.tsx`), MODULE_TEMPLATES.component(moduleName, ModuleName));

  console.log(`✅ ${moduleName} generated!`);
}

const moduleName = process.argv[2];
if (!moduleName) {
  console.error('Usage: node generate-module.js [module-name]');
  process.exit(1);
}

generateModule(moduleName);
