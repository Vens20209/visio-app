import OpenAI, { toFile } from "openai";
import type { ImageEditParamsNonStreaming } from "openai/resources/images";
import { NextResponse } from "next/server";
import { buildStylePrompt } from "@/lib/visio/prompt-builder";
import {
  isStyleIntensity,
  isStyleMode,
  isStyleVibe,
  normalizeImprovements,
  STYLE_INTENSITIES,
  STYLE_MODES,
  STYLE_VIBES,
} from "@/lib/visio/options";

export const runtime = "nodejs";
export const maxDuration = 60;

const ACCEPTED_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);
const MAX_FILE_SIZE = 15 * 1024 * 1024;

function errorResponse(message: string, status = 400, details?: string) {
  return NextResponse.json({ error: message, details }, { status });
}

function friendlyOpenAIError(error: unknown) {
  const details = error instanceof Error ? error.message : "Unknown OpenAI image editing error.";
  const lowerDetails = details.toLowerCase();

  if (lowerDetails.includes("api key") || lowerDetails.includes("authentication")) {
    return {
      message: "Visio could not authenticate with OpenAI. Please check the API key in .env.local.",
      details,
    };
  }

  if (
    lowerDetails.includes("model") ||
    lowerDetails.includes("access") ||
    lowerDetails.includes("verification") ||
    lowerDetails.includes("permission")
  ) {
    return {
      message:
        "Visio could not access the image model. Please confirm your OpenAI account has access and verification for gpt-image-2.",
      details,
    };
  }

  if (lowerDetails.includes("network") || lowerDetails.includes("fetch") || lowerDetails.includes("timeout")) {
    return {
      message: "A network issue interrupted generation. Please try again in a moment.",
      details,
    };
  }

  return {
    message:
      "OpenAI generation failed. This can happen because of image size, model access, image content, or temporary service issues. Please try a clear full-body photo or generate again.",
    details,
  };
}

function validateImageFile(file: FormDataEntryValue | null, label: string) {
  if (!(file instanceof File)) {
    return { error: `${label} is required.` };
  }

  if (!ACCEPTED_TYPES.has(file.type)) {
    return { error: `${label} must be a PNG, JPG, JPEG, or WebP image.` };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { error: `${label} is too large. Please upload an image under 15MB.` };
  }

  return { file };
}

function cleanText(value: FormDataEntryValue | null) {
  return String(value ?? "").replace(/\s+/g, " ").trim().slice(0, 900);
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

  const imageResult = validateImageFile(formData.get("image"), "User photo");
  const referenceImageValue = formData.get("referenceImage");
  const modeValue = String(formData.get("mode") ?? STYLE_MODES[0]);
  const vibeValue = String(formData.get("vibe") ?? STYLE_VIBES[0]);
  const intensityValue = String(formData.get("intensity") ?? STYLE_INTENSITIES[1]);
  const occasion = cleanText(formData.get("occasion"));
  const styleBrief = cleanText(formData.get("styleBrief"));
  const improvementValues = formData.getAll("improvements").map(String);

  if (imageResult.error || !imageResult.file) {
    return errorResponse(imageResult.error ?? "Upload a photo first so Visio can style the real you.");
  }

  if (!isStyleMode(modeValue)) {
    return errorResponse("Choose a valid Visio style mode.");
  }

  if (!isStyleVibe(vibeValue)) {
    return errorResponse("Choose a valid Visio style vibe.");
  }

  if (!isStyleIntensity(intensityValue)) {
    return errorResponse("Choose a valid style intensity: Subtle, Balanced, or Strong.");
  }

  let referenceImage: File | undefined;
  if (referenceImageValue instanceof File && referenceImageValue.size > 0) {
    const referenceResult = validateImageFile(referenceImageValue, "Outfit inspiration image");
    if (referenceResult.error || !referenceResult.file) {
      return errorResponse(referenceResult.error ?? "Upload a valid outfit inspiration image.");
    }
    referenceImage = referenceResult.file;
  }

  if (modeValue === "try-this-on" && !referenceImage) {
    return errorResponse("Upload an outfit inspiration image so Visio can try that style on you.");
  }

  const improvements = normalizeImprovements(improvementValues);
  const prompt = buildStylePrompt({
    mode: modeValue,
    vibe: vibeValue,
    improvements,
    intensity: intensityValue,
    occasion,
    styleBrief,
    hasReferenceImage: Boolean(referenceImage),
  });

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const userImageFile = await toFile(Buffer.from(await imageResult.file.arrayBuffer()), imageResult.file.name || "visio-user.jpg", {
      type: imageResult.file.type,
    });
    const editImages = [userImageFile];

    if (referenceImage) {
      const referenceFile = await toFile(Buffer.from(await referenceImage.arrayBuffer()), referenceImage.name || "visio-reference.jpg", {
        type: referenceImage.type,
      });
      editImages.push(referenceFile);
    }

    const editParams: ImageEditParamsNonStreaming = {
      model: "gpt-image-2",
      image: editImages.length > 1 ? editImages : editImages[0],
      prompt,
      n: 1,
      size: "1024x1536",
      quality: "medium",
      output_format: "jpeg",
      stream: false,
    };

    const response = await client.images.edit(editParams);

    const base64 = response.data?.[0]?.b64_json;

    if (!base64) {
      return errorResponse("Visio did not receive an image back. Please try generating again.", 502);
    }

    return NextResponse.json({
      image: base64,
      mimeType: "image/jpeg",
      mode: modeValue,
      vibe: vibeValue,
      improvements,
      intensity: intensityValue,
      occasion,
      styleBrief,
      usedReferenceImage: Boolean(referenceImage),
    });
  } catch (error) {
    const { message, details } = friendlyOpenAIError(error);
    console.error("Visio generation failed", error);
    return errorResponse(message, 502, details);
  }
}
