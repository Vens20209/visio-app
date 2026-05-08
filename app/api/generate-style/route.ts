import OpenAI, { toFile } from "openai";
import { NextResponse } from "next/server";
import { buildStylePrompt } from "@/lib/visio/prompt-builder";
import { isStyleVibe, normalizeImprovements, STYLE_VIBES } from "@/lib/visio/options";

export const runtime = "nodejs";
export const maxDuration = 60;

const ACCEPTED_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);
const MAX_FILE_SIZE = 15 * 1024 * 1024;

function errorResponse(message: string, status = 400, details?: string) {
  return NextResponse.json({ error: message, details }, { status });
}

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return errorResponse(
      "Visio is missing its OpenAI API key. Add OPENAI_API_KEY to .env.local and restart the dev server.",
      500
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return errorResponse("Please upload an image using multipart/form-data.");
  }

  const image = formData.get("image");
  const vibeValue = String(formData.get("vibe") ?? STYLE_VIBES[0]);
  const improvementValues = formData.getAll("improvements").map(String);

  if (!(image instanceof File)) {
    return errorResponse("Upload a photo first so Visio can style the real you.");
  }

  if (!ACCEPTED_TYPES.has(image.type)) {
    return errorResponse("Unsupported image type. Please upload a PNG, JPG, JPEG, or WebP image.");
  }

  if (image.size > MAX_FILE_SIZE) {
    return errorResponse("That image is too large. Please upload a photo under 15MB.");
  }

  if (!isStyleVibe(vibeValue)) {
    return errorResponse("Choose a valid Visio style vibe.");
  }

  const improvements = normalizeImprovements(improvementValues);
  const prompt = buildStylePrompt(vibeValue, improvements);

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const arrayBuffer = await image.arrayBuffer();
    const imageFile = await toFile(Buffer.from(arrayBuffer), image.name || "visio-upload.jpg", {
      type: image.type,
    });

    const response = await client.images.edit({
      model: "gpt-image-2",
      image: imageFile,
      prompt,
      n: 1,
      size: "1024x1536",
      quality: "medium",
      output_format: "jpeg",
    } as Parameters<typeof client.images.edit>[0]);

    const base64 = response.data?.[0]?.b64_json;

    if (!base64) {
      return errorResponse("Visio did not receive an image back. Please try generating again.", 502);
    }

    return NextResponse.json({
      image: base64,
      mimeType: "image/jpeg",
      vibe: vibeValue,
      improvements,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown OpenAI image editing error.";
    console.error("Visio generation failed", error);
    return errorResponse(
      "Visio could not generate your upgraded look. Please try again in a moment.",
      502,
      message
    );
  }
}
