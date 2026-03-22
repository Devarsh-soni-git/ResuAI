import { useState } from "react";
import { MessageSquare, AlertTriangle, Linkedin, TrendingUp, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { InterviewPrep } from "./types";

interface InterviewPrepCardProps {
  interviewPrep: InterviewPrep;
}

export function InterviewPrepCard({ interviewPrep }: InterviewPrepCardProps) {
  const [openSection, setOpenSection] = useState<string | null>("questions");

  const sections = [
    {
      id: "questions",
      icon: MessageSquare,
      title: "Predicted Interview Questions",
      description: "Questions likely to come up based on your resume",
      items: interviewPrep.likelyQuestions,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      id: "challenges",
      icon: AlertTriangle,
      title: "Points Interviewers May Challenge",
      description: "Be prepared to elaborate on these",
      items: interviewPrep.challengePoints,
      color: "text-warning",
      bgColor: "bg-warning/10"
    },
    {
      id: "linkedin",
      icon: Linkedin,
      title: "LinkedIn & Portfolio Tips",
      description: "Enhance your online presence",
      items: interviewPrep.linkedinTips,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      id: "growth",
      icon: TrendingUp,
      title: "Career Growth (Next 3-6 Months)",
      description: "Short-term recommendations",
      items: interviewPrep.careerGrowth,
      color: "text-success",
      bgColor: "bg-success/10"
    }
  ];

  return (
    <Card className="p-6 border-0 shadow-soft">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl hero-gradient">
          <MessageSquare className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground">
            Career & Interview Support
          </h3>
          <p className="text-sm text-muted-foreground">Get ahead with smart insights</p>
        </div>
      </div>

      <div className="space-y-3">
        {sections.map((section) => (
          <Collapsible
            key={section.id}
            open={openSection === section.id}
            onOpenChange={(isOpen) => setOpenSection(isOpen ? section.id : null)}
          >
            <CollapsibleTrigger className="w-full">
              <div className={`flex items-center justify-between p-4 rounded-lg ${section.bgColor} hover:opacity-90 transition-opacity`}>
                <div className="flex items-center gap-3">
                  <section.icon className={`w-5 h-5 ${section.color}`} />
                  <div className="text-left">
                    <p className={`font-medium text-sm ${section.color}`}>{section.title}</p>
                    <p className="text-xs text-muted-foreground">{section.description}</p>
                  </div>
                </div>
                <ChevronDown 
                  className={`w-4 h-4 text-muted-foreground transition-transform ${
                    openSection === section.id ? 'rotate-180' : ''
                  }`} 
                />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3 px-4 pb-1">
              <ul className="space-y-2">
                {section.items.map((item, i) => (
                  <li 
                    key={i} 
                    className="flex items-start gap-2 text-sm text-foreground"
                  >
                    <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${section.bgColor} border ${section.color.replace('text-', 'border-')}`} />
                    {item}
                  </li>
                ))}
              </ul>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </Card>
  );
}
