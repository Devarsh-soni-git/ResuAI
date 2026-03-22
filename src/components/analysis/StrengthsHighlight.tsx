import { Sparkles, Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StrengthsHighlightProps {
  strengths: string[];
  summary: string;
}

export function StrengthsHighlight({ strengths, summary }: StrengthsHighlightProps) {
  return (
    <Card className="p-6 border-0 shadow-elevated bg-gradient-to-br from-success/5 via-card to-accent/5 overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-success/10 to-transparent rounded-full blur-2xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-accent/10 to-transparent rounded-full blur-xl" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-success to-accent">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-foreground">
              Your Resume Strengths ✨
            </h3>
            <p className="text-sm text-muted-foreground">Let's celebrate what you're doing great!</p>
          </div>
        </div>

        <p className="text-foreground leading-relaxed mb-4">{summary}</p>

        <div className="flex flex-wrap gap-2">
          {strengths.map((strength, i) => (
            <div
              key={i}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success/10 border border-success/20 text-success text-sm font-medium"
            >
              <Sparkles className="w-3 h-3" />
              {strength}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
