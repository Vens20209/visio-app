/**
 * Visio — Recipe Library (complete: all 8 vibes)
 * ----------------------------------------------
 * This file is Visio's TASTE. The image model never invents taste on its
 * own — when prompted with adjectives it returns the boring average.
 * These recipes supply specific garments (cut + material), a color story,
 * a point of view, and the photography (lens / light / grade / pose),
 * which is where half of "wow" actually comes from.
 *
 * Every vibe has three intensities:
 *   safe     → Subtle in the UI
 *   balanced → Balanced in the UI
 *   bold     → Strong in the UI
 *
 * To tune a look: edit the garments/palette/pov text. Plain English works.
 */

import type { StyleVibe } from "./options";

export type RecipeIntensity = "safe" | "balanced" | "bold";
export type Presentation = "masc" | "femme" | "neutral";

/** The photography layer. This is where ~half of "wow" actually comes from. */
export interface Photography {
  lens: string;
  light: string;
  grade: string;
  pose: string;
  framing: string;
}

/** A single styled look, written with real specificity. */
export interface OutfitSpec {
  garments: string;
  palette: string;
  pov: string;
}

/** One intensity level of a recipe. Outfits can vary by presentation. */
export interface RecipeLevel {
  outfit: Partial<Record<Presentation, OutfitSpec>>;
  photography: Photography;
}

/** A full recipe: one vibe, three intensities, plus what to strip out. */
export interface Recipe {
  id: string;
  vibe: StyleVibe;
  /** Commit-don't-hedge: items the model must REMOVE so it fully transforms. */
  removeIfPresent: string;
  levels: Record<RecipeIntensity, RecipeLevel>;
}

/* ================================================================== */
/* CLEAN & FRESH                                                       */
/* ================================================================== */

const CLEAN_FRESH: Recipe = {
  id: "clean-fresh",
  vibe: "Clean & Fresh",
  removeIfPresent:
    "Remove anything wrinkled, baggy, heavily logoed, faded, or worn-out. No clutter accessories — keep it pristine.",
  levels: {
    safe: {
      outfit: {
        masc: {
          garments:
            "A crisp white or light-blue oxford shirt with sleeves neatly rolled, slim dark-wash jeans, minimal white leather sneakers.",
          palette: "White, light blue, dark indigo.",
          pov: "Fresh, neat, instantly likable.",
        },
        femme: {
          garments:
            "A crisp white fitted shirt or fine-knit top, high-waisted straight-leg jeans, clean white sneakers, small gold hoops.",
          palette: "White, denim blue, a touch of gold.",
          pov: "Effortless daytime polish.",
        },
      },
      photography: {
        lens: "50mm, f/2.8",
        light: "Bright soft daylight",
        grade: "Airy clean grade, true whites",
        pose: "Relaxed friendly stance",
        framing: "Full-body, eye-level",
      },
    },
    balanced: {
      outfit: {
        masc: {
          garments:
            "A fitted lightweight crew-neck knit in stone or soft sage under an unlined cotton overshirt, tapered chinos in stone or navy, pristine minimal sneakers.",
          palette: "Stone, soft sage, navy, white.",
          pov: "Quietly sharp — the best-dressed person at brunch.",
        },
        femme: {
          garments:
            "A structured cotton poplin shirt half-tucked into wide-leg cream trousers, woven leather flats or clean minimal sneakers, a slim leather belt.",
          palette: "Cream, white, camel.",
          pov: "Light, modern, expensive-simple.",
        },
      },
      photography: {
        lens: "85mm, f/2.0",
        light: "Bright window light, airy and even",
        grade: "Luminous fresh grade, whites kept true",
        pose: "Easy confident stance",
        framing: "Full-body, eye-level, generous negative space",
      },
    },
    bold: {
      outfit: {
        masc: {
          garments:
            "A perfectly cut off-white linen suit over a fresh white crew-neck tee, minimal white leather sneakers with no visible socks, one slim silver watch.",
          palette: "Off-white on white with silver.",
          pov: "Editorial summer-clean — radiant, magazine-fresh.",
        },
        femme: {
          garments:
            "A tailored ivory co-ord — cropped blazer and fluid wide trousers — over a white ribbed tank, strappy minimal sandals, hair styled sleek.",
          palette: "Ivory, white, soft gold.",
          pov: "Crisp editorial minimal-luxe.",
        },
      },
      photography: {
        lens: "85mm, f/1.8",
        light: "High-key studio daylight, soft open shadows",
        grade: "Bright editorial grade, glossy magazine finish",
        pose: "Poised relaxed stance, hint of a smile",
        framing: "Full-body, centered, fashion-catalog cover composition",
      },
    },
  },
};

