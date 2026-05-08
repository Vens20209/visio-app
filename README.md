# Visio — AI Stylist MVP

Visio is a real working AI stylist web app. A user uploads a photo, chooses a style vibe, selects what to improve, and Visio calls OpenAI image editing to return a polished upgraded version of the same person.

**Core promise:** Upload your photo. Choose your vibe. See a better version of yourself.

**Product rule:** Enhance, do not replace. Visio prompts the model to preserve identity, facial structure, skin tone, body shape, age range, and recognizability while improving outfit, background, lighting, and presentation.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS
- shadcn/ui-style local primitives (`Button`, `Card`, `Chip`)
- Framer Motion
- Lucide React icons
- OpenAI official Node SDK
- Browser `localStorage` for saved looks
- No login and no database in V1

## Setup

```bash
npm install
```

Create a local environment file:

```bash
cp .env.local.example .env.local
```

Add your OpenAI API key:

```bash
OPENAI_API_KEY=your_real_openai_api_key
```

Run the app locally:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

- `/` — premium landing page
- `/app` — main Visio generator flow
- `/saved` — locally saved looks from this browser
- `/api/generate-style` — server-only OpenAI image editing route

## How image generation works

1. The user selects a PNG, JPG/JPEG, or WebP image under 15MB.
2. The browser sends `multipart/form-data` to `POST /api/generate-style` with:
   - `image`
   - `vibe`
   - repeated `improvements` fields
3. The server validates the image, file size, vibe, and API key.
4. The server builds an identity-preserving prompt in `lib/visio/prompt-builder.ts`.
5. The server calls the OpenAI Node SDK with `client.images.edit` using:
   - `model: "gpt-image-2"`
   - `size: "1024x1536"`
   - `quality: "medium"`
   - `output_format: "jpeg"`
   - `n: 1`
6. The API returns a base64 JPEG to the frontend.
7. The UI displays the original and generated image side by side.

## What is real vs mocked

Real:

- Upload flow
- Style vibe and improvement selection
- Server API route
- OpenAI image editing call
- Base64 image result rendering
- Download button
- Local browser saved looks
- Delete saved look

Not included in V1:

- Login
- Database persistence
- Billing or usage limits
- Cloud image storage
- Multi-image history across devices

## Error handling

Visio returns friendly errors for:

- Missing `OPENAI_API_KEY`
- Missing image
- Unsupported file types
- Files over 15MB
- Invalid vibe values
- OpenAI API errors
- Empty generation results
- Browser/network errors

## Quality and cost defaults

V1 optimizes for speed and cost by generating one portrait-friendly image per request with medium quality. These settings are centralized in the API route so they are easy to tune later.

## Next steps

- Add authenticated user accounts
- Add server-side history and cloud storage
- Add usage limits and payments
- Add iterative editing for “make it more formal / more casual”
- Add image safety and moderation reporting UX
- Add share cards and social export sizes
- Add prompt/version telemetry for quality evaluation
