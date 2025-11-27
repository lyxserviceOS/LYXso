# Partner Landing Page System - Complete Implementation Guide

## Overview
Complete partner landing page system allowing each organization to create, customize, and publish their own landing page at `/p/{orgId}`.

## System Components

### 1. Database Schema
**Table:** `partner_landing_pages`
- **Hero Section:** title, subtitle, image, CTA button
- **About Section:** title, content, image
- **Services:** title, JSONB array of services
- **Gallery:** JSONB array of images with captions
- **Testimonials:** JSONB array of customer reviews
- **FAQ:** JSONB array of questions/answers
- **Contact:** phone, email, address, map URL
- **Social Media:** Facebook, Instagram, LinkedIn
- **Styling:** colors, fonts, custom CSS
- **SEO:** meta title, description, keywords
- **Settings:** is_published, show_booking_widget

### 2. Storage Configuration
**Bucket:** `landing-pages`
- **Max file size:** 10MB
- **Allowed types:** image/jpeg, image/png, image/gif, image/webp
- **Structure:** `landing-pages/{org_id}/{folder}/{filename}`
- **Folders:**
  - `logo/` - Organization logos
  - `hero/` - Hero background images
  - `about/` - About section images
  - `gallery/` - Gallery images
  - `testimonials/` - Customer photos

**RLS Policies:**
```sql
-- Public read for all images
CREATE POLICY "Public read landing page images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'landing-pages');

-- Org members can upload to their folder
CREATE POLICY "Org upload to own folder" 
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'landing-pages' 
  AND name LIKE (auth.jwt() ->> 'org_id')::text || '/%'
);
```

### 3. API Endpoints

#### GET /api/public/landing-pages/:orgId
**Purpose:** Fetch published landing page (no auth required)
**Returns:** 
```json
{
  "org": {
    "id": "uuid",
    "name": "LYX Bilpleie",
    "logo_url": "https://...",
    "org_number": "123456789"
  },
  "landing_page": {
    "hero_title": "Professional Car Care",
    "hero_subtitle": "...",
    "is_published": true,
    ...
  }
}
```
**Status Codes:**
- 200: Success
- 404: Org not found or page not published
- 500: Server error

#### GET /api/orgs/:orgId/landing-page
**Purpose:** Fetch landing page for authenticated org (includes unpublished)
**Auth:** Required (org member)
**Returns:**
```json
{
  "landing_page": {
    "org_id": "uuid",
    "hero_title": "...",
    "is_published": false,
    ...
  }
}
```
**Note:** Returns default template if no landing page exists yet

#### POST /api/orgs/:orgId/landing-page
**Purpose:** Create new landing page
**Auth:** Required (org member)
**Body:**
```json
{
  "hero_title": "Your Title",
  "hero_subtitle": "Subtitle",
  "hero_image_url": "https://...",
  "services_content": [
    {
      "title": "Service Name",
      "description": "Description",
      "price": "999 NOK"
    }
  ],
  "is_published": false
}
```
**Returns:** Created landing page

#### PUT /api/orgs/:orgId/landing-page
**Purpose:** Update existing landing page (upsert)
**Auth:** Required (org member)
**Body:** Same as POST
**Returns:** Updated landing page

#### PATCH /api/orgs/:orgId/landing-page/publish
**Purpose:** Publish or unpublish landing page
**Auth:** Required (org member)
**Body:**
```json
{
  "is_published": true
}
```
**Returns:**
```json
{
  "landing_page": {...},
  "message": "Landingsside publisert"
}
```

#### DELETE /api/orgs/:orgId/landing-page
**Purpose:** Delete landing page
**Auth:** Required (org member)
**Returns:**
```json
{
  "message": "Landingsside slettet"
}
```

### 4. Frontend Integration

