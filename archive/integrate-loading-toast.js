/**
 * Loading & Toast Integration Helper
 * 
 * This script helps integrate loading states and toasts into your pages.
 * It provides utility functions to add Suspense boundaries and toast notifications.
 * 
 * Usage:
 *   node integrate-loading-toast.js
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// TEMPLATES
// ============================================================================

const TEMPLATES = {
  // Suspense wrapper for page.tsx
  pageWithSuspense: (componentName, skeletonType = 'SkeletonList') => `import { Suspense } from 'react';
import { ${skeletonType} } from '@/components/LoadingStates';
import ${componentName}Client from './${componentName}Client';

export default function ${componentName}Page() {
  return (
    <Suspense fallback={<${skeletonType} />}>
      <${componentName}Client />
    </Suspense>
  );
}
`,

  // Client component with loading state
  clientWithLoading: (componentName) => `'use client';

import { useState, useEffect } from 'react';
import { showToast } from '@/lib/toast';
import { SkeletonList } from '@/components/LoadingStates';

export default function ${componentName}Client() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData()
      .then(setData)
      .catch(() => showToast.error('Failed to load data'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <SkeletonList />;

  return (
    <div>
      {/* Your content here */}
    </div>
  );
}

async function fetchData() {
  // Implement your data fetching logic
  return [];
}
`,

  // Toast imports
  toastImports: `import { showToast } from '@/lib/toast';`,

  // Toast handlers
  toastHandlers: `
// Create operation with toast
const handleCreate = async (data: any) => {
  await showToast.promise(
    createItem(data),
    {
      loading: 'Creating...',
      success: 'Created successfully!',
      error: 'Failed to create'
    }
  );
};

// Update operation with toast
const handleUpdate = async (id: string, data: any) => {
  await showToast.promise(
    updateItem(id, data),
    {
      loading: 'Updating...',
      success: 'Updated successfully!',
      error: 'Failed to update'
    }
  );
};

// Delete operation with undo toast
const handleDelete = (id: string) => {
  showToast.action(
    'Item deleted',
    'Undo',
    () => restoreItem(id),
    { description: 'Click undo to restore' }
  );
};
`,
};

// ============================================================================
// PAGE CONFIGURATIONS
// ============================================================================

const PAGE_CONFIGS = [
  {
    name: 'Booking',
    path: 'app/(protected)/booking',
    skeleton: 'SkeletonList',
    operations: ['create', 'update', 'delete'],
    priority: 1,
  },
  {
    name: 'Dashboard',
    path: 'app/(protected)/dashboard',
    skeleton: 'SkeletonDashboard',
    operations: ['refresh'],
    priority: 1,
  },
  {
    name: 'Kunder',
    path: 'app/(protected)/kunder',
    skeleton: 'SkeletonList',
    operations: ['create', 'update', 'delete', 'import'],
    priority: 1,
  },
  {
    name: 'AdminDashboard',
    path: 'app/(protected)/admin/dashboard',
    skeleton: 'SkeletonDashboard',
    operations: ['refresh'],
    priority: 2,
  },
  {
    name: 'CEO',
    path: 'app/(protected)/ceo',
    skeleton: 'SkeletonDashboard',
    operations: ['refresh'],
    priority: 2,
  },
  {
    name: 'Ansatte',
    path: 'app/(protected)/ansatte',
    skeleton: 'SkeletonList',
    operations: ['create', 'update', 'delete'],
    priority: 2,
  },
  {
    name: 'Notifikasjoner',
    path: 'app/(protected)/notifikasjoner',
    skeleton: 'SkeletonList',
    operations: ['markRead', 'delete'],
    priority: 2,
  },
  {
    name: 'Rapporter',
    path: 'app/(protected)/rapporter',
    skeleton: 'SkeletonDashboard',
    operations: ['export', 'generate'],
    priority: 2,
  },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function generatePageFile(config) {
  return TEMPLATES.pageWithSuspense(config.name, config.skeleton);
}

function generateClientFile(config) {
  return TEMPLATES.clientWithLoading(config.name);
}

function generateToastSnippets(operations) {
  const snippets = {
    create: `
