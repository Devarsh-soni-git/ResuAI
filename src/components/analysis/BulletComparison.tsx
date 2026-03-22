import { useState } from "react";
import { ArrowRight, Copy, Check, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { RewrittenBullet } from "./types";

interface BulletComparisonProps {
  bullets: RewrittenBullet[];
}

export function BulletComparison({ bullets }: BulletComparisonProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const goToPrevious = () => {
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex((prev) => Math.max(0, prev - 1)), 200);
  };

  const goToNext = () => {
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex((prev) => Math.min(bullets.length - 1, prev + 1)), 200);
  };

  if (bullets.length === 0) return null;

  const bullet = bullets[currentIndex];

  return (
    <Card className="p-6 border-0 shadow-soft overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-foreground">
              Before → After Transformation
            </h3>
            <p className="text-sm text-muted-foreground">
              Tap to flip • {currentIndex + 1} of {bullets.length}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className="h-8 w-8"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={goToNext}
            disabled={currentIndex === bullets.length - 1}
            className="h-8 w-8"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Flip Card Container */}
      <div 
        className="relative h-48 cursor-pointer perspective-1000"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div 
          className={`absolute inset-0 transition-transform duration-500 preserve-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          {/* Front - Original */}
          <div 
            className="absolute inset-0 backface-hidden rounded-xl p-5 bg-muted/50 border border-border"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-2 py-1 rounded bg-destructive/10 text-destructive">
                Original
              </span>
            </div>
            <p className="text-foreground leading-relaxed">{bullet.original}</p>
            <p className="text-xs text-muted-foreground mt-4 italic">
              Click to see the improved version →
            </p>
          </div>

          {/* Back - Improved */}
          <div 
            className="absolute inset-0 backface-hidden rounded-xl p-5 bg-gradient-to-br from-success/5 to-accent/5 border border-success/20"
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded bg-success/10 text-success">
                ✨ Improved
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy(bullet.improved, currentIndex);
                }}
                className="h-7 text-xs"
              >
                {copiedIndex === currentIndex ? (
                  <Check className="w-3 h-3 mr-1" />
                ) : (
                  <Copy className="w-3 h-3 mr-1" />
                )}
                Copy
              </Button>
            </div>
            <p className="text-foreground font-medium leading-relaxed">{bullet.improved}</p>
            <p className="text-xs text-muted-foreground mt-3 italic">{bullet.explanation}</p>
          </div>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center gap-1.5 mt-4">
        {bullets.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setIsFlipped(false);
              setCurrentIndex(i);
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              i === currentIndex 
                ? 'bg-primary w-6' 
                : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
            }`}
          />
        ))}
      </div>
    </Card>
  );
}
