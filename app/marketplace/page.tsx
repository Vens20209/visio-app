"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { MapPin, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { stylists } from "@/lib/mock-data";

const filters = ["All", "Fades", "Beard", "Luxury", "Styling"];

export default function MarketplacePage() {
  const [active, setActive] = useState("All");
  const visible = useMemo(() => (active === "All" ? stylists : stylists.filter((s) => s.specialty.toLowerCase().includes(active.toLowerCase()))), [active]);

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-semibold">Barber & Stylist Marketplace</h1>
      <div className="flex flex-wrap gap-2">{filters.map((f) => <button key={f} onClick={() => setActive(f)}><Chip label={f} active={active === f} /></button>)}</div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((s) => (
          <Card key={s.id} className="overflow-hidden">
            <div className="relative h-44">
              <Image src={s.image} alt={s.name} fill className="object-cover" />
            </div>
            <div className="space-y-2 p-4">
              <h2 className="font-medium">{s.name}</h2>
              <p className="text-sm text-muted">{s.specialty}</p>
              <p className="flex items-center gap-1 text-sm"><Star className="h-4 w-4 text-accent" /> {s.rating} • {s.price}</p>
              <p className="flex items-center gap-1 text-sm text-muted"><MapPin className="h-4 w-4" /> {s.distance}</p>
              <Button className="mt-2 w-full">Book</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
