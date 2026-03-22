interface ScoreRingProps {
  score: number;
  label: string;
  size?: "sm" | "md" | "lg";
  showAnimation?: boolean;
}

export function ScoreRing({ score, label, size = "lg", showAnimation = true }: ScoreRingProps) {
  const dimensions = {
    sm: { radius: 28, strokeWidth: 4, fontSize: "text-sm", container: "w-16 h-16" },
    md: { radius: 36, strokeWidth: 5, fontSize: "text-lg", container: "w-20 h-20" },
    lg: { radius: 52, strokeWidth: 6, fontSize: "text-2xl", container: "w-32 h-32" }
  };
  
  const { radius, strokeWidth, fontSize, container } = dimensions[size];
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const getGlowClass = (score: number) => {
    if (score >= 80) return "drop-shadow-[0_0_8px_hsl(var(--success)/0.5)]";
    if (score >= 60) return "drop-shadow-[0_0_8px_hsl(var(--warning)/0.5)]";
    return "";
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <svg 
          className={`${container} ${getGlowClass(score)}`} 
          viewBox={`0 0 ${(radius + strokeWidth) * 2} ${(radius + strokeWidth) * 2}`}
        >
          {/* Background track */}
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-muted/30"
          />
          {/* Progress arc */}
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={showAnimation ? strokeDashoffset : circumference}
            className={`${getScoreColor(score)} transition-all duration-1000 ease-out`}
            transform={`rotate(-90 ${radius + strokeWidth} ${radius + strokeWidth})`}
            style={{
              strokeDashoffset: showAnimation ? strokeDashoffset : circumference,
              animation: showAnimation ? 'score-fill 1.5s ease-out forwards' : 'none'
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-display font-bold ${fontSize} ${getScoreColor(score)}`}>
            {score}
          </span>
        </div>
      </div>
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
    </div>
  );
}
