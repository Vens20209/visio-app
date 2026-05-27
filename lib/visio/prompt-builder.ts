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
  "Enhance, do not replace. Style the same person, not a new person. Keep the person clearly the same individual. The result should make the user say: ‘That’s me, but better.’";

const EXACT_IDENTITY_RULE =
  "Identity preservation is more important than fashion creativity. If there is a conflict, keep the person the same. Preserve the exact same facial identity: same face structure, eyes, nose, lips, jawline, hairline, skin tone, facial hair if present, age range, and recognizability. Do not beautify by changing facial features. Do not make the person look like a different model.";

const IDENTITY_PRIORITY_RULE =
  "Identity preservation is non-negotiable and takes strict priority over fashion creativity. If a styling choice changes the user's unique facial structure, age, ethnicity, skin tone, body shape, or likeness, reject that modification. Maintain the core human element and authentic personal identity above all else.";

const ANTI_MODELIFICATION_RULE =
  "Avoid plastic skin textures, hyper-polished runway symmetry, generic model faces, or influencer-style face replacement. The user must look exactly like themselves on their best styling day. Same person first. Style second.";

const BODY_AND_CAMERA_RULE =
  "Preserve the same body shape, height impression, proportions, natural build, and posture. Preserve expression energy and the person's natural presence. Keep the original pose, facial expression, framing, and camera angle as close as possible unless the user explicitly asks otherwise. Do not change ethnicity, skin tone, age, body type, or facial expression too much.";

const MODE_INSTRUCTIONS: Record<StyleMode, string> = {
  "style-me":
    "Mode: Style Me. Use the user's occasion and style brief to create a personalized outfit direction that fits the real-life moment. Improve outfit, lighting, grooming, and background while keeping the user unmistakably the same person.",
  "try-this-on":
    "Mode: Try This On. Use the reference outfit image as style inspiration. Apply the clothing style, color direction, textures, and overall fashion concept from the reference image to the user's photo while preserving the user's exact facial identity, body shape, natural build, pose, and camera angle. Do not copy the reference person's face, body, pose, proportions, or identity. Only transfer the outfit/style direction.",
};

const REFERENCE_RULE =
  "Reference outfit rule: treat the second uploaded image only as clothing and styling inspiration. Transfer outfit concept, colors, materials, layering, and accessories when appropriate. Never transfer the reference person's identity, face, body, pose, proportions, age, ethnicity, or expression.";

const SAFETY_STYLE_RULE =
  "Strict anti-identity-change rules: preserve the same person, same face identity, same skin tone, same body shape, same age range, and same recognizability. Do not change the person's race, ethnicity, skin tone, face structure, eyes, nose, lips, jawline, hairline, facial expression, age range, body shape, height, weight, or core recognizable features. Do not make the person thinner, older, younger, more conventionally attractive by altering features, or a different person. Avoid extreme face edits, body reshaping, fantasy effects, plastic-looking skin, and celebrity resemblance.";

const INTENSITY_INSTRUCTIONS: Record<StyleIntensity, string> = {
  Subtle:
    "Make only subtle realistic improvements. Keep clothing silhouette, body shape, face, skin tone, facial identity, pose, and camera angle extremely close to the original. Upgrade presentation without dramatic changes.",
  Balanced:
    "Create a clear but realistic style upgrade. Improve outfit, background, lighting, grooming, and polish while keeping the person unmistakably the same, with the same face, body shape, natural build, and age range.",
  Strong:
    "Create a more elevated editorial-style styling upgrade with stronger fashion direction and cinematic presentation, but do not change facial features, body proportions, ethnicity, skin tone, age range, pose, or recognizability. Strong should mean stronger styling, not a different person.",
};

