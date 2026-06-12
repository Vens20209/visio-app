/**
 * Visio — Prompt Builder (recipe-driven engine)
 * ---------------------------------------------
 * Same exported interface as before — the API route does not change.
 * What changed is the heart: instead of vague adjectives that produce the
 * model's boring average, every prompt is now composed from a RECIPE
 * (specific garments, color story, point of view) plus a PHOTOGRAPHY layer
 * (lens, light, grade, pose, framing), wrapped in a hard identity lock.
 *
 * The old opener was "Enhance, do not replace." — which is why results
 * kept the original outfit. The new engine replaces the outfit on purpose
 * (when the user selects the Outfit improvement), and preserves the PERSON.
 */

import type { ImprovementOption, StyleIntensity, StyleMode, StyleVibe } from "./options";
import { RECIPES } from "./recipes";
import type { OutfitSpec, Presentation, RecipeIntensity } from "./recipes";

type BuildStylePromptInput = {
  mode: StyleMode;
  vibe: StyleVibe;
  improvements: ImprovementOption[];
  intensity: StyleIntensity;
  occasion?: string;
  styleBrief?: string;
  hasReferenceImage?: boolean;
  resultFeedback?: string;
};

/* ------------------------------------------------------------------ */
/* Constant layers                                                     */
/* ------------------------------------------------------------------ */

const INTENSITY_MAP: Record<StyleIntensity, RecipeIntensity> = {
  Subtle: "safe",
  Balanced: "balanced",
  Strong: "bold",
};

/** The most important block. The person is sacred; the styling is not. */
const IDENTITY_LOCK = `CRITICAL — PRESERVE THE PERSON EXACTLY.
This is an edit of a real photo of a real person. The output MUST be clearly recognizable as the same individual.
- Keep the face, facial features, bone structure, and expression identical.
- Keep the exact skin tone and complexion, and preserve freckles, moles, scars, and tattoos.
- Do not change the person's apparent race, ethnicity, or age. No celebrity resemblance — this must remain this exact person.
- Keep the body EXACTLY as it is: same height, same weight, same body shape, same proportions, same build.
- DO NOT slim, shrink, enlarge, lengthen, reshape, or "idealize" the body in any way.
The goal is the SAME person — more stylishly dressed and beautifully photographed. Changing the face or body is a failed result.`;

const QUALITY_GUARDRAILS = `Render as a single photorealistic photograph.
- Natural, realistic skin texture with visible pores. Never plastic, waxy, airbrushed, or over-smoothed.
- Correct anatomy: exactly five fingers per hand, natural hands and limbs, no extra or missing parts, no warped proportions.
- Clothing fits and drapes realistically with natural folds and accurate fabric behavior.
- No invented text, watermarks, or fake logos on the clothing.
- Sharp, high-resolution, professionally lit. Suitable for a before-and-after AI stylist comparison.`;

const INTENSITY_DIRECTION: Record<RecipeIntensity, string> = {
  safe: `INTENSITY — SUBTLE: A gentle, low-risk upgrade. Stay close to a clean, conventional version of this style. If an original garment already fits the direction well, you may keep and refine it; replace anything that does not. Modest, flattering, universally approachable.`,
  balanced: `INTENSITY — BALANCED: A clear, confident upgrade. Commit fully to the new styling — it should look noticeably elevated and intentional, as if a real stylist dressed them for this exact moment.`,
  bold: `INTENSITY — STRONG: A striking, editorial, magazine-worthy transformation. Be ambitious and fashion-forward. This should make the person say "wow" — commit completely to the bold look while keeping it real and wearable on this exact person.`,
};

const REFERENCE_RULE = `REFERENCE OUTFIT MODE: Treat the second uploaded image only as clothing and styling inspiration. Recreate the outfit concept, colors, materials, layering, and accessories from the reference ON THIS PERSON — fully replacing their current clothing with that direction. Never transfer the reference person's identity, face, body, or pose.`;

const FEEDBACK_RULES: Record<string, string> = {
  "That’s me but better":
    "Feedback applied: That’s me but better. Repeat the same general style direction and preserve the winning formula. Keep identity, body shape, face, age, skin tone, and natural expression unchanged. Improve only polish, fit, lighting, and outfit quality.",
  "Face changed too much":
    "Feedback applied: Face changed too much. Make identity preservation extremely strict. Do not alter face shape, facial proportions, skin tone, age, body structure, or expression. Reduce model-like transformation so the user looks unmistakably like the uploaded person.",
  "Outfit not my style":
    "Feedback applied: Outfit not my style. Avoid the previous outfit direction. Keep the same occasion, but choose a noticeably different silhouette and color story within the recipe's spirit. Do not repeat the previous look.",
  "Make it more realistic":
    "Feedback applied: Make it more realistic. Reduce cinematic fashion-editorial styling. Use natural lighting, realistic clothing fit, believable fabric texture, and normal human proportions. Avoid an over-polished model look.",
  "Make it more stylish":
    "Feedback applied: Make it more stylish. Push the outfit one level more fashion-forward: stronger layering, cleaner color coordination, sharper fit, and tasteful accessories, while preserving identity and realistic body shape.",
};

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function cleanUserText(value?: string) {
  return value?.replace(/\s+/g, " ").trim().slice(0, 900) || "";
}

