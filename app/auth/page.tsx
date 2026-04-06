import { Apple, Chrome } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AuthPage() {
  return (
    <Card className="mx-auto max-w-xl p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-accent">Early Access</p>
      <h1 className="mt-2 text-3xl font-semibold">Join Visio waitlist</h1>
      <p className="mt-2 text-sm text-muted">Be first to unlock AI style analysis and local stylist matching.</p>
      <form className="mt-6 space-y-3">
        <input className="w-full rounded-xl border border-border bg-card/40 px-4 py-3" type="email" placeholder="Email address" />
        <input className="w-full rounded-xl border border-border bg-card/40 px-4 py-3" type="text" placeholder="Full name" />
        <Button className="w-full">Join Waitlist</Button>
      </form>
      <div className="my-4 h-px bg-border" />
      <div className="space-y-2">
        <Button variant="outline" className="w-full"><Chrome className="mr-2 h-4 w-4" /> Continue with Google</Button>
        <Button variant="outline" className="w-full"><Apple className="mr-2 h-4 w-4" /> Continue with Apple</Button>
      </div>
    </Card>
  );
}