/* ================================================================== */
/* LUXURY CASUAL                                                       */
/* ================================================================== */

const LUXURY_CASUAL: Recipe = {
  id: "luxury-casual",
  vibe: "Luxury Casual",
  removeIfPresent:
    "Remove athletic wear, flip-flops, loud logos, and anything distressed. Quiet luxury only — no visible branding anywhere.",
  levels: {
    safe: {
      outfit: {
        masc: {
          garments:
            "A fine merino polo in navy or forest green, tailored beige chinos, suede loafers, a leather-strap watch.",
          palette: "Navy, beige, warm brown.",
          pov: "Understated weekend wealth.",
        },
        femme: {
          garments:
            "A fine cashmere crew-neck, tailored cream trousers, leather loafers or ballet flats, a structured tote.",
          palette: "Cream, camel, soft brown.",
          pov: "Polished off-duty.",
        },
      },
      photography: {
        lens: "50mm, f/2.5",
        light: "Soft warm afternoon light",
        grade: "Warm refined grade",
        pose: "Relaxed unhurried stance",
        framing: "Full-body, eye-level",
      },
    },
    balanced: {
      outfit: {
        masc: {
          garments:
            "An unstructured camel or taupe blazer over a fine cream knit, pleated relaxed trousers, suede loafers with no visible socks, a minimal leather bracelet.",
          palette: "Camel, cream, espresso.",
          pov: "Old-money weekend — relaxed tailoring, quiet confidence.",
        },
        femme: {
          garments:
            "A draped silk blouse loosely tucked into high-waisted wide trousers, a fine cashmere cardigan over the shoulders, pointed flats, delicate gold jewelry.",
          palette: "Ivory, taupe, gold.",
          pov: "Riviera quiet luxury.",
        },
      },
      photography: {
        lens: "85mm, f/1.8",
        light: "Golden late-afternoon sun, long soft shadows",
        grade: "Warm tonal grade, slightly filmic",
        pose: "Languid confident stance, one hand in pocket",
        framing: "Full-body, slight low angle, resort-editorial framing",
      },
    },
    bold: {
      outfit: {
        masc: {
          garments:
            "A double-breasted unstructured blazer in soft taupe over a silk-blend tee, fluid pleated trousers, polished leather loafers, vintage-style sunglasses held in one hand.",
          palette: "Tonal taupe and cream with espresso accents.",
          pov: "Lake-Como editorial — louche, expensive, unbothered.",
        },
        femme: {
          garments:
            "A floor-skimming knit column dress with an oversized cashmere coat draped over the shoulders, sleek mules, one bold-but-minimal gold cuff.",
          palette: "Tonal ivory and camel with gold.",
          pov: "Quiet-luxury cover story.",
        },
      },
      photography: {
        lens: "85mm, f/1.4",
        light: "Low golden sun with gentle haze, rich warm rim light",
        grade: "Luxurious filmic grade, creamy highlights",
        pose: "Unhurried mid-stride or a relaxed lean, gaze off-camera",
        framing: "Full-body, cinematic low angle, magazine-cover negative space",
      },
    },
  },
};

/* ================================================================== */
/* STREETWEAR                                                          */
/* ================================================================== */

