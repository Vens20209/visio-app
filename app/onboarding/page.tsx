"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";

const goals = ["Look Better", "Dating", "Confidence", "Content Creation", "Everyday Style", "Job Interviews"];
const vibes = ["Clean", "Luxury", "Streetwear", "Soft", "Bold", "Minimalist", "Creative"];
const prefs = ["Hair", "Beard", "Outfits", "Colors"];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);

  const steps = useMemo(() => [
    { title: "Welcome to Visio", body: "In 90 seconds, we’ll map your strongest style direction." },
    { title: "Choose your goals", options: goals },
    { title: "Pick your style vibe", options: vibes },
    { title: "Select preferences", options: prefs },
    { title: "Upload selfie", body: "Use a sharp, front-facing photo for highest analysis quality." },
    { title: "You’re all set", body: "Your AI stylist profile is ready." },
  ], []);

  const current = steps[step];

  return (
    <Card className="mx-auto max-w-2xl p-6">
      <p className="mb-2 text-xs uppercase tracking-[0.2em] text-accent">Onboarding {step + 1}/6</p>
      <h1 className="mb-6 text-3xl font-semibold">{current.title}</h1>
      <motion.div key={step} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        {current.options ? (
          <div className="mb-8 flex flex-wrap gap-2">
            {current.options.map((option) => {
              const active = selected.includes(option);
              return (
                <button
                  key={option}
                  onClick={() =>
                    setSelected((prev) => (active ? prev.filter((x) => x !== option) : [...prev, option]))
                  }
                >
                  <Chip label={option} active={active} />
                </button>
              );
            })}
          </div>
        ) : (
          <div className="mb-8 rounded-xl border border-border bg-card/40 p-8 text-muted">
            {step === 4 ? (
              <div className="flex items-center gap-3"><Upload className="h-5 w-5" /> Use demo photo</div>
            ) : step === 5 ? (
              <div className="flex items-center gap-3 text-white"><CheckCircle2 className="h-5 w-5 text-accent" /> Profile complete.</div>
            ) : (
              current.body
            )}
          </div>
        )}
      </motion.div>
      <div className="flex justify-between">
        <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))}>Back</Button>
        <Button onClick={() => setStep((s) => Math.min(5, s + 1))}>{step === 5 ? "Done" : "Continue"}</Button>
      </div>
    </Card>
  );
}
