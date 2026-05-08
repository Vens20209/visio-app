"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Check, Download, ImagePlus, Loader2, RotateCcw, Save, Sparkles, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IMPROVEMENT_OPTIONS, STYLE_VIBES, StyleVibe } from "@/lib/visio/options";
import { cn } from "@/lib/utils";

type SavedLook = {
  id: string;
  image: string;
  original: string;
  vibe: string;
  improvements: string[];
  createdAt: string;
  mimeType: string;
};

const loadingSteps = [
  "Reading your style profile…",
  "Preserving your identity…",
  "Upgrading outfit and background…",
  "Building your fresh look…",
];

function dataUrl(base64: string, mimeType = "image/jpeg") {
  return `data:${mimeType};base64,${base64}`;
}

export default function VisioAppPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [vibe, setVibe] = useState<StyleVibe>("Clean & Fresh");
  const [improvements, setImprovements] = useState<string[]>(["Outfit", "Background", "Lighting", "Overall Polish"]);
  const [generated, setGenerated] = useState("");
  const [mimeType, setMimeType] = useState("image/jpeg");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [savedMessage, setSavedMessage] = useState("");
  const [loadingIndex, setLoadingIndex] = useState(0);

  useEffect(() => {
    if (!isGenerating) return;
    const timer = window.setInterval(() => setLoadingIndex((index) => (index + 1) % loadingSteps.length), 1500);
    return () => window.clearInterval(timer);
  }, [isGenerating]);

  const generatedUrl = useMemo(() => (generated ? dataUrl(generated, mimeType) : ""), [generated, mimeType]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    setError("");
    setSavedMessage("");
    setGenerated("");

    if (!selected) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(selected.type)) {
      setError("Please upload a PNG, JPG, JPEG, or WebP image.");
      return;
    }
    if (selected.size > 15 * 1024 * 1024) {
      setError("That photo is too large. Please choose an image under 15MB.");
      return;
    }

    setFile(selected);
    const reader = new FileReader();
    reader.onload = () => setPreview(String(reader.result));
    reader.readAsDataURL(selected);
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

    setIsGenerating(true);
    setLoadingIndex(0);
    setError("");
    setSavedMessage("");

    const body = new FormData();
    body.append("image", file);
    body.append("vibe", vibe);
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

      setGenerated(payload.image);
      setMimeType(payload.mimeType || "image/jpeg");
    } catch (err) {
      setError(err instanceof Error ? err.message : "A network error stopped the generation. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }

  function downloadImage() {
    if (!generatedUrl) return;
    const link = document.createElement("a");
    link.href = generatedUrl;
    link.download = `visio-${vibe.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.jpg`;
    link.click();
  }

  function saveLook() {
    if (!generated || !preview) return;
    const look: SavedLook = {
      id: crypto.randomUUID(),
      image: generatedUrl,
      original: preview,
      vibe,
      improvements,
      createdAt: new Date().toISOString(),
      mimeType,
    };
    const current = JSON.parse(window.localStorage.getItem("visio:saved-looks") || "[]") as SavedLook[];
    window.localStorage.setItem("visio:saved-looks", JSON.stringify([look, ...current]));
    setSavedMessage("Saved locally in this browser.");
  }

  return (
    <div className="space-y-8 pb-12">
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-accent">Visio Studio</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em] md:text-6xl">Generate your upgraded look.</h1>
          <p className="mt-3 max-w-2xl text-muted">Upload a real photo, choose the vibe, and Visio will enhance styling, outfit, background, lighting, and polish while preserving who you are.</p>
        </div>
        <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-muted">No login · Local saves · Real OpenAI edit route</div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="space-y-6">
          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">1. Upload photo</h2>
                <p className="text-sm text-muted">PNG, JPG, JPEG, or WebP under 15MB.</p>
              </div>
              <Upload className="h-5 w-5 text-accent" />
            </div>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex min-h-72 w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-white/20 bg-white/[0.03] text-center transition hover:border-primary/60 hover:bg-primary/5"
            >
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="Uploaded preview" className="h-full max-h-[28rem] w-full object-contain" />
              ) : (
                <div className="space-y-3 p-8">
                  <ImagePlus className="mx-auto h-10 w-10 text-accent" />
                  <p className="font-medium">Click to upload your photo</p>
                  <p className="text-sm text-muted">Choose a clear portrait or outfit photo for best results.</p>
                </div>
              )}
            </button>
            <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleFileChange} />
          </Card>

          <Card className="p-5">
            <h2 className="text-xl font-semibold">2. Choose style vibe</h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {STYLE_VIBES.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setVibe(option)}
                  className={cn(
                    "rounded-2xl border p-3 text-left text-sm transition",
                    vibe === option ? "border-primary bg-primary/20 text-white shadow-glow" : "border-white/10 bg-white/[0.03] text-muted hover:border-primary/40 hover:text-white"
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="text-xl font-semibold">3. Choose improvements</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {IMPROVEMENT_OPTIONS.map((option) => {
                const active = improvements.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleImprovement(option)}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition",
                      active ? "border-accent bg-accent/15 text-white" : "border-white/10 bg-white/[0.03] text-muted hover:text-white"
                    )}
                  >
                    {active ? <Check className="h-4 w-4" /> : <span className="h-4 w-4 rounded-full border border-current" />} {option}
                  </button>
                );
              })}
            </div>
            <Button onClick={generateLook} disabled={isGenerating} className="mt-5 w-full" size="lg">
              {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              {isGenerating ? "Generating…" : "Generate upgraded image"}
            </Button>
            {error && <p className="mt-4 rounded-2xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-100">{error}</p>}
          </Card>
        </div>

        <Card className="min-h-[42rem] p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">Before / After</h2>
              <p className="text-sm text-muted">Your generated image will appear here.</p>
            </div>
            {generated && <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-accent">{vibe}</span>}
          </div>

          {isGenerating ? (
            <div className="flex min-h-[34rem] flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">
              <motion.div animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }} transition={{ repeat: Infinity, duration: 1.8 }} className="mb-6 rounded-full bg-primary/20 p-5 shadow-glow">
                <Sparkles className="h-10 w-10 text-accent" />
              </motion.div>
              <p className="text-2xl font-semibold">{loadingSteps[loadingIndex]}</p>
              <p className="mt-3 max-w-md text-sm leading-6 text-muted">Visio is editing only the styling and presentation layers while preserving identity and recognizability.</p>
            </div>
          ) : generated ? (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted">Before</span>
                  <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview} alt="Before" className="h-[32rem] w-full object-contain" />
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="rounded-full bg-primary/20 px-3 py-1 text-xs uppercase tracking-[0.2em] text-accent">After</span>
                  <div className="overflow-hidden rounded-3xl border border-primary/30 bg-black/20 shadow-glow">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={generatedUrl} alt="Generated upgraded look" className="h-[32rem] w-full object-contain" />
                  </div>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Button onClick={downloadImage} variant="outline"><Download className="mr-2 h-4 w-4" /> Download</Button>
                <Button onClick={saveLook}><Save className="mr-2 h-4 w-4" /> Save Look</Button>
                <Button onClick={() => setGenerated("")} variant="outline"><X className="mr-2 h-4 w-4" /> Try Another Vibe</Button>
                <Button onClick={generateLook} variant="outline"><RotateCcw className="mr-2 h-4 w-4" /> Generate Again</Button>
              </div>
              {savedMessage && <p className="text-sm text-accent">{savedMessage}</p>}
            </motion.div>
          ) : (
            <div className="flex min-h-[34rem] flex-col items-center justify-center rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_50%_10%,rgba(124,120,255,.18),transparent_32%),rgba(255,255,255,.03)] p-8 text-center">
              <Sparkles className="mb-5 h-12 w-12 text-accent" />
              <p className="text-2xl font-semibold">Your premium before/after moment starts here.</p>
              <p className="mt-3 max-w-md text-sm leading-6 text-muted">Upload a photo, pick a vibe, select improvements, then generate a polished identity-preserving style upgrade.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