const STREETWEAR: Recipe = {
  id: "streetwear",
  vibe: "Streetwear",
  removeIfPresent:
    "Remove formal tailoring, dress shoes, and business attire. Keep exactly ONE piece of headwear if specified — never stack a cap under a hood.",
  levels: {
    safe: {
      outfit: {
        neutral: {
          garments:
            "A clean heavyweight hoodie in a solid muted tone, slim tapered joggers, fresh white low-top sneakers.",
          palette: "Soft neutrals — grey and off-white.",
          pov: "Clean and casual, low-key fresh.",
        },
      },
      photography: {
        lens: "50mm, f/2.8",
        light: "Soft daylight",
        grade: "Clean, natural grade",
        pose: "Relaxed casual stance",
        framing: "Full-body, eye-level",
      },
    },
    balanced: {
      outfit: {
        neutral: {
          garments:
            "An oversized premium hoodie in an earthy tone (olive or sand), relaxed tapered cargo trousers, chunky retro sneakers, a small crossbody bag.",
          palette: "Earth tones — olive, sand, cream.",
          pov: "Considered streetwear — relaxed but intentional and fashion-aware.",
        },
      },
      photography: {
        lens: "35mm, f/2.0",
        light: "Overcast diffused daylight, soft and even",
        grade: "Muted matte grade, slightly desaturated",
        pose: "Casual confident stance, hands near pockets",
        framing: "Full-body, slightly low angle, street-style composition",
      },
    },
    bold: {
      outfit: {
        neutral: {
          garments:
            "A technical bomber jacket in a deep tone layered over a longline tee, relaxed wide-leg trousers, bold chunky statement sneakers, ONE cap or beanie (not both), subtle layered chains.",
          palette: "Deep tonal palette — black and charcoal with one muted accent.",
          pov: "Off-duty fashion-week street style — directional, confident, magazine-worthy.",
        },
      },
      photography: {
        lens: "35mm, f/1.8",
        light: "Urban dusk light — warm street lamps with cool shadows, cinematic",
        grade: "Filmic teal-and-amber grade with subtle grain",
        pose: "Dynamic mid-stride, or a strong lean against a wall, looking off-camera",
        framing: "Full-body, low cinematic angle, shallow blurred city background",
      },
    },
  },
};

/* ================================================================== */
/* INTERVIEW READY                                                     */
/* ================================================================== */

const INTERVIEW_READY: Recipe = {
  id: "interview-ready",
  vibe: "Interview Ready",
  removeIfPresent:
    "Remove casual sportswear, heavily branded sneakers, wrinkled items, and busy patterns. Everything pressed and intentional.",
  levels: {
    safe: {
      outfit: {
        masc: {
          garments:
            "A well-fitted navy blazer over a light-blue dress shirt, charcoal trousers, brown leather derby shoes, a slim belt matching the shoes.",
          palette: "Navy, light blue, charcoal, brown.",
          pov: "Trustworthy, prepared, hireable.",
        },
        femme: {
          garments:
            "A tailored navy blazer over an ivory blouse, straight-leg charcoal trousers, low block-heel pumps, minimal stud earrings.",
          palette: "Navy, ivory, charcoal.",
          pov: "Composed and credible.",
        },
      },
      photography: {
        lens: "50mm, f/2.8",
        light: "Even soft office daylight",
        grade: "Clean neutral grade",
        pose: "Upright open posture",
        framing: "Full-body, eye-level",
      },
    },
    balanced: {
      outfit: {
        masc: {
          garments:
            "A modern slim charcoal suit worn with a fine merino crew-neck instead of a shirt and tie, polished black chelsea boots, a slim minimal watch.",
          palette: "Charcoal, black, white.",
          pov: "Professional but current — hire-me-and-I'll-modernize-this-place energy.",
        },
        femme: {
          garments:
            "A sharply tailored deep-navy trouser suit over a fine knit shell, pointed leather flats or low heels, one delicate gold necklace.",
          palette: "Deep navy, cream, gold.",
          pov: "Quietly formidable candidate.",
        },
      },
      photography: {
        lens: "85mm, f/2.0",
        light: "Soft directional window light",
        grade: "Modern corporate-editorial grade",
        pose: "Confident grounded stance, slight forward energy",
        framing: "Full-body, eye-level, modern office softly blurred behind",
      },
    },
    bold: {
      outfit: {
        masc: {
          garments:
            "A sharply tailored midnight-navy suit with peak lapels, crisp white open-collar shirt, polished black loafers, a folded white pocket square.",
          palette: "Midnight navy, crisp white, black.",
          pov: "The candidate they remember — boardroom editorial.",
        },
        femme: {
          garments:
            "A power suit with strong shoulders in deep ink blue over a silk camisole, sleek pointed pumps, a structured leather portfolio held in one hand.",
          palette: "Ink blue, ivory, black.",
          pov: "Future-executive editorial presence.",
        },
      },
      photography: {
        lens: "85mm, f/1.8",
        light: "Controlled studio key light with soft fill",
        grade: "High-end business-magazine grade, crisp contrast",
        pose: "Commanding stance, direct gaze, chin level",
        framing: "Full-body, slight low hero angle, Forbes-cover framing",
      },
    },
  },
};

