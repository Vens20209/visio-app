"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Download, Sparkles, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

type SavedLook = {
  id: string;
  image: string;
  original: string;
  vibe: string;
  improvements: string[];
  createdAt: string;
  mimeType: string;
};

const STORAGE_KEY = "visio:saved-looks";

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
          <p className="mt-3 max-w-2xl text-muted">Saved looks live in this browser with localStorage. No account or database is used in V1.</p>
        </div>
        <Link href="/app" className={cn(buttonVariants({ size: "lg" }))}><Sparkles className="mr-2 h-4 w-4" /> Create another</Link>
      </section>

      {looks.length === 0 ? (
        <Card className="flex min-h-[28rem] flex-col items-center justify-center p-8 text-center">
          <Sparkles className="mb-5 h-12 w-12 text-accent" />
          <h2 className="text-2xl font-semibold">No saved looks yet.</h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-muted">Generate an upgraded image in Visio Studio, then tap Save Look to keep it here locally.</p>
          <Link href="/app" className={cn(buttonVariants(), "mt-6")}>Try Visio</Link>
        </Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {looks.map((look) => (
            <Card key={look.id} className="overflow-hidden">
              <div className="aspect-[4/5] bg-black/30">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={look.image} alt={`${look.vibe} generated look`} className="h-full w-full object-cover" />
              </div>
              <div className="space-y-4 p-4">
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="font-semibold">{look.vibe}</h2>
                    <span className="text-xs text-muted">{new Date(look.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted">{look.improvements.join(" · ")}</p>
                </div>
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