const handleCreate = async (data: any) => {
  await showToast.promise(
    createItem(data),
    {
      loading: 'Creating...',
      success: 'Created successfully!',
      error: 'Failed to create'
    }
  );
};`,
    update: `
const handleUpdate = async (id: string, data: any) => {
  await showToast.promise(
    updateItem(id, data),
    {
      loading: 'Updating...',
      success: 'Updated successfully!',
      error: 'Failed to update'
    }
  );
};`,
    delete: `
const handleDelete = (id: string) => {
  showToast.action(
    'Item deleted',
    'Undo',
    () => restoreItem(id),
    { description: 'Click undo to restore' }
  );
};`,
    refresh: `
const handleRefresh = async () => {
  await showToast.promise(
    fetchData(),
    {
      loading: 'Refreshing...',
      success: 'Data refreshed!',
      error: 'Failed to refresh'
    }
  );
};`,
    import: `
const handleImport = async (file: File) => {
  await showToast.promise(
    importData(file),
    {
      loading: 'Importing data...',
      success: 'Data imported successfully!',
      error: 'Failed to import data'
    }
  );
};`,
    export: `
const handleExport = async () => {
  await showToast.promise(
    exportData(),
    {
      loading: 'Exporting data...',
      success: 'Data exported successfully!',
      error: 'Failed to export data'
    }
  );
};`,
    generate: `
const handleGenerate = async () => {
  await showToast.promise(
    generateReport(),
    {
      loading: 'Generating report...',
      success: 'Report generated!',
      error: 'Failed to generate report'
    }
  );
};`,
    markRead: `
const handleMarkRead = async (id: string) => {
  await showToast.promise(
    markAsRead(id),
    {
      loading: 'Marking as read...',
      success: 'Marked as read!',
      error: 'Failed to mark as read'
    }
  );
};`,
  };

  return operations.map(op => snippets[op] || '').join('\n\n');
}

// ============================================================================
// DOCUMENTATION GENERATOR
// ============================================================================

function generateImplementationGuide() {
  console.log('\n' + '='.repeat(80));
  console.log('📋 LOADING & TOAST INTEGRATION GUIDE');
  console.log('='.repeat(80) + '\n');

  console.log('🎯 PRIORITY 1 PAGES (Do these first):\n');
  PAGE_CONFIGS.filter(p => p.priority === 1).forEach((config, index) => {
    console.log(`${index + 1}. ${config.name} (${config.path})`);
    console.log(`   Skeleton: ${config.skeleton}`);
    console.log(`   Operations: ${config.operations.join(', ')}`);
    console.log();
  });

  console.log('\n🎯 PRIORITY 2 PAGES (Do these next):\n');
  PAGE_CONFIGS.filter(p => p.priority === 2).forEach((config, index) => {
    console.log(`${index + 1}. ${config.name} (${config.path})`);
    console.log(`   Skeleton: ${config.skeleton}`);
    console.log(`   Operations: ${config.operations.join(', ')}`);
    console.log();
  });

  console.log('\n' + '-'.repeat(80));
  console.log('📝 QUICK INTEGRATION STEPS:\n');
  console.log('For each page:');
  console.log('  1. Add Suspense wrapper in page.tsx');
  console.log('  2. Add loading skeleton in client component');
  console.log('  3. Add toast notifications to operations');
  console.log('  4. Test the page\n');
  console.log('-'.repeat(80) + '\n');
}

function generateCodeSnippets() {
  console.log('📄 CODE SNIPPETS FOR INTEGRATION:\n');
  console.log('='.repeat(80) + '\n');

  PAGE_CONFIGS.slice(0, 3).forEach((config) => {
    console.log(`\n${'─'.repeat(80)}`);
    console.log(`📦 ${config.name} Page`);
    console.log('─'.repeat(80) + '\n');

    console.log('// page.tsx');
    console.log(generatePageFile(config));

    console.log('\n// Toast handlers for operations:');
    console.log(generateToastSnippets(config.operations));
    console.log();
  });
}

function generateChecklistFile() {
  const content = `# 📋 Loading & Toast Integration Checklist

