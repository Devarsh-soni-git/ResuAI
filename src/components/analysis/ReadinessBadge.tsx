import { Award, Rocket, Star, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ReadinessBadgeProps {
  level: 'Internship-ready' | 'Job-ready' | 'Interview-ready';
}

export function ReadinessBadge({ level }: ReadinessBadgeProps) {
  const config = {
    'Internship-ready': {
      icon: Target,
      gradient: "from-blue-500 to-cyan-500",
      bgClass: "bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/30",
      textClass: "text-blue-600"
    },
    'Job-ready': {
      icon: Rocket,
      gradient: "from-accent to-success",
      bgClass: "bg-gradient-to-r from-accent/10 to-success/10 border-accent/30",
      textClass: "text-accent"
    },
    'Interview-ready': {
      icon: Award,
      gradient: "from-warning to-orange-500",
      bgClass: "bg-gradient-to-r from-warning/10 to-orange-500/10 border-warning/30",
      textClass: "text-warning"
    }
  };

  const { icon: Icon, bgClass, textClass } = config[level];

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${bgClass}`}>
      <Icon className={`w-5 h-5 ${textClass}`} />
      <span className={`font-semibold text-sm ${textClass}`}>{level}</span>
      <div className="flex gap-0.5 ml-1">
        {[1, 2, 3].map((i) => (
          <Star
            key={i}
            className={`w-3 h-3 ${
              (level === 'Internship-ready' && i <= 1) ||
              (level === 'Job-ready' && i <= 2) ||
              (level === 'Interview-ready')
                ? textClass + ' fill-current'
                : 'text-muted-foreground/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
