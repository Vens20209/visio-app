"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Download, Sparkles, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import type { ShoppingLink, StylistNotes } from "@/lib/visio/stylist-notes";
import type { StyleIntensity, StyleMode } from "@/lib/visio/options";

type SavedLook = {
  id: string;
  image: string;
  original?: string;
  referenceImage?: string;
  mode?: StyleMode;
  vibe: string;
  improvements: string[];
  intensity?: StyleIntensity;
  occasion?: string;
  styleBrief?: string;
  stylistNotes?: StylistNotes;
  shoppingLinks?: ShoppingLink[];
  createdAt: string;
  mimeType: string;
};

const STORAGE_KEY = "visio:saved-looks";

function modeLabel(mode?: StyleMode) {
  return mode === "try-this-on" ? "Try This On" : "Style Me";
}

export default function SavedLooksPage() {
  const [looks, setLooks] = useState<SavedLook[]>([]);

  useEffect(() => {
    setLooks(JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]") as SavedLook[]);
  }, []);

  function persist(nextLooks: SavedLook[]) {
    setLooks(nextLooks);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextLooks));
  }

  function deleteLook(id: string) {
    persist(looks.filter((look) => look.id !== id));
  }

  function downloadLook(look: SavedLook) {
    const link = document.createElement("a");
    link.href = look.image;
    link.download = `visio-saved-${look.vibe.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.jpg`;
    link.click();
  }

  return (
    <div className="space-y-8 pb-12">
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-accent">Saved locally</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em] md:text-6xl">Your saved looks.</h1>
          <p className="mt-3 max-w-2xl text-muted">
            Saved Visio V2 looks include the image, style mode, occasion, stylist notes, and shopping search links in this browser.
          </p>
        </div>
        <Link href="/app" className={cn(buttonVariants({ size: "lg" }))}><Sparkles className="mr-2 h-4 w-4" /> Create another</Link>
      </section>

      {looks.length === 0 ? (
        <Card className="flex min-h-[28rem] flex-col items-center justify-center p-8 text-center">
          <Sparkles className="mb-5 h-12 w-12 text-accent" />
          <h2 className="text-2xl font-semibold">No saved looks yet.</h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-muted">
            Generate an upgraded image in Visio Studio, then tap Save Look to keep it here locally.
          </p>
          <Link href="/app" className={cn(buttonVariants(), "mt-6")}>Try Visio</Link>
        </Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {looks.map((look) => (
            <Card key={look.id} className="overflow-hidden">
              <div className="grid grid-cols-2 gap-px bg-white/10">
                {look.original && (
                  <div className="aspect-[4/5] bg-black/30">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={look.original} alt={`${look.vibe} original look`} className="h-full w-full object-contain p-1" />
                  </div>
                )}
                <div className={cn("aspect-[4/5] bg-black/30", !look.original && "col-span-2")}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={look.image} alt={`${look.vibe} generated look`} className="h-full w-full object-contain p-1" />
                </div>
              </div>
              <div className="space-y-4 p-4">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-semibold">{look.stylistNotes?.lookName ?? look.vibe}</h2>
                      <p className="mt-1 text-xs text-muted">{modeLabel(look.mode)} · {look.vibe}</p>
                    </div>
                    <span className="shrink-0 text-xs text-muted">{new Date(look.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs text-accent">
                      {look.intensity ?? "Balanced"} intensity
                    </span>
                    {look.occasion && (
                      <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-white">
                        {look.occasion}
                      </span>
                    )}
                    {look.improvements.map((improvement) => (
                      <span key={improvement} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-muted">
                        {improvement}
                      </span>
                    ))}
                  </div>
                </div>

                {look.stylistNotes && (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm text-muted">
                    <p className="text-white">Stylist Notes</p>
                    <p className="mt-2 line-clamp-3">{look.stylistNotes.whyItWorks}</p>
                    <p className="mt-2 text-xs text-accent">Color: {look.stylistNotes.colorDirection}</p>
                  </div>
                )}

                {look.styleBrief && <p className="line-clamp-2 text-xs text-muted">Brief: {look.styleBrief}</p>}

                {look.shoppingLinks && look.shoppingLinks.length > 0 && (
                  <div>
                    <p className="mb-2 text-xs uppercase tracking-[0.2em] text-accent">Shop similar pieces</p>
                    <div className="flex flex-wrap gap-2">
                      {look.shoppingLinks.slice(0, 3).map((link) => (
                        <a key={`${link.provider}-${link.label}`} href={link.url} target="_blank" rel="noreferrer" className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted transition hover:text-white">
                          {link.provider}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={() => downloadLook(look)}><Download className="mr-2 h-4 w-4" /> Download</Button>
                  <Button variant="outline" onClick={() => deleteLook(look.id)}><Trash2 className="mr-2 h-4 w-4" /> Delete</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
