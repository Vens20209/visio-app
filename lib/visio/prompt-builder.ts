import type { ImprovementOption, StyleVibe } from "@/lib/visio/options";

const IDENTITY_RULE =
  "Edit the uploaded photo while preserving the subject’s identity, facial structure, skin tone, body shape, age range, and recognizability. Keep the person clearly the same individual. Do not change their face into a different person. Improve only styling, outfit, background, lighting, and presentation.";

const SAFETY_STYLE_RULE =
  "Keep the final image realistic, natural, tasteful, and premium. Do not make the person thinner, older, younger, a different race, a different skin tone, or a different identity. Avoid extreme face edits, body reshaping, fantasy effects, heavy filters, plastic-looking skin, or celebrity resemblance.";

const VIBE_INSTRUCTIONS: Record<StyleVibe, string> = {
  "Clean & Fresh":
    "Create a clean, fresh everyday upgrade with crisp well-fitted clothing, tidy styling, natural grooming, bright but realistic lighting, and a minimal polished background. The result should feel approachable, confident, and effortless.",
  "Luxury Casual":
    "Upgrade the outfit into a polished luxury casual look with clean modern layering, premium neutral colors, and refined styling. Use a clean upscale background with cinematic lighting. Make the subject look fresh, confident, stylish, and realistic.",
  Streetwear:
    "Upgrade the outfit into modern premium streetwear with clean sneakers, layered pieces, and confident urban styling. Use a polished city or studio background. Keep the result realistic and natural.",
  "Interview Ready":
    "Upgrade the outfit into a professional interview-ready look with clean business casual clothing, neat presentation, and a modern office or studio background. Keep the subject warm, competent, and credible.",
  "Date Night":
    "Create a tasteful date-night upgrade with flattering modern clothing, warm cinematic lighting, refined grooming, and an elegant restaurant, lounge, or softly lit city background. Keep it confident, realistic, and not overly dramatic.",
  "Creative Artist":
    "Upgrade the styling with expressive but wearable creative layers, artful textures, elevated accessories, and a studio or gallery-inspired background. The subject should look original, polished, and naturally confident.",
  Minimalist:
    "Create a minimalist style upgrade with simple premium silhouettes, monochrome or neutral tones, clean lines, uncluttered styling, soft studio lighting, and a calm modern background.",
  "CEO / Founder Look":
    "Upgrade the look into a sharp founder-ready presentation with premium smart casual or tailored pieces, clean grooming, strong but natural posture, cinematic office or studio lighting, and a confident executive presence.",
};

const IMPROVEMENT_INSTRUCTIONS: Record<ImprovementOption, string> = {
  Outfit:
    "Prioritize upgrading clothing fit, layering, fabric quality, color coordination, and accessories while keeping the subject's body shape unchanged.",
  Background:
    "Replace or refine the background into a premium, uncluttered, believable environment that complements the selected vibe.",
  Lighting:
    "Improve lighting with flattering natural or cinematic light while preserving realistic skin texture and skin tone.",
  "Overall Polish":
    "Improve composition, color grading, posture presentation, and editorial polish without making the photo feel fake.",
  "Subtle Grooming":
    "Apply only subtle grooming polish such as neater hair presentation or tidy details; do not alter facial structure or age.",
};

export function buildStylePrompt(vibe: StyleVibe, improvements: ImprovementOption[]) {
  const selectedImprovements =
    improvements.length > 0 ? improvements : ["Outfit", "Background", "Lighting", "Overall Polish"];
  const improvementCopy = selectedImprovements
    .map((item) => `- ${IMPROVEMENT_INSTRUCTIONS[item]}`)
    .join("\n");

  return [
    IDENTITY_RULE,
    VIBE_INSTRUCTIONS[vibe],
    "Focus improvements:",
    improvementCopy,
    SAFETY_STYLE_RULE,
    "Return one polished portrait-friendly image suitable for a premium AI stylist before-and-after comparison.",
  ].join("\n\n");
}