#### Example: Fetching Published Page
```typescript
async function fetchPublicLandingPage(orgId: string) {
  const response = await fetch(
    `http://localhost:4000/api/public/landing-pages/${orgId}`
  );
  
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  
  const { org, landing_page } = await response.json();
  return { org, landing_page };
}
```

#### Example: Saving Changes
```typescript
async function saveLandingPage(orgId: string, data: any) {
  const response = await fetch(
    `http://localhost:4000/api/orgs/${orgId}/landing-page`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    }
  );
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.details || 'Save failed');
  }
  
  return response.json();
}
```

#### Example: Image Upload
```typescript
async function uploadImage(orgId: string, file: File, folder: string) {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  // Generate unique filename
  const ext = file.name.split('.').pop();
  const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
  const path = `${orgId}/${folder}/${filename}`;
  
  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from('landing-pages')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    });
  
  if (error) throw error;
  
  // Get public URL
  const { data: urlData } = supabase.storage
    .from('landing-pages')
    .getPublicUrl(path);
  
  return urlData.publicUrl;
}
```

### 5. Data Structures

#### Gallery Image
```typescript
interface GalleryImage {
  id: string;
  url: string;
  caption?: string;
  alt?: string;
  order: number;
}
```

#### Testimonial
```typescript
interface Testimonial {
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

#### FAQ Item
```typescript
interface FAQItem {
  id: string;
  question: string;
  answer: string;
  order: number;
}
```

#### Service
```typescript
interface Service {
  title: string;
  description: string;
  icon?: string;
  price?: string;
}
```

### 6. Usage Flow

#### For Organization Admin:
1. **Navigate to Settings:** Go to `/landingsside` or settings page
2. **Edit Content:** Update hero, about, services sections
3. **Upload Images:** Use image upload widgets for logo, hero, gallery
4. **Add Testimonials:** Add customer reviews with ratings
5. **Configure Contact:** Enter contact details and social media
6. **Customize Styling:** Choose colors and fonts
7. **Preview:** See real-time preview of changes
8. **Publish:** Click publish button to make page live
9. **View Public Page:** Access at `/p/{orgId}`

#### For End Users:
1. **Visit:** Go to `/p/{orgId}` or partner's custom URL
2. **View Content:** Browse services, gallery, testimonials
3. **Contact:** Use contact information or map
4. **Book:** Click CTA button to book service
5. **Share:** Share on social media (OpenGraph tags)

### 7. SEO Configuration

#### Meta Tags (automatically generated)
```html
<title>{meta_title || hero_title}</title>
<meta name="description" content="{meta_description}" />
<meta name="keywords" content="{meta_keywords}" />

<!-- Open Graph -->
<meta property="og:title" content="{meta_title}" />
<meta property="og:description" content="{meta_description}" />
<meta property="og:image" content="{hero_image_url}" />
<meta property="og:url" content="https://yoursite.com/p/{orgId}" />
<meta property="og:type" content="website" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="{meta_title}" />
<meta name="twitter:description" content="{meta_description}" />
<meta name="twitter:image" content="{hero_image_url}" />
```

#### Structured Data (JSON-LD)
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "{org.name}",
  "image": "{logo_url}",
  "telephone": "{contact_phone}",
  "email": "{contact_email}",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "{contact_address}"
  },
  "sameAs": [
    "{facebook_url}",
    "{instagram_url}",
    "{linkedin_url}"
  ]
}
```

### 8. Security & Performance

#### Security Features:
- ✓ RLS policies enforce org-based access
- ✓ File type validation (images only)
- ✓ File size limits (10MB max)
- ✓ Authenticated uploads only
- ✓ XSS protection on user content
- ✓ SQL injection prevention via parameterized queries

#### Performance Optimizations:
- ✓ Image lazy loading
- ✓ WebP format support
- ✓ CDN via Supabase Storage
- ✓ Indexed database queries
- ✓ Efficient JSONB storage
- ✓ Caching headers on images

### 9. Error Handling

#### Common Errors:

**404 - Not Found**
```json
{
  "error": "Organisasjon ikke funnet",
  "details": "Denne organisasjonen eksisterer ikke eller er ikke aktiv"
}
```

**400 - Bad Request**
```json
{
  "error": "Mangler orgId",
  "details": "URL må inneholde organisasjons-ID"
}
```

**500 - Server Error**
```json
{
  "error": "fetch_org_landing_page",
  "details": "Could not find the table 'public.partner_landing_pages' in the schema cache"
}
```

#### Error Resolution:
- **Table not found:** Run migration `create_partner_landing_pages.sql`
- **Storage not configured:** Run `create_landing_page_storage.sql`
- **RLS policy error:** Check user authentication and org membership
- **Duplicate route error:** Check that endpoints aren't registered multiple times in `index.mjs`

### 10. Testing Checklist

#### Backend API Tests:
- [ ] GET public page returns 404 for unpublished pages
- [ ] GET public page returns data for published pages
- [ ] GET org page requires authentication
- [ ] POST creates new landing page
- [ ] PUT updates existing landing page
- [ ] PATCH publish/unpublish works correctly
- [ ] DELETE removes landing page
- [ ] RLS policies enforce org boundaries
- [ ] File uploads validate size and type
- [ ] Error responses are consistent

#### Frontend Tests:
- [ ] Settings page loads without errors
- [ ] Image upload works with drag-and-drop
- [ ] Preview updates in real-time
- [ ] Save button persists changes
- [ ] Publish toggle works correctly
- [ ] Public page renders all sections
- [ ] Gallery lightbox functions
- [ ] Testimonial carousel works on mobile
- [ ] FAQ accordion expands/collapses
- [ ] Contact map embeds correctly
- [ ] Social media links work
- [ ] Responsive design on all devices

### 11. Deployment Checklist

#### Database:
- [ ] Run `create_partner_landing_pages.sql`
- [ ] Run `create_landing_page_storage.sql`
- [ ] Verify RLS policies are active
- [ ] Seed default pages for existing orgs
- [ ] Create database indexes
- [ ] Configure database backups

#### Storage:
- [ ] Create `landing-pages` bucket
- [ ] Configure public access
- [ ] Set file size limits
- [ ] Test image uploads
- [ ] Configure CDN caching
- [ ] Set CORS policies if needed

#### API:
- [ ] Deploy updated `index.mjs`
- [ ] Deploy `partnerLandingPage.mjs`
- [ ] Configure environment variables
- [ ] Test all endpoints
- [ ] Monitor error logs
- [ ] Set up rate limiting

#### Frontend:
- [ ] Deploy settings page
- [ ] Deploy public landing page
- [ ] Configure routing (`/p/{orgId}`)
- [ ] Test authentication flow
- [ ] Verify image uploads
- [ ] Test on multiple browsers
- [ ] Optimize bundle size
- [ ] Configure analytics

### 12. Maintenance & Monitoring

#### Regular Tasks:
- Monitor storage usage per org
- Review error logs for failures
- Check for unused images (cleanup)
- Monitor page load performance
- Review published pages for quality
- Update default templates
- Optimize database queries
- Clean up unpublished drafts

#### Metrics to Track:
- Number of published landing pages
- Average storage usage per org
- Page load times
- API response times
- Error rates
- User engagement on public pages
- Conversion rates from CTA buttons

### 13. Future Enhancements

#### Phase 2 (Priority):
- [ ] Contact form with email notifications
- [ ] Analytics dashboard for page views
- [ ] A/B testing for different versions
- [ ] Video support (hero background)
- [ ] Multi-language support

#### Phase 3 (Future):
- [ ] Custom domain mapping
- [ ] Template library
- [ ] AI content suggestions
- [ ] Blog/news section
- [ ] Customer portal integration
- [ ] Advanced animations
- [ ] Booking widget integration

### 14. Support & Documentation

#### For Developers:
- See `LANDING_PAGE_IMPROVEMENTS.md` for technical details
- Check API response examples in this document
- Review database schema in SQL files
- Test with Postman/Insomnia collection

#### For Users:
- Create user guide with screenshots
- Video tutorials for editing pages
- Best practices for images and content
- SEO optimization tips
- Contact support for technical issues

---

## Quick Reference

### Database Tables:
- `partner_landing_pages` - Landing page content
- `storage.objects` (bucket: `landing-pages`) - Images

### Key Files:
- `routes/partnerLandingPage.mjs` - API routes
- `create_partner_landing_pages.sql` - Database schema
- `create_landing_page_storage.sql` - Storage configuration

### Important URLs:
- Settings: `/landingsside` or `/settings/landing-page`
- Public page: `/p/{orgId}`
- API base: `/api/orgs/{orgId}/landing-page`

### Common Commands:
```sql
-- Check landing page
SELECT * FROM partner_landing_pages WHERE org_id = '{orgId}';

-- Publish page
UPDATE partner_landing_pages SET is_published = true WHERE org_id = '{orgId}';

-- List images
SELECT * FROM storage.objects WHERE bucket_id = 'landing-pages';
```
