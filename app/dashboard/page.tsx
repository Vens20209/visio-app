import Image from "next/image";
import { Heart, Scale, Scissors } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { recommendations, analysisResult } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Personal Recommendations</h1>
      <p className="text-muted">Stop guessing. Start seeing your best look profile.</p>

      <div className="grid gap-4 md:grid-cols-3">
        {recommendations.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="relative h-48 w-full">
              <Image src={item.image} alt={item.title} fill className="object-cover" />
            </div>
            <div className="space-y-3 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-accent">{item.category}</span>
                <span className="text-muted">Fit {item.score}%</span>
              </div>
              <h2 className="font-medium">{item.title}</h2>
              <p className="text-sm text-muted">{item.why}</p>
              <div className="flex gap-2">
                <Button><Heart className="mr-1 h-4 w-4" /> Save</Button>
                <Button variant="outline"><Scale className="mr-1 h-4 w-4" /> Compare</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <h3 className="mb-2 text-lg">Why this works for you</h3>
        <p className="text-sm text-muted">
          Your {analysisResult.faceShape.toLowerCase()} shape and {analysisResult.hairType.toLowerCase()} texture pair best with structured sides,
          controlled volume, and high-contrast neutrals ({analysisResult.bestColors.join(", ")}).
        </p>
        <Button className="mt-4"><Scissors className="mr-1 h-4 w-4" /> Book this style</Button>
      </Card>
    </div>
  );
}
