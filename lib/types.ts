export type Goal = "Look Better" | "Dating" | "Confidence" | "Content Creation" | "Everyday Style" | "Job Interviews";
export type StyleVibe = "Clean" | "Luxury" | "Streetwear" | "Soft" | "Bold" | "Minimalist" | "Creative";

export interface AnalysisResult {
  faceShape: string;
  skinTone: string;
  hairType: string;
  vibe: StyleVibe;
  confidenceScore: number;
  bestColors: string[];
  haircutDirection: string[];
}

export interface StyleRecommendation {
  id: string;
  title: string;
  category: "Hair" | "Beard" | "Outfit";
  score: number;
  why: string;
  image: string;
}

export interface Stylist {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  distance: string;
  price: string;
  image: string;
}