Generated: ${new Date().toISOString()}

## 🎯 Progress Tracker

### Priority 1 (Critical - Do First)

${PAGE_CONFIGS.filter(p => p.priority === 1).map(config => `
#### ${config.name}
**Path**: \`${config.path}\`  
**Skeleton**: \`${config.skeleton}\`  
**Operations**: ${config.operations.join(', ')}

- [ ] Add Suspense wrapper to page.tsx
- [ ] Add loading state to client component
${config.operations.map(op => `- [ ] Add toast for ${op} operation`).join('\n')}
- [ ] Test on desktop
- [ ] Test on mobile
- [ ] Verify no layout shifts

**Estimated time**: 15-20 minutes  
**Status**: ⏳ Pending
`).join('\n')}

### Priority 2 (Important - Do Next)

${PAGE_CONFIGS.filter(p => p.priority === 2).map(config => `
#### ${config.name}
**Path**: \`${config.path}\`  
**Skeleton**: \`${config.skeleton}\`  
**Operations**: ${config.operations.join(', ')}

- [ ] Add Suspense wrapper to page.tsx
- [ ] Add loading state to client component
${config.operations.map(op => `- [ ] Add toast for ${op} operation`).join('\n')}
- [ ] Test on desktop
- [ ] Test on mobile

**Estimated time**: 10-15 minutes  
**Status**: ⏳ Pending
`).join('\n')}

## 📊 Overall Progress

- **Total Pages**: ${PAGE_CONFIGS.length}
- **Priority 1**: ${PAGE_CONFIGS.filter(p => p.priority === 1).length} pages
- **Priority 2**: ${PAGE_CONFIGS.filter(p => p.priority === 2).length} pages
- **Estimated Total Time**: ${PAGE_CONFIGS.length * 15} minutes (~${Math.ceil(PAGE_CONFIGS.length * 15 / 60)} hours)

## 🎉 Success Criteria

- [ ] All pages have loading states
- [ ] All CRUD operations show toasts
- [ ] Error handling implemented everywhere
- [ ] No blank screens during loading
- [ ] Consistent user feedback across app
- [ ] Mobile experience tested
- [ ] No layout shifts (Lighthouse check)

---

**Generated by**: Loading & Toast Integration Helper  
**Documentation**: SIMPLE_LOADING_TOAST_INTEGRATION.md
`;

  return content;
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

function main() {
  console.clear();
  
  // Generate and display guide
  generateImplementationGuide();
  
  // Generate code snippets
  generateCodeSnippets();
  
  // Generate checklist file
  const checklistPath = path.join(__dirname, 'LOADING_TOAST_INTEGRATION_CHECKLIST.md');
  fs.writeFileSync(checklistPath, generateChecklistFile());
  
  console.log('\n' + '='.repeat(80));
  console.log('✅ GENERATED FILES:');
  console.log('='.repeat(80));
  console.log(`\n📄 ${checklistPath}`);
  console.log('   Use this to track your integration progress\n');
  
  console.log('🚀 NEXT STEPS:\n');
  console.log('1. Read: SIMPLE_LOADING_TOAST_INTEGRATION.md');
  console.log('2. Track: LOADING_TOAST_INTEGRATION_CHECKLIST.md');
  console.log('3. Start with: Booking page (highest priority)');
  console.log('4. Follow the patterns above');
  console.log('5. Test each page after integration\n');
  
  console.log('⏱️  ESTIMATED TIME: 2-3 hours for all pages');
  console.log('💡 TIP: Start with Priority 1 pages for maximum impact!\n');
  console.log('='.repeat(80) + '\n');
}

// Run the helper
if (require.main === module) {
  main();
}

module.exports = {
  TEMPLATES,
  PAGE_CONFIGS,
  generatePageFile,
  generateClientFile,
  generateToastSnippets,
};
