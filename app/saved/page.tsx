import { Card } from "@/components/ui/card";
import { recommendations, stylists, analysisResult } from "@/lib/mock-data";

export default function SavedPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Saved Looks</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-5">
          <h2 className="mb-3 text-lg">Saved hairstyles & outfits</h2>
          <ul className="space-y-2 text-sm text-muted">
            {recommendations.map((r) => <li key={r.id}>• {r.title}</li>)}
          </ul>
        </Card>
        <Card className="p-5">
          <h2 className="mb-3 text-lg">Saved stylists</h2>
          <ul className="space-y-2 text-sm text-muted">
            {stylists.map((s) => <li key={s.id}>• {s.name} ({s.distance})</li>)}
          </ul>
        </Card>
      </div>
      <Card className="p-5">
        <h2 className="mb-3 text-lg">Favorite color palettes</h2>
        <div className="flex flex-wrap gap-2 text-sm text-muted">
          {analysisResult.bestColors.map((color) => <span className="rounded-full border border-border px-3 py-1" key={color}>{color}</span>)}
        </div>
      </Card>
    </div>
  );
}
