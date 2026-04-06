import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, Wand2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { testimonials } from "@/lib/mock-data";

export default function HomePage() {
  return (
    <div className="space-y-12 pb-10">
      <section className="grid items-center gap-8 py-8 md:grid-cols-2">
        <div className="space-y-5">
          <p className="text-sm uppercase tracking-[0.2em] text-accent">Dress better. Faster.</p>
          <h1 className="text-4xl font-semibold leading-tight md:text-6xl">See your best look before the cut.</h1>
          <p className="max-w-lg text-muted">
            Visio is your AI stylist for hair, fashion, and confidence—built to help you stop guessing and start seeing.
          </p>
          <div className="flex gap-3">
            <Link href="/onboarding"><Button size="lg">Try Demo</Button></Link>
            <Link href="/auth"><Button variant="outline" size="lg">Join Waitlist</Button></Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              "AI face scan",
              "Personal style map",
              "Before/after preview",
              "Book nearby stylists"
            ].map((item) => (
              <Chip key={item} label={item} />
            ))}
          </div>
        </div>
        <Card className="p-6">
          <p className="mb-4 text-sm text-muted">Live style simulation</p>
          <div className="space-y-4 rounded-xl border border-white/10 p-4">
            <div className="h-56 rounded-xl bg-gradient-to-br from-primary/25 to-accent/20" />
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg border border-white/10 p-3">Face shape: Oval</div>
              <div className="rounded-lg border border-white/10 p-3">Confidence fit: 92%</div>
              <div className="rounded-lg border border-white/10 p-3">Top cut: Precision taper</div>
              <div className="rounded-lg border border-white/10 p-3">Palette: Charcoal + Cream</div>
            </div>
          </div>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[{
          icon: Sparkles,
          title: "Problem",
          copy: "Most people choose styles by trend, not fit."
        }, {
          icon: Wand2,
          title: "Solution",
          copy: "Visio analyzes your features and predicts what works."
        }, {
          icon: ShieldCheck,
          title: "Outcome",
          copy: "Higher confidence before the appointment or event."
        }].map((item) => (
          <Card key={item.title} className="p-5">
            <item.icon className="mb-3 h-5 w-5 text-primary" />
            <h3 className="mb-2 text-lg font-medium">{item.title}</h3>
            <p className="text-sm text-muted">{item.copy}</p>
          </Card>
        ))}
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-semibold">How it works</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {["Upload selfie", "AI style analysis", "Get your personalized playbook"].map((step, i) => (
            <Card key={step} className="p-5">
              <p className="mb-3 text-xs uppercase tracking-widest text-accent">Step {i + 1}</p>
              <p>{step}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {testimonials.map((t) => (
          <Card className="p-5" key={t.name}>
            <p className="mb-4 text-sm">“{t.quote}”</p>
            <p className="text-sm text-muted">{t.name}</p>
          </Card>
        ))}
      </section>

      <Card className="flex flex-col items-start justify-between gap-4 p-6 md:flex-row md:items-center">
        <div>
          <h3 className="text-xl font-semibold">Join the Visio waitlist</h3>
          <p className="text-sm text-muted">Get early access to AI style scoring and stylist marketplace drops.</p>
        </div>
        <Link href="/auth"><Button>Join Waitlist <ArrowRight className="ml-1 h-4 w-4" /></Button></Link>
      </Card>

      <footer className="border-t border-border/70 py-6 text-sm text-muted">
        © 2026 Visio. Your best look, powered by AI.
      </footer>
    </div>
  );
}
