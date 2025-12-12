# Lucide Icons Fixed in AIModuleLayout

## Summary
Fixed all TypeScript errors related to Lucide icons in AIModuleLayout calls across all AI pages.

Changed all icon props from component references to JSX elements:
- Top-level `icon` prop: `<Icon className="w-5 h-5" />`
- Stats array `icon` fields: `<Icon className="w-4 h-4" />`

## Files Changed

### 1. app/(protected)/ai/coatvision/page.tsx
**Changes:**
- `icon={Scan}` → `icon={<Scan className="w-5 h-5" />}`
- Added imports: `Image, Target, Clock, AlertCircle`
- Stats icons converted to JSX elements

### 2. app/(protected)/ai/marketing/page.tsx
**Changes:**
- `icon={Megaphone}` → `icon={<Megaphone className="w-5 h-5" />}`
- Stats icons: `Target`, `Users`, `TrendingUp`, `Sparkles` → JSX elements

### 3. app/(protected)/ai/booking/page.tsx
**Status:** Already fixed ✓
- All icons already using JSX elements

### 4. app/(protected)/ai/capacity/page.tsx
**Status:** Already fixed ✓
- All icons already using JSX elements

### 5. app/(protected)/ai/chat/page.tsx
**Status:** Already fixed ✓
- All icons already using JSX elements

### 6. app/(protected)/ai/content/page.tsx
**Changes:**
- `icon={FileText}` → `icon={<FileText className="w-5 h-5" />}`
- Stats icons: `FileText`, `Eye`, `Zap`, `Sparkles` → JSX elements

### 7. app/(protected)/ai/crm/page.tsx
**Changes:**
- `icon={Users}` → `icon={<Users className="w-5 h-5" />}`
- Added imports: `Star, Heart, TrendingUp`
- Stats icons converted to JSX elements

### 8. app/(protected)/ai/inventory/page.tsx
**Changes:**
- `icon={Package}` → `icon={<Package className="w-5 h-5" />}`
- Added imports: `DollarSign, TrendingDown, Brain`
- Stats icons converted to JSX elements

### 9. app/(protected)/ai/pricing/page.tsx
**Changes:**
- `icon={DollarSign}` → `icon={<DollarSign className="w-5 h-5" />}`
- Added imports: `Percent, Users, TrendingUp`
- Stats icons converted to JSX elements

### 10. app/(protected)/ai/upsell/page.tsx
**Changes:**
- `icon={TrendingUp}` → `icon={<TrendingUp className="w-5 h-5" />}`
- Added imports: `ShoppingCart, Percent, DollarSign`
- Stats icons converted to JSX elements

### 11. app/(protected)/ai/accounting/page.tsx
**Status:** Already fixed ✓
- All icons already using JSX elements

## Pattern Applied

### Before:
```tsx
<AIModuleLayout
  icon={IconComponent}
  stats={[
    { label: '...', value: '...', icon: IconComponent, ... }
  ]}
/>
```

### After:
```tsx
<AIModuleLayout
  icon={<IconComponent className="w-5 h-5" />}
  stats={[
    { 
      label: '...',
      value: '...',
      icon: <IconComponent className="w-4 h-4" />,
      ...
    }
  ]}
/>
```

## Result
All TypeScript errors of type:
```
Type 'ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>' 
is not assignable to type 'ReactNode'.
```

have been resolved. All AIModuleLayout calls now use consistent JSX elements for icons.
