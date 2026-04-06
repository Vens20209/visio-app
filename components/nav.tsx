"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  ["/", "Home"],
  ["/onboarding", "Onboarding"],
  ["/analysis", "AI Analysis"],
  ["/dashboard", "Dashboard"],
  ["/try-on", "Try-On"],
  ["/marketplace", "Marketplace"],
  ["/saved", "Saved"],
  ["/auth", "Waitlist"],
] as const;

export function Nav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <Sparkles className="h-5 w-5 text-primary" /> Visio
        </Link>
        <div className="hidden gap-1 md:flex">
          {links.map(([href, label]) => (
            <Link
              className={cn(
                "rounded-lg px-3 py-2 text-sm text-muted transition hover:text-white",
                pathname === href && "bg-white/5 text-white"
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
