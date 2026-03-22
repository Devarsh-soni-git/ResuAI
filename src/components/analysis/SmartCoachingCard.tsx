import { GraduationCap, Wrench, Award, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReadinessBadge } from "./ReadinessBadge";
import type { SmartCoaching } from "./types";

interface SmartCoachingCardProps {
  coaching: SmartCoaching;
}

export function SmartCoachingCard({ coaching }: SmartCoachingCardProps) {
  const experienceLevelInfo = {
    'fresher': { label: 'Entry Level', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    'mid-level': { label: 'Mid Career', color: 'text-accent', bg: 'bg-accent/10' },
    'senior': { label: 'Senior Level', color: 'text-warning', bg: 'bg-warning/10' }
  };

  const levelInfo = experienceLevelInfo[coaching.experienceLevel];

  return (
    <Card className="p-6 border-0 shadow-soft">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
            <GraduationCap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-foreground">
              Smart Career Coaching
            </h3>
            <p className="text-sm text-muted-foreground">Personalized for your journey</p>
          </div>
        </div>
        <ReadinessBadge level={coaching.readinessLevel} />
      </div>

      {/* Experience Level Badge */}
      <div className="flex items-center gap-2 mb-6">
        <Badge className={`${levelInfo.bg} ${levelInfo.color} border-0`}>
          {levelInfo.label}
        </Badge>
        <span className="text-xs text-muted-foreground">
          Suggestions tailored for your experience
        </span>
      </div>

      {/* Generated Summary */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-primary uppercase tracking-wide">
            AI-Generated Summary for Your Resume
          </span>
        </div>
        <p className="text-sm text-foreground leading-relaxed italic">
          "{coaching.generatedSummary}"
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Missing Skills */}
        <div className="p-4 rounded-lg bg-secondary/50">
          <div className="flex items-center gap-2 mb-3">
            <Wrench className="w-4 h-4 text-warning" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Skills to Develop
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {coaching.missingSKills.slice(0, 6).map((skill, i) => (
              <Badge key={i} variant="outline" className="text-xs border-warning/30 text-warning">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Recommended Certifications */}
        <div className="p-4 rounded-lg bg-secondary/50">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-4 h-4 text-success" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Recommended Certifications
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {coaching.recommendedCertifications.slice(0, 4).map((cert, i) => (
              <Badge key={i} variant="secondary" className="text-xs bg-success/10 text-success border-success/20">
                {cert}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
