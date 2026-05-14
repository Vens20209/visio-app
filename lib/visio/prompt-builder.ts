import type { ImprovementOption, StyleIntensity, StyleMode, StyleVibe } from "@/lib/visio/options";

type BuildStylePromptInput = {
  mode: StyleMode;
  vibe: StyleVibe;
  improvements: ImprovementOption[];
  intensity: StyleIntensity;
  occasion?: string;
  styleBrief?: string;
  hasReferenceImage?: boolean;
};

const IDENTITY_RULE =
  "Enhance, do not replace. Keep the person clearly the same individual. Edit the uploaded user photo while preserving the subject’s identity, facial structure, skin tone, body shape, age range, and recognizability.";

const MODE_INSTRUCTIONS: Record<StyleMode, string> = {
  "style-me":
    "Mode: Style Me. Use the user's occasion and style brief to create a personalized outfit direction that fits the real-life moment. Improve styling, outfit, background, lighting, and presentation while keeping the user recognizable.",
  "try-this-on":
    "Mode: Try This On. Use the reference outfit image as style inspiration. Apply the clothing style, color direction, textures, and overall fashion concept from the reference image to the user’s photo while preserving the user’s identity and body shape. Do not copy the reference person’s face, body, pose, or identity. Only transfer the outfit/style direction.",
};

const REFERENCE_RULE =
  "Reference outfit rule: treat the second uploaded image only as clothing and styling inspiration. Transfer outfit concept, colors, materials, layering, and accessories when appropriate. Never transfer the reference person's identity, face, body, or pose.";

const SAFETY_STYLE_RULE =
  "Strict anti-identity-change rules: do not change the person's race, skin tone, face structure, age range, body shape, height, weight, or core recognizable features. Do not make the person thinner, older, younger, or a different person. Avoid extreme face edits, body reshaping, fantasy effects, plastic-looking skin, and celebrity resemblance.";

const INTENSITY_INSTRUCTIONS: Record<StyleIntensity, string> = {
  Subtle:
    "Make only subtle realistic improvements. Keep clothing, body shape, face, skin tone, and identity extremely close to the original. Upgrade presentation without dramatic changes.",
  Balanced:
    "Create a clear but realistic style upgrade. Improve outfit, background, lighting, and polish while keeping the person unmistakably the same.",
  Strong:
    "Create a more elevated editorial-style transformation with stronger fashion direction and cinematic presentation, but still preserve identity, face structure, skin tone, body shape, age range, and recognizability.",
};

const VIBE_INSTRUCTIONS: Record<StyleVibe, string> = {
  "Clean & Fresh":
    "Create a clean, fresh upgrade with crisp well-fitted clothing, tidy styling, natural grooming, bright but realistic lighting, and a minimal polished background.",
  "Luxury Casual":
    "Upgrade the outfit into a polished luxury casual look with clean modern layering, premium neutral colors, refined styling, an upscale background, and cinematic but believable lighting.",
  Streetwear:
    "Upgrade the outfit into modern premium streetwear with clean sneakers, layered pieces, and confident urban styling. Use a polished city or studio background.",
  "Interview Ready":
    "Upgrade the outfit into a professional interview-ready look with clean business casual clothing, neat presentation, and a modern office or studio background.",
  "Date Night":
    "Create a tasteful date-night upgrade with flattering modern clothing, warm cinematic lighting, refined grooming, and an elegant restaurant, lounge, or softly lit city background.",
  "Creative Artist":
    "Upgrade the styling with expressive but wearable creative layers, artful textures, elevated accessories, and a studio or gallery-inspired background.",
  Minimalist:
    "Create a minimalist style upgrade with simple premium silhouettes, monochrome or neutral tones, clean lines, uncluttered styling, soft studio lighting, and a calm modern background.",
  "CEO / Founder Look":
    "Upgrade the look into a sharp founder-ready presentation with premium smart casual or tailored pieces, clean grooming, strong but natural posture, cinematic office or studio lighting, and confident executive presence.",
};

const IMPROVEMENT_INSTRUCTIONS: Record<ImprovementOption, string> = {
  Outfit:
    "Prioritize clothing fit, layering, fabric quality, color coordination, and accessories while keeping the subject's body shape unchanged.",
  Background:
    "Replace or refine the background into a premium, uncluttered, believable environment that supports the occasion and selected vibe.",
  Lighting:
    "Improve lighting with flattering natural or cinematic light while preserving realistic skin texture and skin tone.",
  "Overall Polish":
    "Improve composition, color grading, posture presentation, and editorial polish without making the photo feel fake.",
  "Subtle Grooming":
    "Apply only subtle grooming polish such as neater hair presentation or tidy details; do not alter facial structure or age.",
};

function cleanUserText(value?: string) {
  return value?.replace(/\s+/g, " ").trim().slice(0, 900) || "Not specified.";
}

export function buildStylePrompt({
  mode,
  vibe,
  improvements,
  intensity,
  occasion,
  styleBrief,
  hasReferenceImage = false,
}: BuildStylePromptInput) {
  const selectedImprovements: ImprovementOption[] =
    improvements.length > 0 ? improvements : ["Outfit", "Background", "Lighting", "Overall Polish"];
  const improvementCopy = selectedImprovements
    .map((item) => `- ${IMPROVEMENT_INSTRUCTIONS[item]}`)
    .join("\n");

  return [
    IDENTITY_RULE,
    MODE_INSTRUCTIONS[mode],
    `Occasion: ${cleanUserText(occasion)}`,
    `User style brief: ${cleanUserText(styleBrief)}`,
    `Selected vibe: ${vibe}. ${VIBE_INSTRUCTIONS[vibe]}`,
    "Selected improvements:",
    improvementCopy,
    `Style intensity: ${intensity}. ${INTENSITY_INSTRUCTIONS[intensity]}`,
    hasReferenceImage ? REFERENCE_RULE : "No reference outfit image was provided; create the outfit direction from the user's occasion, style brief, vibe, intensity, and improvements.",
    SAFETY_STYLE_RULE,
    "Keep the final image realistic, natural, tasteful, premium, and full-body or portrait-friendly. Make the outfit readable and suitable for a before-and-after AI stylist comparison.",
  ].join("\n\n");
}