/* ================================================================== */
/* DATE NIGHT                                                          */
/* ================================================================== */

const DATE_NIGHT: Recipe = {
  id: "date-night",
  vibe: "Date Night",
  removeIfPresent:
    "Remove sportswear, gym clothes, and loungewear. Keep everything refined and intentional.",
  levels: {
    safe: {
      outfit: {
        masc: {
          garments:
            "Dark indigo slim jeans, a well-fitted solid-color button-up shirt, clean leather sneakers or loafers.",
          palette: "Indigo, white, tan.",
          pov: "Simple, neat, approachable.",
        },
        femme: {
          garments:
            "A fitted dark wrap top, well-cut dark jeans or a midi skirt, heeled ankle boots, simple gold jewelry.",
          palette: "Black with gold.",
          pov: "Effortless and pretty.",
        },
      },
      photography: {
        lens: "50mm, f/2.2",
        light: "Warm indoor ambient light",
        grade: "Warm, cozy grade",
        pose: "Relaxed, friendly stance",
        framing: "Full-body, eye-level",
      },
    },
    balanced: {
      outfit: {
        masc: {
          garments:
            "A black overshirt worn open over a fitted tee, slim tailored trousers, suede chelsea boots, a simple watch.",
          palette: "Black, charcoal, tan.",
          pov: "Put-together and confident — a date that means it.",
        },
        femme: {
          garments:
            "A satin slip midi dress in a rich jewel tone, strappy heels, delicate layered jewelry, a small clutch.",
          palette: "A deep jewel tone (emerald or burgundy) with gold.",
          pov: "Elegant and quietly striking.",
        },
      },
      photography: {
        lens: "85mm, f/1.8",
        light: "Warm golden-hour light or soft restaurant glow, intimate",
        grade: "Warm, romantic, filmic grade",
        pose: "Relaxed candid posture, soft natural expression",
        framing: "Full-body, slight low angle, soft bokeh background",
      },
    },
    bold: {
      outfit: {
        masc: {
          garments:
            "A black leather or suede jacket over a fine charcoal knit, tapered black trousers, polished chelsea boots.",
          palette: "All-black with texture contrast.",
          pov: "Magnetic, cinematic, leading-man energy.",
        },
        femme: {
          garments:
            "A sculptural one-shoulder or cut-out cocktail dress in a bold saturated tone, statement heels, one striking piece of jewelry, sleek styling.",
          palette: "One bold color — red, cobalt, or emerald.",
          pov: "Showstopping editorial glamour.",
        },
      },
      photography: {
        lens: "85mm, f/1.4",
        light: "Moody warm key light with deep shadow, candle-lit ambience, cinematic",
        grade: "Rich filmic grade, deep blacks, warm highlights",
        pose: "Confident relaxed lean, direct gaze",
        framing: "Full-body, low hero angle, shallow cinematic depth",
      },
    },
  },
};

/* ================================================================== */
/* CREATIVE ARTIST                                                     */
/* ================================================================== */

