import { AnalysisResult, StyleRecommendation, Stylist } from "@/lib/types";

export const userDemo = {
  name: "Jordan Lee",
  city: "New York",
  joined: "March 2026",
};

export const analysisResult: AnalysisResult = {
  faceShape: "Oval",
  skinTone: "Neutral medium",
  hairType: "Wavy / thick",
  vibe: "Luxury",
  confidenceScore: 92,
  bestColors: ["Charcoal", "Cream", "Forest", "Navy", "Silver"],
  haircutDirection: ["Taper fade", "Textured top", "Clean lineup"],
};

export const recommendations: StyleRecommendation[] = [
  {
    id: "hair-1",
    title: "Precision taper with textured top",
    category: "Hair",
    score: 96,
    why: "Balances your oval face and complements natural wave volume.",
    image: "https://images.unsplash.com/photo-1593702288056-f9f29bc89f1d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "beard-1",
    title: "Short boxed beard",
    category: "Beard",
    score: 91,
    why: "Defines jawline without adding visual weight to lower face.",
    image: "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "fit-1",
    title: "Smart monochrome layers",
    category: "Outfit",
    score: 94,
    why: "Creates a longer silhouette and keeps focus on face framing.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1200&q=80",
  },
];

export const stylists: Stylist[] = [
  {
    id: "sty-1",
    name: "Maya Ortega Studio",
    specialty: "Luxury fades & editorial grooming",
    rating: 4.9,
    distance: "1.2 mi",
    price: "$65+",
    image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "sty-2",
    name: "Northline Barber Lab",
    specialty: "Textured cuts & beard sculpting",
    rating: 4.8,
    distance: "2.7 mi",
    price: "$50+",
    image: "https://images.unsplash.com/photo-1503951458645-643d53d661c5?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "sty-3",
    name: "Atelier Ninth",
    specialty: "Image consulting & capsule outfits",
    rating: 4.7,
    distance: "3.1 mi",
    price: "$80+",
    image: "https://images.unsplash.com/photo-1520367745676-6c7fc3f4df71?auto=format&fit=crop&w=1200&q=80",
  },
];

export const testimonials = [
  { quote: "Visio made my pre-interview prep effortless. I got compliments day one.", name: "Ariana P." },
  { quote: "Finally a styling app that feels specific to me, not generic trend spam.", name: "Marcus W." },
  { quote: "I used the preview mode before my cut and nailed the look.", name: "Noah T." },
];
