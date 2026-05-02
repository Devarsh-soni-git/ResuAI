import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw, Sparkles } from "lucide-react";

import { ScoreRing } from "./ScoreRing";
import { ReadinessBadge } from "./ReadinessBadge";
import { StrengthsHighlight } from "./StrengthsHighlight";
import { BulletComparison } from "./BulletComparison";
import { InterviewPrepCard } from "./InterviewPrepCard";
import { SectionCard } from "./SectionCard";
import { KeywordCloud } from "./KeywordCloud";
import { LinkedInJobs } from "./LinkedInJobs";
import { SmartCoachingCard } from "./SmartCoachingCard";
import type { Analysis } from "./types";

interface AnalysisResultsProps {
  analysis: Analysis;
  onReset: () => void;
}

export function AnalysisResults({ analysis, onReset }: AnalysisResultsProps) {
  // Provide defaults for new fields if they're missing (backward compatibility)
  const strengths = analysis.strengths || [];
  const interviewPrep = analysis.interviewPrep || {
    likelyQuestions: [],
    challengePoints: [],
    linkedinTips: [],
    careerGrowth: []
  };
  const smartCoaching = analysis.smartCoaching || {
    experienceLevel: 'mid-level' as const,
    readinessLevel: 'Job-ready' as const,
    missingSKills: [],
    recommendedCertifications: [],
    generatedSummary: ''
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header with Scores */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 text-success mb-4">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">Analysis Complete!</span>
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
          Your Resume Scorecard
        </h2>
        <p className="text-muted-foreground">
          Here's your personalized career upgrade roadmap
        </p>
      </div>

      {/* Score Overview */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 p-8 rounded-2xl bg-gradient-to-br from-card via-card to-secondary/30 shadow-elevated">
        <ScoreRing score={analysis.overallScore} label="Overall Score" size="lg" />
        <div className="flex gap-6">
          <ScoreRing score={analysis.atsScore} label="ATS Score" size="md" />
          {analysis.keywordAnalysis.jobMatch !== undefined && (
            <ScoreRing score={analysis.keywordAnalysis.jobMatch} label="Job Match" size="md" />
          )}
        </div>
        {smartCoaching.readinessLevel && (
          <div className="mt-4 md:mt-0">
            <ReadinessBadge level={smartCoaching.readinessLevel} />
          </div>
        )}
      </div>

      {/* Strengths First - Positive Reinforcement */}
      {strengths.length > 0 && (
        <StrengthsHighlight strengths={strengths} summary={analysis.summary} />
      )}

      {/* Section Cards Grid */}
      <div>
        <h3 className="font-display text-lg font-semibold text-foreground mb-4">
          Detailed Section Analysis
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {analysis.sections.map((section, index) => (
            <SectionCard key={section.category} section={section} index={index} />
          ))}
        </div>
      </div>

      {/* Before/After Bullet Comparison */}
      {analysis.rewrittenBullets.length > 0 && (
        <BulletComparison bullets={analysis.rewrittenBullets} />
      )}

      {/* Keyword Analysis */}
      <KeywordCloud keywords={analysis.keywordAnalysis} />

      {/* LinkedIn Job Matches */}
      {analysis.linkedInJobs && analysis.linkedInJobs.length > 0 && (
        <LinkedInJobs jobs={analysis.linkedInJobs} />
      )}

      {/* Smart Coaching */}
      {smartCoaching.generatedSummary && (
        <SmartCoachingCard coaching={smartCoaching} />
      )}

      {/* Interview Prep */}
      {(interviewPrep.likelyQuestions.length > 0 || interviewPrep.careerGrowth.length > 0) && (
        <InterviewPrepCard interviewPrep={interviewPrep} />
      )}

      {/* Reset Button */}
      <Button
        onClick={onReset}
        variant="outline"
        className="w-full h-12 gap-2"
      >
        <RotateCcw className="w-4 h-4" />
        Analyze Another Resume
      </Button>
    </div>
  );
}