const CREATIVE_ARTIST: Recipe = {
  id: "creative-artist",
  vibe: "Creative Artist",
  removeIfPresent:
    "Remove corporate suit-and-tie combinations and generic athleisure. One statement at a time — strip competing loud pieces so a single focal piece leads.",
  levels: {
    safe: {
      outfit: {
        masc: {
          garments:
            "A boxy heavyweight tee in an earthy tone under an open camp-collar shirt with a subtle pattern, relaxed straight trousers, clean canvas sneakers.",
          palette: "Earthy neutrals with one muted accent.",
          pov: "Low-key creative — gallery-assistant cool.",
        },
        femme: {
          garments:
            "A relaxed linen shirt half-tucked into vintage-wash straight jeans, simple leather sandals or sneakers, a single artisanal pendant.",
          palette: "Natural linen, indigo, brass.",
          pov: "Easy artistic warmth.",
        },
      },
      photography: {
        lens: "35mm, f/2.2",
        light: "Soft north-window studio light",
        grade: "Natural film-like grade",
        pose: "Relaxed, unposed stance",
        framing: "Full-body, eye-level, environmental framing",
      },
    },
    balanced: {
      outfit: {
        masc: {
          garments:
            "A textured corduroy or wool overshirt in a rich tone over a fine turtleneck, pleated wide trousers, leather boots, one silver ring.",
          palette: "Rust or olive against charcoal and cream.",
          pov: "Working artist with a sharp eye — texture over logos.",
        },
        femme: {
          garments:
            "A sculptural knit in a saturated tone over wide-leg trousers, flat leather boots, mixed-metal jewelry, hair styled naturally expressive.",
          palette: "One saturated tone (teal or rust) against warm neutrals.",
          pov: "Gallery-opening magnetism.",
        },
      },
      photography: {
        lens: "35mm, f/2.0",
        light: "Directional studio light with painterly shadow",
        grade: "Rich filmic grade, deep tones",
        pose: "Thoughtful at-ease stance, slight head tilt",
        framing: "Full-body, off-center artistic composition, studio or gallery depth",
      },
    },
    bold: {
      outfit: {
        masc: {
          garments:
            "A statement long coat or kimono-cut jacket in a deep saturated tone over monochrome layers, wide cropped trousers, chunky leather boots, one sculptural accessory.",
          palette: "One commanding color against black.",
          pov: "Front-row art-world editorial — unmistakably original.",
        },
        femme: {
          garments:
            "An avant-garde draped or asymmetric dress in a bold print or saturated tone, architectural earrings, sleek boots.",
          palette: "A bold saturated statement grounded in black.",
          pov: "Walking artwork — editorial and fearless.",
        },
      },
      photography: {
        lens: "35mm, f/1.8",
        light: "Dramatic chiaroscuro single-source light",
        grade: "Painterly high-contrast editorial grade with subtle grain",
        pose: "Expressive grounded pose, direct unflinching gaze",
        framing: "Full-body, daring composition, i-D / Dazed magazine energy",
      },
    },
  },
};

/* ================================================================== */
/* MINIMALIST                                                          */
/* ================================================================== */

const MINIMALIST: Recipe = {
  id: "minimalist",
  vibe: "Minimalist",
  removeIfPresent:
    "Remove patterns, logos, busy accessories, and extra layers. Maximum three visible garments plus shoes; one accessory or none.",
  levels: {
    safe: {
      outfit: {
        masc: {
          garments: "A perfectly fitted plain white tee, tapered black trousers, minimal white sneakers.",
          palette: "White and black.",
          pov: "Clean, exact, intentional.",
        },
        femme: {
          garments: "A fitted black fine-knit top, straight-leg ecru trousers, minimal leather flats.",
          palette: "Black and ecru.",
          pov: "Pared-back precision.",
        },
      },
      photography: {
        lens: "50mm, f/2.8",
        light: "Flat soft studio light",
        grade: "Neutral true-tone grade",
        pose: "Still, centered stance",
        framing: "Full-body, dead-center symmetry",
      },
    },
    balanced: {
      outfit: {
        masc: {
          garments:
            "A fine grey merino crew-neck, tailored black wide-leg trousers with a clean break, minimal black leather derbies, no accessories.",
          palette: "Tonal greys and black.",
          pov: "Architectural simplicity — every line deliberate.",
        },
        femme: {
          garments:
            "A single column of one color: a fine knit top and fluid wide trousers in matching bone or slate, sleek minimal mules, one thin band ring.",
          palette: "One tone, head to toe.",
          pov: "Quiet sculptural elegance.",
        },
      },
      photography: {
        lens: "85mm, f/2.2",
        light: "Single soft key light with clean falloff",
        grade: "Muted, monochrome-leaning grade",
        pose: "Composed and still, arms relaxed",
        framing: "Full-body, centered, generous negative space, seamless backdrop",
      },
    },
    bold: {
      outfit: {
        masc: {
          garments:
            "A floor-grazing tailored black overcoat over a black fine turtleneck and black tapered trousers, polished minimal boots — one unbroken line.",
          palette: "All black, matte against subtle sheen.",
          pov: "Severe, striking, gallery-wall minimalism.",
        },
        femme: {
          garments:
            "A sculpted asymmetric top in bone with sharply tailored black trousers, pointed flats, hair pulled back sleek and severe.",
          palette: "Bone and black only.",
          pov: "Editorial restraint — quiet-power campaign energy.",
        },
      },
      photography: {
        lens: "85mm, f/2.0",
        light: "Hard single light with sculpted shadow",
        grade: "Stark high-contrast grade, near-monochrome",
        pose: "Statuesque stillness, direct gaze",
        framing: "Full-body, centered symmetry, vast negative space, campaign-poster framing",
      },
    },
  },
};

