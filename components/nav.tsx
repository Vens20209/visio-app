"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  ["/", "Home"],
  ["/app", "Try Visio"],
  ["/saved", "Saved"],
] as const;

export function Nav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/20 shadow-glow">
            <Sparkles className="h-4 w-4 text-accent" />
          </span>
          Visio
        </Link>
        <div className="flex gap-1">
          {links.map(([href, label]) => (
            <Link
              className={cn(
                "rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-white/5 hover:text-white",
                pathname === href && "bg-white/10 text-white"
              )}
              key={href}
              href={href}
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
