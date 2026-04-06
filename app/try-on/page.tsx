"use client";

import { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";

const styles = ["Precision Taper", "Textured Crop", "Classic Side Part"];
const beard = ["No Beard", "Short Boxed", "Stubble"];
const outfits = ["Luxury Minimal", "Street Smart", "Clean Casual"];

export default function TryOnPage() {
  const [hair, setHair] = useState(styles[0]);
  const [facial, setFacial] = useState(beard[1]);
  const [fit, setFit] = useState(outfits[0]);
  const [split, setSplit] = useState(false);

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-semibold">Virtual Try-On Demo</h1>
      <div className="grid gap-4 lg:grid-cols-[1.2fr,1fr]">
        <Card className="p-4">
          <p className="mb-3 text-sm text-muted">User photo</p>
          <div className="relative h-[420px] overflow-hidden rounded-xl border border-white/10">
            <Image
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80"
              alt="demo user"
              fill
              className="object-cover"
            />
            {split && <div className="absolute inset-y-0 left-1/2 w-[2px] bg-white/70" />}
          </div>
        </Card>
        <Card className="space-y-4 p-4">
          <div>
            <p className="mb-2 text-sm text-muted">Hair style</p>
            <div className="flex flex-wrap gap-2">{styles.map((s) => <button key={s} onClick={() => setHair(s)}><Chip label={s} active={hair === s} /></button>)}</div>
          </div>
          <div>
            <p className="mb-2 text-sm text-muted">Beard mode</p>
            <div className="flex flex-wrap gap-2">{beard.map((s) => <button key={s} onClick={() => setFacial(s)}><Chip label={s} active={facial === s} /></button>)}</div>
          </div>
          <div>
            <p className="mb-2 text-sm text-muted">Outfit vibe</p>
            <div className="flex flex-wrap gap-2">{outfits.map((s) => <button key={s} onClick={() => setFit(s)}><Chip label={s} active={fit === s} /></button>)}</div>
          </div>
          <button onClick={() => setSplit((x) => !x)}><Chip label={split ? "Split view on" : "Enable split view"} active={split} /></button>
          <div className="rounded-xl border border-border bg-card/60 p-3 text-sm text-muted">
            Active preview: <span className="text-white">{hair}</span> + <span className="text-white">{facial}</span> + <span className="text-white">{fit}</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
