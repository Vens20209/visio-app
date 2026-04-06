# Visio MVP Prototype

Visio is a polished startup-demo prototype of an AI personal styling product.

## Stack
- Next.js (App Router) + TypeScript
- Tailwind CSS
- shadcn-style reusable UI primitives
- Framer Motion animations
- Lucide icons
- Mock data only (no backend)

## Run locally
```bash
npm install
npm run dev
```
Open `http://localhost:3000`.

## Main screens
- `/` landing page
- `/onboarding` multi-step setup flow
- `/analysis` simulated AI analysis pipeline
- `/dashboard` personalized recommendations
- `/try-on` virtual try-on simulation
- `/marketplace` nearby stylists marketplace
- `/saved` saved looks and palettes
- `/auth` waitlist + auth placeholder

## File structure
- `app/` route pages and global layout/styles
- `components/` reusable navigation and UI primitives
- `lib/types.ts` domain data types
- `lib/mock-data.ts` realistic demo data used across screens

## What is mocked
- Selfie upload and AI analysis are simulated on the client.
- Recommendations and style score are static demo data.
- Marketplace listings, ratings, and booking are mock interactions.
- Auth and waitlist forms are UI-only.

## Next steps toward production
1. Add real auth (Clerk/Supabase/Auth.js).
2. Implement image upload and secure media storage.
3. Connect an AI styling service for real inference.
4. Build recommendation feedback loops and user profile persistence.
5. Integrate real booking APIs + payments for stylists.