/* ================================================================== */
/* CEO / FOUNDER LOOK                                                  */
/* ================================================================== */

const CEO_FOUNDER: Recipe = {
  id: "ceo-founder",
  vibe: "CEO / Founder Look",
  removeIfPresent:
    "Remove any sportswear, hoodies, graphic tees, athletic sneakers, and caps or beanies. Do NOT blend casual sportswear with tailoring.",
  levels: {
    safe: {
      outfit: {
        masc: {
          garments:
            "A navy single-breasted tailored suit with well-fitted shoulders, crisp white dress shirt (no tie), brown leather derby shoes, slim leather belt.",
          palette: "Navy, white, cognac brown.",
          pov: "Polished and conventionally professional.",
        },
        femme: {
          garments:
            "A navy tailored blazer with matching trousers, ivory silk shell top, pointed-toe leather pumps, minimal gold studs.",
          palette: "Navy, ivory, gold.",
          pov: "Sharp, boardroom-ready professional.",
        },
      },
      photography: {
        lens: "50mm, f/2.8, sharp throughout",
        light: "Even, soft studio light",
        grade: "Clean, neutral corporate grade",
        pose: "Straight confident stance, hands relaxed at sides",
        framing: "Full-body, centered, eye-level",
      },
    },
    balanced: {
      outfit: {
        masc: {
          garments:
            "A charcoal tailored suit with a natural shoulder, open-collar crisp white t-shirt (no tie), tan suede chelsea boots, one slim minimalist watch.",
          palette: "Charcoal grey, white, tan.",
          pov: "Modern founder energy — elevated but unstuffy. Not a banker.",
        },
        femme: {
          garments:
            "A tailored charcoal trouser suit over a fine ribbed knit shell, sleek pointed flats, a delicate layered gold necklace.",
          palette: "Charcoal, cream, gold.",
          pov: "Quietly powerful creative-director energy.",
        },
      },
      photography: {
        lens: "85mm, f/1.8",
        light: "Soft window light from camera-left, gentle shadow on the right",
        grade: "Warm editorial grade, slightly filmic",
        pose: "Relaxed confident stance, weight on the back foot, one hand in pocket",
        framing: "Full-body, slight low angle, magazine composition",
      },
    },
    bold: {
      outfit: {
        masc: {
          garments:
            "A monochrome look: an unstructured charcoal blazer over a fine black merino crew-neck, tapered black trousers, premium white leather sneakers, one statement watch.",
          palette: "Charcoal and black with a clean white sneaker contrast.",
          pov: "Tech founder on a magazine cover — confident, minimal, expensive.",
        },
        femme: {
          garments:
            "All-black tailoring: a sharp longline blazer over a black silk camisole, wide-leg black trousers, sleek black leather loafers, one bold minimal gold ring.",
          palette: "All black with a single gold accent.",
          pov: "Editorial power-dressing — fashion-forward executive.",
        },
      },
      photography: {
        lens: "85mm, f/1.4, shallow depth of field",
        light: "Directional side light, dramatic soft shadows, single key light",
        grade: "Moody high-end editorial grade, deep contrast",
        pose: "Strong grounded stance, direct gaze, chin level",
        framing: "Full-body, low hero angle, GQ / Vogue cover framing",
      },
    },
  },
};

/* ================================================================== */
/* Lookup table — exhaustive over every vibe in the UI.                */
/* If a vibe is ever added to options.ts, TypeScript will demand a     */
/* recipe for it here. The taste can never silently fall behind.       */
/* ================================================================== */

export const RECIPES: Record<StyleVibe, Recipe> = {
  "Clean & Fresh": CLEAN_FRESH,
  "Luxury Casual": LUXURY_CASUAL,
  Streetwear: STREETWEAR,
  "Interview Ready": INTERVIEW_READY,
  "Date Night": DATE_NIGHT,
  "Creative Artist": CREATIVE_ARTIST,
  Minimalist: MINIMALIST,
  "CEO / Founder Look": CEO_FOUNDER,
};
