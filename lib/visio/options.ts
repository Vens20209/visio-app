export const STYLE_VIBES = [
  "Clean & Fresh",
  "Luxury Casual",
  "Streetwear",
  "Interview Ready",
  "Date Night",
  "Creative Artist",
  "Minimalist",
  "CEO / Founder Look",
] as const;

export const IMPROVEMENT_OPTIONS = ["Outfit", "Background", "Lighting", "Overall Polish", "Subtle Grooming"] as const;

export type StyleVibe = (typeof STYLE_VIBES)[number];
export type ImprovementOption = (typeof IMPROVEMENT_OPTIONS)[number];

export function isStyleVibe(value: string): value is StyleVibe {
  return STYLE_VIBES.includes(value as StyleVibe);
}

export function normalizeImprovements(values: string[]): ImprovementOption[] {
  return values.filter((value): value is ImprovementOption =>
    IMPROVEMENT_OPTIONS.includes(value as ImprovementOption)
  );
}