const VIBE_INSTRUCTIONS: Record<StyleVibe, string> = {
  "Clean & Fresh":
    "Create a clean, fresh upgrade with crisp well-fitted clothing, tidy styling, natural grooming, bright but realistic lighting, and a minimal polished background. Keep the original person, face, build, and camera feel intact.",
  "Luxury Casual":
    "Upgrade the outfit into a polished luxury casual look with clean modern layering, premium neutral colors, refined styling, an upscale background, and cinematic but believable lighting. Keep facial identity and body shape unchanged.",
  Streetwear:
    "Upgrade the outfit into modern premium streetwear with clean sneakers, layered pieces, and confident urban styling. Use a polished city or studio background while preserving the original person, pose, and proportions.",
  "Interview Ready":
    "Upgrade the outfit into a professional interview-ready look with clean business casual clothing, neat presentation, and a modern office or studio background. Preserve the person's exact identity, age range, and natural build.",
  "Date Night":
    "Create a tasteful date-night upgrade with flattering modern clothing, warm cinematic lighting, refined grooming, and an elegant restaurant, lounge, or softly lit city background. Do not alter facial features or body shape.",
  "Creative Artist":
    "Upgrade the styling with expressive but wearable creative layers, artful textures, elevated accessories, and a studio or gallery-inspired background. Creativity applies to styling only, not identity.",
  Minimalist:
    "Create a minimalist style upgrade with simple premium silhouettes, monochrome or neutral tones, clean lines, uncluttered styling, soft studio lighting, and a calm modern background. Preserve all recognizable physical traits.",
  "CEO / Founder Look":
    "Upgrade the look into a sharp founder-ready presentation with premium smart casual or tailored pieces, clean grooming, strong but natural posture, cinematic office or studio lighting, and confident executive presence. Keep the same person and natural build.",
};

const IMPROVEMENT_INSTRUCTIONS: Record<ImprovementOption, string> = {
  Outfit:
    "Prioritize clothing fit, layering, fabric quality, color coordination, and accessories while keeping the subject's body shape, height impression, and proportions unchanged.",
  Background:
    "Replace or refine the background into a premium, uncluttered, believable environment that supports the occasion and selected vibe without changing the subject's pose or camera angle unnecessarily.",
  Lighting:
    "Improve lighting with flattering natural or cinematic light while preserving realistic skin texture, skin tone, facial details, and age range.",
  "Overall Polish":
    "Improve composition, color grading, outfit readability, and editorial polish without making the photo feel fake or making the person look like someone else.",
  "Subtle Grooming":
    "Apply only subtle grooming polish such as neater hair presentation or tidy details; do not alter hairline, facial structure, facial features, expression, or age.",
};

const FINAL_QUALITY_RULE =
  "Final quality target: a realistic professional styling upgrade of the same person. Improve outfit, lighting, grooming, and background only. The transformation should look like the original person on their best styled day, not a new person, not a model swap, and not an AI beauty filter.";

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
    EXACT_IDENTITY_RULE,
    IDENTITY_PRIORITY_RULE,
    ANTI_MODELIFICATION_RULE,
    BODY_AND_CAMERA_RULE,
    MODE_INSTRUCTIONS[mode],
    `Occasion: ${cleanUserText(occasion)}`,
    `User style brief: ${cleanUserText(styleBrief)}`,
    `Selected vibe: ${vibe}. ${VIBE_INSTRUCTIONS[vibe]}`,
    "Selected improvements:",
    improvementCopy,
    `Style intensity: ${intensity}. ${INTENSITY_INSTRUCTIONS[intensity]}`,
    hasReferenceImage
      ? REFERENCE_RULE
      : "No reference outfit image was provided; create the outfit direction from the user's occasion, style brief, vibe, intensity, and improvements while preserving identity above all else.",
    SAFETY_STYLE_RULE,
    FINAL_QUALITY_RULE,
    "Keep the final image realistic, natural, tasteful, premium, and full-body or portrait-friendly. Make the outfit readable and suitable for a before-and-after AI stylist comparison while keeping the person unmistakably the same.",
  ].join("\n\n");
}
