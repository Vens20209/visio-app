"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Check,
  Download,
  ImagePlus,
  Info,
  Loader2,
  RotateCcw,
  Save,
  Share2,
  ShoppingBag,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { buildShoppingLinks, buildStylistNotes } from "@/lib/visio/stylist-notes";
import type { ShoppingLink, StylistNotes } from "@/lib/visio/stylist-notes";
import { IMPROVEMENT_OPTIONS, OCCASION_CHIPS, STYLE_INTENSITIES, STYLE_VIBES } from "@/lib/visio/options";
import type { StyleIntensity, StyleMode, StyleVibe } from "@/lib/visio/options";
import { cn } from "@/lib/utils";
import { getStoredList, setStoredList } from "@/lib/visio/storage";

type SavedLook = {
  id: string;
  image: string;
  original?: string;
  referenceImage?: string;
  mode: StyleMode;
  vibe: string;
  improvements: string[];
  intensity: StyleIntensity;
  occasion: string;
  styleBrief: string;
  stylistNotes: StylistNotes;
  shoppingLinks: ShoppingLink[];
  createdAt: string;
  mimeType: string;
  resultFeedback?: ResultFeedbackOption;
};

type ResultFeedbackOption =
  | "That’s me but better"
  | "Face changed too much"
  | "Outfit not my style"
  | "Make it more realistic"
  | "Make it more stylish";

type FeedbackHistoryEntry = {
  id: string;
  feedback: ResultFeedbackOption;
  createdAt: string;
  mode: StyleMode;
  vibe: StyleVibe;
  intensity: StyleIntensity;
  occasion: string;
  styleBrief: string;
  improvements: string[];
  originalImage?: string;
  generatedImageKey: string;
  generatedImage?: string;
  referenceImage?: string;
};

const RESULT_FEEDBACK_OPTIONS: ResultFeedbackOption[] = [
  "That’s me but better",
  "Face changed too much",
  "Outfit not my style",
  "Make it more realistic",
  "Make it more stylish",
];

const FEEDBACK_HISTORY_KEY = "visio:feedback-history";
const SAVED_LOOKS_KEY = "visio:saved-looks";

const loadingSteps = [
  "Reading your photo...",
  "Preserving your identity...",
  "Upgrading outfit and background...",
  "Improving lighting and polish...",
  "Building your fresh look...",
];

const photoGuideItems = [
  "Clear full-body photo",
  "Good lighting",
  "Face visible",
  "Outfit visible",
  "Stand straight",
  "Avoid blur",
  "Avoid messy background",
  "Avoid extreme camera angle",
];

const modeOptions: Array<{ mode: StyleMode; title: string; description: string }> = [
  {
    mode: "style-me",
    title: "Style Me",
    description: "Tell Visio where you’re going and the look you want. Visio will create a personalized outfit direction.",
  },
  {
    mode: "try-this-on",
    title: "Try This On",
    description: "Upload an outfit screenshot or clothing reference and see how that style could look on you.",
  },
];

const intensityDescriptions: Record<StyleIntensity, string> = {
  Subtle: "Minor outfit/background/polish improvements with maximum identity preservation.",
  Balanced: "A noticeable but realistic upgrade for the best default Visio result.",
  Strong: "More cinematic and stylish, while still preserving identity and body shape.",
};

const occasionPrompts: Record<string, string> = {
  Graduation: "I’m going to a graduation and I want to look clean, confident, and not too formal.",
  Wedding: "I’m going to a wedding and I want to look polished, respectful, and stylish without overdressing.",
  Date: "I have a date night and I want to look stylish but natural.",
  Interview: "I’m going to a job interview and I want to look professional but young.",
  Party: "I’m going to a party and I want to look confident, fresh, and social.",
  School: "I’m going to school and I want to look put together but comfortable.",
  Business: "I have a business event and I want to look credible, modern, and sharp.",
  Photoshoot: "I have a photoshoot and I want a clean editorial look that photographs well.",
  Vacation: "I’m going on vacation and I want to look relaxed, stylish, and effortless.",
  Custom: "",
};

