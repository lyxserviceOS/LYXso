# LYXso - Next.js Application

This is a [Next.js](https://nextjs.org) project for the LYXso booking and CRM system.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# API Configuration - REQUIRED
NEXT_PUBLIC_API_BASE_URL=https://lyxso-api.fly.dev

# Organization ID - REQUIRED
NEXT_PUBLIC_ORG_ID=your-org-id-here

# Supabase Configuration - REQUIRED
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Admin Email (for admin checks)
NEXT_PUBLIC_ADMIN_EMAIL=your-admin-email@example.com
```

See `.env.example` for a complete template.

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## API Configuration

All API calls are centralized through `lib/apiConfig.ts`. The application uses a single environment variable `NEXT_PUBLIC_API_BASE_URL` for all backend communication.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
