## Deployment

This project is typically hosted on Vercel (homepage: https://lyxso-app.vercel.app).

Checklist for Vercel:
- Project linked to this GitHub repository and branch.
- Environment variables configured (API keys, NEXT_PUBLIC_*, etc).
- Build command set to: npm run build (or pnpm build) and output as per Next.js.
- Preview deployments enabled for PRs.

Repository maintenance:
- We added CI and scheduled branch pruning workflows to keep branches tidy. See CONTRIBUTING.md for branch rules.
