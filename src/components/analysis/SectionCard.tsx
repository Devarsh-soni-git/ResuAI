import { FileSearch, TrendingUp, Target, Lightbulb, CheckCircle2, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { Section } from "./types";

interface SectionCardProps {
  section: Section;
  index: number;
}

export function SectionCard({ section, index }: SectionCardProps) {
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'formatting': return FileSearch;
      case 'achievements': return TrendingUp;
      case 'keywords': return Target;
      default: return Lightbulb;
    }
  };

  const Icon = getCategoryIcon(section.category);
  
  const getScoreVariant = (score: number) => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };

  return (
    <Card 
      className="p-5 border-0 shadow-soft hover:shadow-elevated transition-shadow duration-300 group"
      style={{ 
        animationDelay: `${index * 100}ms`,
        animation: 'fade-in-up 0.5s ease-out forwards'
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <Icon className="w-4 h-4 text-primary" />
          </div>
          <h3 className="font-display font-semibold text-foreground">{section.category}</h3>
        </div>
        <Badge 
          variant={getScoreVariant(section.score)}
          className="font-semibold tabular-nums"
        >
          {section.score}/100
        </Badge>
      </div>
      
      <div className="relative mb-4">
        <Progress value={section.score} className="h-1.5" />
        <div 
          className="absolute top-0 left-0 h-1.5 rounded-full bg-gradient-to-r from-primary/0 to-primary/20 transition-all duration-1000"
          style={{ width: `${section.score}%` }}
        />
      </div>
      
      {section.findings.length > 0 && (
        <div className="mb-3">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Findings
          </p>
          <ul className="space-y-1.5">
            {section.findings.slice(0, 2).map((finding, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                <AlertCircle className="w-3.5 h-3.5 text-warning mt-0.5 shrink-0" />
                <span className="line-clamp-2">{finding}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {section.suggestions.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Suggestions
          </p>
          <ul className="space-y-1.5">
            {section.suggestions.slice(0, 2).map((suggestion, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                <CheckCircle2 className="w-3.5 h-3.5 text-success mt-0.5 shrink-0" />
                <span className="line-clamp-2">{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