function dataUrl(base64: string, mimeType = "image/jpeg") {
  return `data:${mimeType};base64,${base64}`;
}

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(bytes / 1024, 1).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function friendlyClientError(error: unknown) {
  const message = error instanceof Error ? error.message : "A network issue stopped generation. Please try again.";
  return `${message} Possible reasons: API key issue, model access/verification issue, missing outfit inspiration, image too large, unsupported image type, OpenAI generation failed, or a network issue.`;
}

function readImage(file: File, onLoad: (value: string) => void) {
  const reader = new FileReader();
  reader.onload = () => onLoad(String(reader.result));
  reader.readAsDataURL(file);
}

function loadCanvasImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function storageKeyForImage(image: string) {
  return `${image.length}:${image.slice(0, 96)}:${image.slice(-96)}`;
}

async function createPreviewSafeImage(src: string, maxEdge = 520, quality = 0.72) {
  if (src.length < 220_000) return src;

  try {
    const image = await loadCanvasImage(src);
    const ratio = Math.min(maxEdge / image.width, maxEdge / image.height, 1);
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(Math.round(image.width * ratio), 1);
    canvas.height = Math.max(Math.round(image.height * ratio), 1);
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", quality);
  } catch {
    return undefined;
  }
}

export default function VisioAppPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const referenceInputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [referencePreview, setReferencePreview] = useState("");
  const [mode, setMode] = useState<StyleMode>("style-me");
  const [occasion, setOccasion] = useState("Graduation");
  const [styleBrief, setStyleBrief] = useState(occasionPrompts.Graduation);
  const [vibe, setVibe] = useState<StyleVibe>("Clean & Fresh");
  const [intensity, setIntensity] = useState<StyleIntensity>("Balanced");
  const [improvements, setImprovements] = useState<string[]>(["Outfit", "Background", "Lighting", "Overall Polish"]);
  const [generated, setGenerated] = useState("");
  const [mimeType, setMimeType] = useState("image/jpeg");
  const [stylistNotes, setStylistNotes] = useState<StylistNotes | null>(null);
  const [shoppingLinks, setShoppingLinks] = useState<ShoppingLink[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [savedMessage, setSavedMessage] = useState("");
  const [selectedFeedback, setSelectedFeedback] = useState<ResultFeedbackOption | null>(null);
  const [loadingIndex, setLoadingIndex] = useState(0);

  useEffect(() => {
    if (!isGenerating) return;
    const timer = window.setInterval(() => setLoadingIndex((index) => (index + 1) % loadingSteps.length), 1400);
    return () => window.clearInterval(timer);
  }, [isGenerating]);

  const generatedUrl = useMemo(() => (generated ? dataUrl(generated, mimeType) : ""), [generated, mimeType]);

  useEffect(() => {
    if (!generatedUrl || isGenerating) return;
    const timer = window.setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      resultRef.current?.focus({ preventScroll: true });
    }, 100);
    return () => window.clearTimeout(timer);
  }, [generatedUrl, isGenerating]);

  function clearResult() {
    setGenerated("");
    setStylistNotes(null);
    setShoppingLinks([]);
    setSavedMessage("");
    setSelectedFeedback(null);
  }

  function validateImage(selected: File) {
    if (!["image/png", "image/jpeg", "image/webp"].includes(selected.type)) {
      return "Unsupported image type. Please upload a PNG, JPG, JPEG, or WebP image.";
    }
    if (selected.size > 15 * 1024 * 1024) {
      return "That photo is too large. Please choose an image under 15MB.";
    }
    return "";
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    setError("");
    clearResult();
    if (!selected) return;

    const validationError = validateImage(selected);
    if (validationError) {
      setFile(null);
      setPreview("");
      setError(validationError);
      return;
    }

    setFile(selected);
    readImage(selected, setPreview);
  }

  function handleReferenceFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    setError("");
    clearResult();
    if (!selected) return;

    const validationError = validateImage(selected);
    if (validationError) {
      setReferenceFile(null);
      setReferencePreview("");
      setError(validationError);
      return;
    }

    setReferenceFile(selected);
    readImage(selected, setReferencePreview);
  }

  function selectOccasion(chip: string) {
    setOccasion(chip);
    setStyleBrief(chip === "Custom" ? "" : occasionPrompts[chip] || "");
  }

  function toggleImprovement(option: string) {
    setImprovements((current) =>
      current.includes(option) ? current.filter((item) => item !== option) : [...current, option]
    );
  }

  async function generateLook() {
    if (!file) {
      setError("Upload a photo first so Visio can preserve your identity while upgrading the style.");
      return;
    }
    if (mode === "try-this-on" && !referenceFile) {
      setError("Upload an outfit inspiration image so Visio can try that style on you.");
      return;
    }

    setIsGenerating(true);
    setLoadingIndex(0);
    setError("");
    setSavedMessage("");

    const body = new FormData();
    const latestFeedbackForCurrentLook = await getLatestFeedbackForCurrentLook();
    const feedbackForNextResult = selectedFeedback ?? latestFeedbackForCurrentLook;
    body.append("image", file);
    if (referenceFile) body.append("referenceImage", referenceFile);
    body.append("mode", mode);
    body.append("vibe", vibe);
    body.append("intensity", intensity);
    body.append("occasion", occasion);
    body.append("styleBrief", styleBrief);
    if (feedbackForNextResult) {
      body.append("resultFeedback", feedbackForNextResult);
    }
    improvements.forEach((item) => body.append("improvements", item));

    try {
      const response = await fetch("/api/generate-style", { method: "POST", body });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.error || "Visio could not generate your look. Please try again.");
      }
      if (!payload.image) {
        throw new Error("Visio did not receive an image result. Please generate again.");
      }

      const notes = buildStylistNotes({ mode, vibe, intensity, occasion, styleBrief, improvements });
      setGenerated(payload.image);
      setMimeType(payload.mimeType || "image/jpeg");
      setStylistNotes(notes);
      setShoppingLinks(buildShoppingLinks(notes));
    } catch (err) {
      setError(friendlyClientError(err));
    } finally {
      setIsGenerating(false);
    }
  }

  function downloadImage() {
    if (!generatedUrl) return;
    const link = document.createElement("a");
    link.href = generatedUrl;
    link.download = `visio-${mode}-${vibe.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${intensity.toLowerCase()}.jpg`;
    link.click();
  }

  async function shareGlowUp() {
    if (!preview || !generatedUrl) return;
    try {
      const [before, after] = await Promise.all([loadCanvasImage(preview), loadCanvasImage(generatedUrl)]);
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 1500;
      const ctx = canvas.getContext("2d");
      if (!ctx) return downloadImage();

      ctx.fillStyle = "#070912";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "rgba(124,120,255,0.45)");
      gradient.addColorStop(1, "rgba(46,203,255,0.24)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, 150);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 44px sans-serif";
      ctx.fillText("Visio Glow-Up", 44, 74);
      ctx.font = "24px sans-serif";
      ctx.fillText(`${mode === "try-this-on" ? "Try This On" : "Style Me"} · ${vibe} · ${intensity}`, 44, 115);

      const drawPortrait = (image: HTMLImageElement, x: number, y: number, w: number, h: number) => {
        const radius = 28;
        const ratio = Math.min(w / image.width, h / image.height);
        const dw = image.width * ratio;
        const dh = image.height * ratio;
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, radius);
        ctx.clip();
        ctx.fillStyle = "#050711";
        ctx.fillRect(x, y, w, h);
        ctx.drawImage(image, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
        ctx.restore();
        ctx.strokeStyle = "rgba(255,255,255,0.12)";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, w, h);
      };

      drawPortrait(before, 72, 245, 480, 720);
      drawPortrait(after, 648, 245, 480, 720);
      ctx.fillStyle = "#94a3b8";
      ctx.font = "bold 22px sans-serif";
      ctx.fillText("BEFORE", 72, 220);
      ctx.fillStyle = "#2ecbff";
      ctx.fillText("AFTER", 648, 220);
      ctx.fillStyle = "#ffffff";
      ctx.font = "28px sans-serif";
      ctx.fillText("Share your Visio glow-up", 72, 1045);
      ctx.fillStyle = "#94a3b8";
      ctx.font = "20px sans-serif";
      ctx.fillText("Portrait-friendly before / after by Visio", 72, 1080);

      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/jpeg", 0.9);
      link.download = "visio-glow-up.jpg";
      link.click();
    } catch {
      downloadImage();
    }
  }

  async function saveLook() {
    if (!generated || !preview || !stylistNotes) return;
    const look: SavedLook = {
      id: crypto.randomUUID(),
      image: generatedUrl,
      original: await createPreviewSafeImage(preview),
      referenceImage: referencePreview ? await createPreviewSafeImage(referencePreview) : undefined,
      mode,
      vibe,
      improvements,
      intensity,
      occasion,
      styleBrief,
      stylistNotes,
      shoppingLinks,
      createdAt: new Date().toISOString(),
      mimeType,
      resultFeedback: selectedFeedback || undefined,
    };
    const current = await getStoredList<SavedLook>(SAVED_LOOKS_KEY);
    const saved = await setStoredList(SAVED_LOOKS_KEY, [look, ...current].slice(0, 50));
    setSavedMessage(
      saved
        ? "Saved on this device."
        : "Visio could not save this look on this device. You can still download the image."
    );
  }

  async function getLatestFeedbackForCurrentLook() {
    if (!generatedUrl || !preview) return null;
    const currentKey = storageKeyForImage(generatedUrl);
    const history = await getStoredList<FeedbackHistoryEntry & { generatedImage?: string }>(FEEDBACK_HISTORY_KEY);
    const match = history.find((entry) => entry.generatedImageKey === currentKey || entry.generatedImage === generatedUrl);
    return match?.feedback ?? null;
  }

  async function saveResultFeedback(feedback: ResultFeedbackOption) {
    if (!generatedUrl || !preview) return;
    setSelectedFeedback(feedback);
    const entry: FeedbackHistoryEntry = {
      id: crypto.randomUUID(),
      feedback,
      createdAt: new Date().toISOString(),
      mode,
      vibe,
      intensity,
      occasion,
      styleBrief,
      improvements,
      originalImage: await createPreviewSafeImage(preview),
      generatedImageKey: storageKeyForImage(generatedUrl),
      referenceImage: referencePreview ? await createPreviewSafeImage(referencePreview) : undefined,
    };
    const history = await getStoredList<FeedbackHistoryEntry>(FEEDBACK_HISTORY_KEY);
    const saved = await setStoredList(FEEDBACK_HISTORY_KEY, [entry, ...history].slice(0, 40));
    setSavedMessage(
      saved
        ? "Feedback saved. Visio will use this to improve your next result."
        : "Feedback selected, but it could not be stored. Your next generation will still use it in this session."
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-accent">Visio V2 Stylist Assistant</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em] md:text-6xl">Tell Visio where you’re going.</h1>
          <p className="mt-3 max-w-2xl text-muted">We’ll show you what to wear with an identity-preserving AI style image, stylist notes, and links to shop similar pieces.</p>
        </div>
        <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-muted">No login · Local saves · Real OpenAI edit route</div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <Card className="p-5">
            <h2 className="text-xl font-semibold">1. Choose style mode</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {modeOptions.map((option) => (
                <button
                  key={option.mode}
                  type="button"
                  onClick={() => {
                    setMode(option.mode);
                    clearResult();
                  }}
                  className={cn(
                    "rounded-2xl border p-4 text-left transition",
                    mode === option.mode ? "border-primary bg-primary/20 text-white shadow-glow" : "border-white/10 bg-white/[0.03] text-muted hover:border-primary/40 hover:text-white"
                  )}
                >
                  <span className="font-medium">{option.title}</span>
                  <span className="mt-2 block text-sm leading-6 text-muted">{option.description}</span>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">2. Upload your photo</h2>
                <p className="text-sm text-muted">PNG, JPG, JPEG, or WebP under 15MB.</p>
              </div>
              <Upload className="h-5 w-5 text-accent" />
            </div>
            <button type="button" onClick={() => inputRef.current?.click()} className="flex min-h-72 w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-white/20 bg-white/[0.03] text-center transition hover:border-primary/60 hover:bg-primary/5">
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="Uploaded preview" className="max-h-[34rem] w-full object-contain p-2" />
              ) : (
                <div className="space-y-3 p-8">
                  <ImagePlus className="mx-auto h-10 w-10 text-accent" />
                  <p className="font-medium">Click to upload your photo</p>
                  <p className="text-sm text-muted">Choose a clear full-body outfit photo for best results.</p>
                </div>
              )}
            </button>
            <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleFileChange} />
            {file && (
              <div className="mt-4 rounded-2xl border border-accent/25 bg-accent/10 p-4">
                <div className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 text-accent" />
                  <div className="min-w-0">
                    <p className="font-medium">Photo uploaded.</p>
                    <p className="mt-1 text-sm leading-6 text-muted">For best results, make sure your face and full outfit are clearly visible.</p>
                    <p className="mt-2 truncate text-xs text-accent">{file.name} · {formatFileSize(file.size)}</p>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {mode === "try-this-on" && (
            <Card className="p-5">
              <h2 className="text-xl font-semibold">Upload outfit inspiration</h2>
              <p className="mt-1 text-sm text-muted">Add a screenshot, product photo, or reference outfit. Visio transfers only the outfit direction—not the person.</p>
              <button type="button" onClick={() => referenceInputRef.current?.click()} className="mt-4 flex min-h-56 w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-accent/30 bg-accent/5 text-center transition hover:border-accent hover:bg-accent/10">
                {referencePreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={referencePreview} alt="Outfit inspiration preview" className="max-h-80 w-full object-contain p-2" />
                ) : (
                  <div className="space-y-3 p-8">
                    <ImagePlus className="mx-auto h-10 w-10 text-accent" />
                    <p className="font-medium">Upload outfit inspiration</p>
                    <p className="text-sm text-muted">PNG, JPG, JPEG, or WebP under 15MB.</p>
                  </div>
                )}
              </button>
              <input ref={referenceInputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleReferenceFileChange} />
              {referenceFile && <p className="mt-3 truncate text-xs text-accent">{referenceFile.name} · {formatFileSize(referenceFile.size)}</p>}
            </Card>
          )}

          <Card className="p-5">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              <div>
                <h2 className="text-xl font-semibold">Best photo for Visio</h2>
                <p className="text-sm text-muted">Better photo quality = better Visio results.</p>
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {photoGuideItems.map((item) => (
                <div key={item} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-muted">
                  <Check className="h-4 w-4 shrink-0 text-accent" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="text-xl font-semibold">3. Where are you going?</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {OCCASION_CHIPS.map((chip) => (
                <button key={chip} type="button" onClick={() => selectOccasion(chip)} className={cn("rounded-full border px-3 py-2 text-sm transition", occasion === chip ? "border-primary bg-primary/20 text-white" : "border-white/10 bg-white/[0.03] text-muted hover:text-white")}>{chip}</button>
              ))}
            </div>
            <textarea
              value={styleBrief}
              onChange={(event) => setStyleBrief(event.target.value)}
              rows={5}
              className="mt-4 w-full rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white outline-none transition placeholder:text-muted focus:border-primary/60"
              placeholder={'I’m going to my friend’s graduation and I want to look clean, confident, and not too formal.\nI have a date night and I want to look stylish but natural.\nI’m going to a job interview and I want to look professional but young.'}
            />
          </Card>

          <Card className="p-5">
            <h2 className="text-xl font-semibold">4. Choose style vibe</h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {STYLE_VIBES.map((option) => (
                <button key={option} type="button" onClick={() => setVibe(option)} className={cn("rounded-2xl border p-3 text-left text-sm transition", vibe === option ? "border-primary bg-primary/20 text-white shadow-glow" : "border-white/10 bg-white/[0.03] text-muted hover:border-primary/40 hover:text-white")}>{option}</button>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="text-xl font-semibold">5. Set style intensity</h2>
            <div className="mt-4 grid gap-2">
              {STYLE_INTENSITIES.map((option) => (
                <button key={option} type="button" onClick={() => setIntensity(option)} className={cn("rounded-2xl border p-4 text-left transition", intensity === option ? "border-accent bg-accent/15 text-white" : "border-white/10 bg-white/[0.03] text-muted hover:border-accent/40 hover:text-white")}>
                  <span className="font-medium">{option}</span>
                  <span className="mt-1 block text-sm text-muted">{intensityDescriptions[option]}</span>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="text-xl font-semibold">6. Choose improvements</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {IMPROVEMENT_OPTIONS.map((option) => {
                const active = improvements.includes(option);
                return (
                  <button key={option} type="button" onClick={() => toggleImprovement(option)} className={cn("inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition", active ? "border-accent bg-accent/15 text-white" : "border-white/10 bg-white/[0.03] text-muted hover:text-white")}>
                    {active ? <Check className="h-4 w-4" /> : <span className="h-4 w-4 rounded-full border border-current" />} {option}
                  </button>
                );
              })}
            </div>
            <div className="mt-5 flex items-start gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm text-muted">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <p>Visio works best when your photo is clear, full-body, and well-lit.</p>
            </div>
            <Button onClick={generateLook} disabled={isGenerating} className="mt-4 w-full" size="lg">
              {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              {isGenerating ? "Generating…" : mode === "try-this-on" ? "Try this style on" : "Generate outfit direction"}
            </Button>
            {error && (
              <div className="mt-4 flex items-start gap-3 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}
          </Card>
        </div>

        <Card ref={resultRef} tabIndex={-1} className="scroll-mt-6 p-4 outline-none ring-primary/40 focus-visible:ring-2 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">Before / After</h2>
              <p className="text-sm text-muted">Full-body friendly comparison with aligned image frames.</p>
            </div>
            {generated && <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-accent">{mode === "try-this-on" ? "Try This On" : "Style Me"} · {vibe}</span>}
          </div>

          {isGenerating ? (
            <div className="flex min-h-[34rem] flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">
              <motion.div animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }} transition={{ repeat: Infinity, duration: 1.8 }} className="mb-6 rounded-full bg-primary/20 p-5 shadow-glow"><Sparkles className="h-10 w-10 text-accent" /></motion.div>
              <p className="text-2xl font-semibold">{loadingSteps[loadingIndex]}</p>
              <p className="mt-3 max-w-md text-sm leading-6 text-muted">Visio is building an identity-preserving style direction for your real-life moment.</p>
            </div>
          ) : generated ? (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
              <div className="grid items-stretch gap-4 lg:grid-cols-[0.85fr_1.15fr]">
                <div className="order-2 flex flex-col gap-2 lg:order-1">
                  <span className="w-fit rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted">Before</span>
                  <div className="flex min-h-[28rem] flex-1 items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-black/25 p-2 md:min-h-[36rem]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview} alt="Before" className="max-h-[70vh] w-full object-contain" />
                  </div>
                </div>
                <div className="order-1 flex flex-col gap-2 lg:order-2">
                  <span className="w-fit rounded-full bg-primary/20 px-3 py-1 text-xs uppercase tracking-[0.2em] text-accent">After</span>
                  <div className="flex min-h-[34rem] flex-1 items-center justify-center overflow-hidden rounded-3xl border border-primary/40 bg-black/25 p-2 shadow-glow md:min-h-[44rem]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={generatedUrl} alt="Generated upgraded look" className="max-h-[70vh] w-full object-contain" />
                  </div>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                <Button onClick={downloadImage} variant="outline"><Download className="mr-2 h-4 w-4" /> Download</Button>
                <Button onClick={shareGlowUp} variant="outline"><Share2 className="mr-2 h-4 w-4" /> Share Glow-Up</Button>
                <Button onClick={saveLook}><Save className="mr-2 h-4 w-4" /> Save Look</Button>
                <Button onClick={clearResult} variant="outline"><X className="mr-2 h-4 w-4" /> Try Another Vibe</Button>
                <Button onClick={generateLook} variant="outline"><RotateCcw className="mr-2 h-4 w-4" /> Generate Again</Button>
              </div>
              <p className="text-xs text-muted">Share your Visio glow-up as a branded before/after card.</p>
              {savedMessage && <p className="text-sm text-accent">{savedMessage}</p>}

              <Card className="p-5">
                <h3 className="text-xl font-semibold">Result Feedback</h3>
                <p className="mt-1 text-sm text-muted">Tell Visio how this result felt so your next generation improves.</p>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {RESULT_FEEDBACK_OPTIONS.map((option) => {
                    const active = selectedFeedback === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => saveResultFeedback(option)}
                        className={cn(
                          "rounded-2xl border px-4 py-3 text-left text-sm transition",
                          active
                            ? "border-primary bg-primary/20 text-white shadow-glow"
                            : "border-white/10 bg-white/[0.03] text-muted hover:border-primary/40 hover:text-white"
                        )}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
                {selectedFeedback && <p className="mt-3 text-xs text-accent">Your next generation will use this feedback.</p>}
              </Card>

              {stylistNotes && (
                <Card className="p-5">
                  <h3 className="text-xl font-semibold">Stylist Notes</h3>
                  <p className="mt-1 text-sm text-accent">{stylistNotes.lookName}</p>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="mb-2 text-sm font-medium">Outfit breakdown</p>
                      <ul className="space-y-2 text-sm text-muted">
                        {stylistNotes.outfitBreakdown.map((item) => <li key={item}>• {item}</li>)}
                      </ul>
                    </div>
                    <div className="space-y-3 text-sm text-muted">
                      <p><span className="text-white">Why it works:</span> {stylistNotes.whyItWorks}</p>
                      <p><span className="text-white">Why it fits:</span> {stylistNotes.whyItFitsOccasion}</p>
                      <p><span className="text-white">Color direction:</span> {stylistNotes.colorDirection}</p>
                      <p><span className="text-white">Confidence tip:</span> {stylistNotes.confidenceTip}</p>
                    </div>
                  </div>
                  <div className="mt-5 border-t border-white/10 pt-5">
                    <div className="mb-3 flex items-center gap-2"><ShoppingBag className="h-5 w-5 text-accent" /><h4 className="font-semibold">Shop similar pieces</h4></div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {shoppingLinks.map((link) => (
                        <a key={`${link.provider}-${link.label}`} href={link.url} target="_blank" rel="noreferrer" className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm text-muted transition hover:border-accent/40 hover:text-white">
                          <span className="block text-white">{link.provider}</span>
                          <span>Search: {link.label}</span>
                        </a>
                      ))}
                    </div>
                    <p className="mt-3 text-xs text-muted">These are search links for similar pieces, not exact product matches.</p>
                  </div>
                </Card>
              )}
            </motion.div>
          ) : (
            <div className="flex min-h-[34rem] flex-col items-center justify-center rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_50%_10%,rgba(124,120,255,.18),transparent_32%),rgba(255,255,255,.03)] p-8 text-center">
              <Sparkles className="mb-5 h-12 w-12 text-accent" />
              <p className="text-2xl font-semibold">Your AI stylist is ready.</p>
              <p className="mt-3 max-w-md text-sm leading-6 text-muted">Tell Visio where you’re going. We’ll show you what to wear with an identity-preserving style upgrade and notes to recreate it.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
