"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress";
import { analysisResult } from "@/lib/mock-data";

const checks = ["Face geometry mapping", "Skin tone calibration", "Hair texture scan", "Style compatibility scoring"];

export default function AnalysisPage() {
  const [progress, setProgress] = useState(12);
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => (p >= 100 ? 100 : p + 8));
    }, 180);
    return () => clearInterval(timer);
  }, []);

  const ready = progress >= 100;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h1 className="mb-2 text-3xl font-semibold">AI Analysis Engine</h1>
        <p className="mb-4 text-muted">Simulating biometric + style inference pipeline.</p>
        <ProgressBar value={progress} />
        <p className="mt-2 text-sm text-muted">{ready ? "Analysis complete" : `Processing ${progress}%`}</p>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {checks.map((label, i) => (
          <Card key={label} className="p-4">
            <p className="text-sm text-muted">{label}</p>
            <p className="mt-1 text-lg">{ready ? "Complete" : i * 24 < progress ? "In progress" : "Queued"}</p>
          </Card>
        ))}
      </div>

      {ready && (
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 md:grid-cols-3">
          {Object.entries({
            "Face shape": analysisResult.faceShape,
            "Skin tone": analysisResult.skinTone,
            "Hair type": analysisResult.hairType,
            "Style vibe": analysisResult.vibe,
            "Confidence score": `${analysisResult.confidenceScore}%`,
            "Best cuts": analysisResult.haircutDirection.join(", "),
          }).map(([k, v]) => (
            <Card key={k} className="p-4">
              <p className="text-xs uppercase tracking-widest text-accent">{k}</p>
              <p className="mt-2 text-lg">{v}</p>
            </Card>
          ))}
        </motion.div>
      )}
    </div>
  );
}