const PRESENTATION_LABEL: Record<Presentation, string> = {
  masc: "masculine presentation",
  femme: "feminine presentation",
  neutral: "any presentation",
};

function formatOutfit(spec: OutfitSpec) {
  return `  - Pieces: ${spec.garments}\n  - Color story: ${spec.palette}\n  - The energy: ${spec.pov}`;
}

/** Emit the recipe's outfit direction(s), letting the model match the subject. */
function outfitBlock(outfits: Partial<Record<Presentation, OutfitSpec>>) {
  const entries = (Object.entries(outfits) as [Presentation, OutfitSpec][]).filter(
    ([, spec]) => Boolean(spec),
  );
  if (entries.length === 1) {
    return `THE NEW OUTFIT — dress them in this:\n${formatOutfit(entries[0][1])}`;
  }
  const directions = entries
    .map(([presentation, spec]) => `• Direction (${PRESENTATION_LABEL[presentation]}):\n${formatOutfit(spec)}`)
    .join("\n");
  return `THE NEW OUTFIT — two directions follow. Choose exactly ONE: the direction that matches how this person presents in the photo. Never blend the two.\n${directions}`;
}

/* ------------------------------------------------------------------ */
/* Builder                                                             */
/* ------------------------------------------------------------------ */

export function buildStylePrompt({
  mode,
  vibe,
  improvements,
  intensity,
  occasion,
  styleBrief,
  hasReferenceImage = false,
  resultFeedback,
}: BuildStylePromptInput) {
  const selected: ImprovementOption[] =
    improvements.length > 0 ? improvements : ["Outfit", "Background", "Lighting", "Overall Polish"];

  const recipe = RECIPES[vibe];
  const level = recipe.levels[INTENSITY_MAP[intensity]];
  const p = level.photography;

  const wantsOutfit = selected.includes("Outfit");
  const wantsBackground = selected.includes("Background");
  const wantsLighting = selected.includes("Lighting");
  const wantsPolish = selected.includes("Overall Polish");
  const wantsGrooming = selected.includes("Subtle Grooming");

  /* --- The brief: vibe + occasion + the user's own words ----------- */
  const occasionText = cleanUserText(occasion);
  const briefText = cleanUserText(styleBrief);
  const briefLines = [
    `THE BRIEF: Restyle this person in a "${recipe.vibe}" direction.`,
    occasionText
      ? `The occasion: "${occasionText}". Match the formality, mood, and energy to that exact moment.`
      : "No specific occasion was given; style for a flattering everyday moment.",
    briefText ? `Their own words about what they want: "${briefText}". Honor this.` : "",
  ]
    .filter(Boolean)
    .join("\n");

  /* --- The outfit directive ---------------------------------------- */
  let outfitDirective: string;
  if (mode === "try-this-on" && hasReferenceImage) {
    outfitDirective = REFERENCE_RULE;
  } else if (wantsOutfit) {
    outfitDirective = [
      "REPLACE THE ENTIRE CURRENT OUTFIT. Do not keep, recolor, or lightly edit the original clothing — dress this person in the new look below, fitted to their exact body as it is.",
      outfitBlock(level.outfit),
      `COMMIT FULLY — do not hedge or blend old and new styles. ${recipe.removeIfPresent}`,
    ].join("\n\n");
  } else {
    outfitDirective =
      "OUTFIT: The user chose to keep their existing garments. Do not replace the clothing; only improve its fit, condition, and styling details.";
  }

  /* --- Setting / background ----------------------------------------- */
  const settingDirective = wantsBackground
    ? `THE SETTING: Replace the background with a believable, premium environment that fits the occasion and the styling — uncluttered, depth-of-field friendly, never busy.`
    : `THE SETTING: Keep the original background; only tidy distracting elements and refine it subtly.`;

  /* --- Photography --------------------------------------------------- */
  const photoLines = [
    `- Lens: ${p.lens}`,
    wantsLighting ? `- Light: ${p.light}` : `- Light: keep the original photo's natural lighting character, gently refined.`,
    wantsLighting ? `- Color grade: ${p.grade}` : "",
    wantsPolish ? `- Pose: ${p.pose}` : "",
    wantsPolish ? `- Framing: ${p.framing}` : `- Framing: keep a clean full-body composition.`,
  ]
    .filter(Boolean)
    .join("\n");

  /* --- Grooming ------------------------------------------------------ */
  const groomingDirective = wantsGrooming
    ? "GROOMING: You may subtly neaten the current hairstyle and grooming. Never alter facial structure, hairline, or apparent age."
    : "GROOMING: Keep the hair and grooming as they are in the photo.";

  /* --- Feedback ------------------------------------------------------ */
  const feedbackDirective =
    resultFeedback && FEEDBACK_RULES[resultFeedback]
      ? FEEDBACK_RULES[resultFeedback]
      : "";

  return [
    IDENTITY_LOCK,
    briefLines,
    outfitDirective,
    settingDirective,
    INTENSITY_DIRECTION[INTENSITY_MAP[intensity]],
    `PHOTOGRAPHY:\n${photoLines}`,
    groomingDirective,
    feedbackDirective,
    QUALITY_GUARDRAILS,
  ]
    .filter(Boolean)
    .join("\n\n");
}
