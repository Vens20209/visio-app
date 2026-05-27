# Visio — AI Stylist MVP

Visio is a real working AI stylist web app for real-life moments. A user uploads a photo, explains where they are going, chooses a style mode/vibe/intensity, optionally uploads outfit inspiration, and Visio calls OpenAI image editing to return a polished upgraded version of the same person.

**Core promise:** Tell Visio where you’re going. We’ll show you what to wear.

**Product rule:** Enhance, do not replace. Visio prompts the model to preserve identity, facial structure, skin tone, body shape, age range, and recognizability while improving outfit, background, lighting, and presentation.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS
- shadcn/ui-style local primitives (`Button`, `Card`, `Chip`)
- Framer Motion
- Lucide React icons
- OpenAI official Node SDK
- Browser `localStorage` for saved looks
- Style modes: Style Me and Try This On
- Occasion/style brief input and reference outfit upload
- Style intensity controls: Subtle, Balanced, and Strong
- Structured stylist notes and shopping search links
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
- `/app` — main Visio stylist assistant and generator flow
- `/saved` — locally saved looks from this browser
- `/api/generate-style` — server-only OpenAI image editing route

## How image generation works

1. The user selects a PNG, JPG/JPEG, or WebP image under 15MB.
2. The browser sends `multipart/form-data` to `POST /api/generate-style` with:
   - `image`
   - optional `referenceImage` for Try This On mode
   - `mode` (`style-me` or `try-this-on`)
   - `vibe`
   - repeated `improvements` fields
   - `intensity` (`Subtle`, `Balanced`, or `Strong`)
   - `occasion`
   - `styleBrief`
3. The server validates the user image, optional reference image, mode, file sizes, vibe, intensity, and API key. Try This On requires `referenceImage`.
4. The server builds a layered identity-preserving prompt in `lib/visio/prompt-builder.ts`, including mode, occasion, style brief, vibe, improvements, intensity, reference outfit guidance, and the rule “Enhance, do not replace.”
5. The server calls the OpenAI Node SDK with `client.images.edit` using:
   - `model: "gpt-image-2"`
   - `size: "1024x1536"`
   - `quality: "medium"`
   - `output_format: "jpeg"`
   - `n: 1`
6. The API returns a base64 JPEG to the frontend.
7. The UI displays the original and generated image side by side, then creates deterministic stylist notes and shopping search links without a second AI call.

## What is real vs mocked

Real:

- Upload flow
- Style mode, occasion brief, vibe, style intensity, and improvement selection
- Server API route
- OpenAI image editing call
- Base64 image result rendering
- Download button
- Local browser saved looks with original image, generated image, optional reference image, mode, vibe, occasion, style brief, improvements, intensity, stylist notes, shopping links, and generation date
- Delete saved look
- Branded “Share your Visio glow-up” before/after card download

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
- Invalid mode, vibe, or intensity values
- OpenAI API errors
- Empty generation results
- Browser/network errors
- Model access or account verification issues
- Missing outfit inspiration image in Try This On mode

## Quality and cost defaults

V1 optimizes for speed and cost by generating one portrait-friendly image per request with medium quality. These settings are centralized in the API route so they are easy to tune later.

## Next steps

- Add authenticated user accounts
- Add server-side history and cloud storage
- Add usage limits and payments
- Replace deterministic stylist notes with an optional GPT text stylist call
- Add iterative editing for “make it more formal / more casual”
- Add image safety and moderation reporting UX
- Add share cards and social export sizes
- Add prompt/version telemetry for quality evaluation
