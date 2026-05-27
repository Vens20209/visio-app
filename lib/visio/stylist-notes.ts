import type { ImprovementOption, StyleIntensity, StyleMode, StyleVibe } from "@/lib/visio/options";

export type StylistNotes = {
  lookName: string;
  outfitBreakdown: string[];
  whyItWorks: string;
  whyItFitsOccasion: string;
  colorDirection: string;
  confidenceTip: string;
};

export type ShoppingLink = {
  label: string;
  provider: "Google Shopping" | "Amazon" | "H&M" | "Zara" | "Nike" | "ASOS";
  url: string;
};

type BuildStylistNotesInput = {
  mode: StyleMode;
  vibe: StyleVibe;
  intensity: StyleIntensity;
  occasion?: string;
  styleBrief?: string;
  improvements: string[];
};

const vibePieces: Record<StyleVibe, string[]> = {
  "Clean & Fresh": ["crisp overshirt", "fitted neutral tee", "tailored straight pants", "clean low-profile sneakers", "subtle watch"],
  "Luxury Casual": ["structured knit jacket", "premium neutral tee", "tailored dark trousers", "minimal leather sneakers", "refined accessories"],
  Streetwear: ["premium bomber jacket", "layered heavyweight tee", "relaxed cargo or denim pants", "clean statement sneakers", "simple chain"],
  "Interview Ready": ["unstructured blazer", "clean button-down or knit polo", "pressed chinos", "polished loafers", "minimal belt"],
  "Date Night": ["textured jacket", "fitted dark tee", "slim dark denim", "sleek boots or sneakers", "warm subtle accessories"],
  "Creative Artist": ["expressive overshirt", "artful textured top", "wide-leg or relaxed trousers", "interesting sneakers", "signature accessory"],
  Minimalist: ["clean monochrome overshirt", "plain premium tee", "straight neutral trousers", "minimal sneakers", "simple metal accessory"],
  "CEO / Founder Look": ["sharp smart-casual jacket", "premium knit or tee", "tailored trousers", "clean leather sneakers or loafers", "understated watch"],
};

const colorDirections: Record<StyleVibe, string> = {
  "Clean & Fresh": "fresh neutrals, white, stone, soft navy, and clean contrast",
  "Luxury Casual": "premium neutrals like charcoal, cream, taupe, espresso, and black",
  Streetwear: "grounded dark tones with one confident accent color or sneaker highlight",
  "Interview Ready": "trustworthy navy, charcoal, white, light blue, and warm neutral tones",
  "Date Night": "black, deep navy, rich brown, burgundy, and warm low-light-friendly tones",
  "Creative Artist": "artful neutrals with one expressive color, texture, or pattern moment",
  Minimalist: "monochrome black, white, grey, stone, and soft beige",
  "CEO / Founder Look": "executive neutrals: black, navy, charcoal, cream, and muted steel blue",
};

function titleCase(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function occasionLabel(occasion?: string, styleBrief?: string) {
  const fallback = styleBrief?.match(/graduation|wedding|date|interview|party|school|business|photoshoot|vacation/i)?.[0];
  return titleCase((occasion && occasion !== "Custom" ? occasion : fallback) || "Real-Life");
}

export function buildStylistNotes({ mode, vibe, intensity, occasion, styleBrief, improvements }: BuildStylistNotesInput): StylistNotes {
  const event = occasionLabel(occasion, styleBrief);
  const pieces = vibePieces[vibe];
  const modePhrase = mode === "try-this-on" ? "reference-inspired" : "personalized";
  const polishPhrase = improvements.includes("Lighting") || improvements.includes("Overall Polish") ? "with cleaner lighting and sharper presentation" : "with a natural finish";

  return {
    lookName: `${vibe.replace("CEO / ", "Founder ")} ${event} Fit`,
    outfitBreakdown: pieces,
    whyItWorks: `This ${modePhrase} ${vibe.toLowerCase()} direction adds structure, proportion, and a clearer outfit story ${polishPhrase}. The ${intensity.toLowerCase()} intensity keeps the result stylish while preserving identity and body shape.`,
    whyItFitsOccasion: `For ${event.toLowerCase()}, the look balances confidence and wearability. It reads intentional without feeling like a costume, and it can flex more casual or polished based on the room.`,
    colorDirection: colorDirections[vibe],
    confidenceTip: "Stand tall, keep the first layer clean, and let one detail be the focal point so the outfit feels confident instead of overworked.",
  };
}

function shoppingUrl(provider: ShoppingLink["provider"], query: string) {
  const encoded = encodeURIComponent(query);
  switch (provider) {
    case "Google Shopping":
      return `https://www.google.com/search?tbm=shop&q=${encoded}`;
    case "Amazon":
      return `https://www.amazon.com/s?k=${encoded}`;
    case "H&M":
      return `https://www2.hm.com/en_us/search-results.html?q=${encoded}`;
    case "Zara":
      return `https://www.zara.com/us/en/search?searchTerm=${encoded}`;
    case "Nike":
      return `https://www.nike.com/w?q=${encoded}`;
    case "ASOS":
      return `https://www.asos.com/us/search/?q=${encoded}`;
  }
}

export function buildShoppingLinks(notes: StylistNotes): ShoppingLink[] {
  const primaryPieces = notes.outfitBreakdown.slice(0, 5);
  const providers: ShoppingLink["provider"][] = ["Google Shopping", "Amazon", "H&M", "Zara"];
  const sneakerPiece = primaryPieces.find((piece) => /sneaker|shoe|trainer/i.test(piece));
  const extraProvider: ShoppingLink["provider"] = sneakerPiece ? "Nike" : "ASOS";

  return [...providers.map((provider, index) => ({ provider, label: primaryPieces[index] ?? primaryPieces[0] })), { provider: extraProvider, label: sneakerPiece ?? primaryPieces[0] }].map((link) => ({
    ...link,
    url: shoppingUrl(link.provider, link.label),
  }));
}
