import { Target, Plus, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { KeywordAnalysis } from "./types";

interface KeywordCloudProps {
  keywords: KeywordAnalysis;
}

export function KeywordCloud({ keywords }: KeywordCloudProps) {
  return (
    <Card className="p-6 border-0 shadow-soft">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-accent/10">
            <Target className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-foreground">
              ATS Keyword Analysis
            </h3>
            <p className="text-sm text-muted-foreground">Optimize for applicant tracking systems</p>
          </div>
        </div>
        {keywords.jobMatch !== undefined && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm font-semibold text-success">{keywords.jobMatch}% Match</span>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Present Keywords */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Check className="w-4 h-4 text-success" />
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Keywords Found
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {keywords.present.slice(0, 12).map((keyword, i) => (
              <Badge 
                key={i} 
                variant="secondary" 
                className="bg-success/10 text-success border border-success/20 hover:bg-success/20 transition-colors"
              >
                <Check className="w-3 h-3 mr-1" />
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Missing Keywords */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Plus className="w-4 h-4 text-warning" />
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Recommended to Add
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {keywords.missing.slice(0, 12).map((keyword, i) => (
              <Badge 
                key={i} 
                variant="outline" 
                className="border-warning/50 text-warning hover:bg-warning/10 transition-colors cursor-pointer"
              >
                <Plus className="w-3 h-3 mr-1" />
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
