# Partner Landing Page - Improvements Documentation

## Overview
This document describes the comprehensive improvements made to the partner landing page system, including storage, additional sections, and enhanced editing capabilities.

## 1. Storage Bucket Setup

### SQL Migration
File: `create_landing_page_storage.sql`

Creates:
- **Storage bucket**: `landing-pages` (public, 10MB max, image files only)
- **Folder structure**: `landing-pages/{org_id}/{subfolder}/{filename}`
- **RLS policies**: 
  - Public read access for all images
  - Org-scoped upload/update/delete for authenticated users

### New Table Columns
Added to `partner_landing_pages`:
- `logo_url` - Organization logo
- `gallery_images` - JSONB array of gallery images
- `testimonials` - JSONB array of customer testimonials  
- `faq_items` - JSONB array of FAQ entries
- `show_gallery`, `show_testimonials`, `show_faq` - Toggle visibility
- `gallery_title`, `testimonials_title`, `faq_title` - Section titles

## 2. Image Upload Component

### Component: ImageUploadWidget
File: `components/ImageUploadWidget.tsx`

Features:
- Drag-and-drop file selection
- Image preview before upload
- File size validation (10MB max)
- File type validation (images only)
- Progress indicator during upload
- Error handling with user-friendly messages
- Automatic unique filename generation
- Supabase Storage integration

Usage:
```tsx
<ImageUploadWidget
  orgId={orgId}
  currentImageUrl={form.hero_image_url}
  onUploadComplete={(url) => setForm({...form, hero_image_url: url})}
  label="Hero Image"
  folder="hero"
/>
```

## 3. Enhanced Settings Page

### New Features

#### Gallery Management
- Upload multiple images
- Reorder images with drag-and-drop
- Add captions to each image
- Delete individual images
- Toggle gallery section on/off

#### Testimonials Section
- Add customer testimonials
- Fields: customer name, role/company, testimonial text, rating (1-5 stars)
- Optional customer photo
- Reorder testimonials
- Toggle testimonials section on/off

#### FAQ Section
- Add FAQ items
- Fields: question, answer
- Reorder FAQ items
- Toggle FAQ section on/off
- Expandable/collapsible display

#### Image Uploads
Available for:
- Logo
- Hero background image
- About section image
- Gallery images (multiple)
- Testimonial photos (optional)

#### Live Preview
- Side-by-side editor and preview
- Real-time updates as you type
- Toggle between mobile/desktop preview
- Color scheme preview

#### Enhanced Styling Options
- Custom logo upload
- Primary and secondary color pickers
- Font family selection
- Custom CSS editor (advanced)

## 4. Improved Public Landing Page

### New Sections

#### Hero Section
- Full-width background image
- Logo display
- Headline and subheadline
- CTA buttons
- Custom color overlay

#### About Section
- Two-column layout (text + image)
- Rich text content
- Side image with optional overlay

#### Services Grid
- Dynamic service cards
- Icons (optional)
- Pricing display
- Hover effects

#### Gallery Section
- Masonry grid layout
- Lightbox for full-size images
- Image captions
- Lazy loading for performance

#### Testimonials Section
- Card-based layout
- Star ratings
- Customer photos (optional)
- Sliding carousel on mobile

#### FAQ Section
- Accordion-style expandable items
- Smooth animations
- Search/filter capability (future)

#### Contact Section
- Contact information display
- Google Maps integration (optional)
- Social media links
- Contact form (future)

### Responsive Design
- Mobile-first approach
- Tablet breakpoints
- Desktop optimization
- Touch-friendly interactions

## 5. API Endpoints

### GET /api/orgs/:orgId/landing-page
Returns landing page configuration

### PUT /api/orgs/:orgId/landing-page
Updates landing page configuration

### POST /api/orgs/:orgId/landing-page/upload
Uploads images to storage (alternative to direct Supabase upload)

## 6. Data Structures

### Gallery Image
```typescript
{
  id: string;
  url: string;
  caption?: string;
  alt?: string;
  order: number;
}
```

### Testimonial
```typescript
{
  id: string;
  customerName: string;
  role?: string;
  company?: string;
  text: string;
  rating: number; // 1-5
  photoUrl?: string;
  order: number;
}
```

### FAQ Item
```typescript
{
  id: string;
  question: string;
  answer: string;
  order: number;
}
```

### Service
```typescript
{
  title: string;
  description: string;
  icon?: string;
  price?: string;
}
```

## 7. Next Steps & Future Enhancements

### Phase 2 (Immediate)
- [ ] Add contact form with email notifications
- [ ] Implement analytics tracking
- [ ] Add video support (hero background video)
- [ ] Multi-language support

### Phase 3 (Future)
- [ ] A/B testing for different landing page variants
- [ ] Custom domain mapping (partner.domain.com)
- [ ] Template library (pre-designed layouts)
- [ ] AI-powered content suggestions
- [ ] Advanced animations and interactions
- [ ] Blog/news section integration
- [ ] Customer portal integration
- [ ] Online booking widget integration

## 8. Performance Optimizations

- Image lazy loading
- WebP format support
- CDN integration via Supabase
- Minified CSS/JS
- Critical CSS inlining
- Font subsetting
- Responsive images with srcset

## 9. SEO Features

- Dynamic meta tags (title, description, keywords)
- Open Graph tags for social sharing
- Structured data (JSON-LD) for organizations
- Sitemap generation
- robots.txt configuration
- Canonical URLs

## 10. Security & Privacy

- RLS policies enforced
- Authenticated uploads only
- File type validation
- File size limits
- XSS protection in user content
- CSRF protection
- Rate limiting on API endpoints

---

## Quick Reference Commands

### Run Storage Migration
```sql
\i create_landing_page_storage.sql
```

### Check Current Landing Page
```sql
SELECT * FROM partner_landing_pages WHERE org_id = '{org_id}';
```

### List Uploaded Images
```sql
SELECT * FROM storage.objects 
WHERE bucket_id = 'landing-pages' 
AND name LIKE '{org_id}/%';
```

### Delete All Images for Org
```sql
-- Warning: This deletes all images!
DELETE FROM storage.objects 
WHERE bucket_id = 'landing-pages' 
AND name LIKE '{org_id}/%';
```
