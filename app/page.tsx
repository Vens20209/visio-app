import Link from "next/link";
import { ArrowRight, Camera, Images, ShieldCheck, Sparkles, Wand2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const features = [
  { icon: Wand2, title: "AI outfit upgrade", copy: "Turn an everyday photo into a polished style direction with sharper clothing, cleaner layers, and better color balance." },
  { icon: Camera, title: "Background upgrade", copy: "Swap visual noise for premium studio, city, office, or lifestyle settings that match your selected vibe." },
  { icon: ShieldCheck, title: "Identity-preserving edits", copy: "Visio is prompted to keep your face, structure, skin tone, body shape, age range, and recognizability intact." },
  { icon: Images, title: "Before/after comparison", copy: "Review the original and upgraded image side by side, then download or save your favorite looks locally." },
];

const steps = ["Upload photo", "Choose vibe", "Generate your upgraded look"];

export default function HomePage() {
  return (
    <div className="overflow-hidden pb-12">
      <section className="relative grid min-h-[76vh] items-center gap-10 py-12 md:grid-cols-[1.05fr_0.95fr]">
        <div className="absolute left-1/2 top-10 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
        <div className="space-y-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-accent shadow-glow">
            <Sparkles className="h-4 w-4" /> AI stylist photo transformations
          </div>
          <div className="space-y-4">
            <h1 className="max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.05em] md:text-7xl">
              See your best look before you become it.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted md:text-xl">
              Upload your photo, choose a style vibe, and let Visio generate a fresher, cleaner, more stylish version of you—without replacing who you are.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/app" className={cn(buttonVariants({ size: "lg" }))}>Try Visio <ArrowRight className="ml-2 h-4 w-4" /></Link>
            <Link href="/saved" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>View saved looks</Link>
          </div>
          <p className="text-sm text-muted">Enhance, do not replace. Built for realistic styling, outfit, lighting, and presentation upgrades.</p>
        </div>

        <Card className="relative overflow-hidden p-4 shadow-2xl shadow-primary/10">
          <div className="absolute right-8 top-8 h-32 w-32 rounded-full bg-accent/20 blur-3xl" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-3 rounded-2xl border border-white/10 bg-black/20 p-3">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-muted"><span>Before</span><span>Raw</span></div>
              <div className="h-80 rounded-2xl bg-[radial-gradient(circle_at_50%_28%,rgba(255,255,255,.28),transparent_16%),linear-gradient(145deg,rgba(148,163,184,.28),rgba(15,23,42,.9))]" />
            </div>
            <div className="space-y-3 rounded-2xl border border-primary/30 bg-primary/10 p-3 shadow-glow">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-accent"><span>After</span><span>Visio</span></div>
              <div className="h-80 rounded-2xl bg-[radial-gradient(circle_at_50%_25%,rgba(255,255,255,.5),transparent_14%),radial-gradient(circle_at_45%_55%,rgba(124,120,255,.55),transparent_24%),linear-gradient(145deg,rgba(46,203,255,.3),rgba(9,12,28,.95))]" />
            </div>
          </div>
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-sm text-muted">Selected vibe</p>
            <p className="mt-1 text-xl font-medium">Luxury Casual · Cinematic lighting · Premium neutral layers</p>
          </div>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {features.map((feature) => (
          <Card key={feature.title} className="group p-5 transition duration-300 hover:-translate-y-1 hover:border-primary/40">
            <feature.icon className="mb-4 h-6 w-6 text-accent" />
            <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
            <p className="text-sm leading-6 text-muted">{feature.copy}</p>
          </Card>
        ))}
      </section>

      <section className="mt-16">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-accent">How it works</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">One premium generation flow.</h2>
          </div>
          <Link href="/app" className="hidden text-sm text-accent hover:text-white md:block">Start styling →</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <Card key={step} className="p-6">
              <p className="mb-8 text-sm text-muted">0{index + 1}</p>
              <h3 className="text-2xl font-semibold">{step}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">
                {index === 0 && "Use a clear portrait or full-body photo. Your image stays in the browser until you generate."}
                {index === 1 && "Pick Clean & Fresh, Luxury Casual, Streetwear, Interview Ready, Date Night, and more."}
                {index === 2 && "The server calls OpenAI image editing and returns a base64 result for instant comparison."}
              </p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
