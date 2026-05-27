export const STYLE_MODES = ["style-me", "try-this-on"] as const;

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

export const STYLE_INTENSITIES = ["Subtle", "Balanced", "Strong"] as const;

export const OCCASION_CHIPS = [
  "Graduation",
  "Wedding",
  "Date",
  "Interview",
  "Party",
  "School",
  "Business",
  "Photoshoot",
  "Vacation",
  "Custom",
] as const;

export type StyleMode = (typeof STYLE_MODES)[number];
export type StyleVibe = (typeof STYLE_VIBES)[number];
export type ImprovementOption = (typeof IMPROVEMENT_OPTIONS)[number];
export type StyleIntensity = (typeof STYLE_INTENSITIES)[number];
export type OccasionChip = (typeof OCCASION_CHIPS)[number];

export function isStyleMode(value: string): value is StyleMode {
  return STYLE_MODES.includes(value as StyleMode);
}

export function isStyleVibe(value: string): value is StyleVibe {
  return STYLE_VIBES.includes(value as StyleVibe);
}

export function isStyleIntensity(value: string): value is StyleIntensity {
  return STYLE_INTENSITIES.includes(value as StyleIntensity);
}

export function normalizeImprovements(values: string[]): ImprovementOption[] {
  return values.filter((value): value is ImprovementOption =>
    IMPROVEMENT_OPTIONS.includes(value as ImprovementOption)
  );
}
