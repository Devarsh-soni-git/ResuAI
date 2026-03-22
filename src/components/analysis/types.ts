export interface Section {
  category: string;
  score: number;
  findings: string[];
  suggestions: string[];
}

export interface RewrittenBullet {
  original: string;
  improved: string;
  explanation: string;
}

export interface KeywordAnalysis {
  present: string[];
  missing: string[];
  jobMatch?: number;
}

export interface InterviewPrep {
  likelyQuestions: string[];
  challengePoints: string[];
  linkedinTips: string[];
  careerGrowth: string[];
}

export interface SmartCoaching {
  experienceLevel: 'fresher' | 'mid-level' | 'senior';
  readinessLevel: 'Internship-ready' | 'Job-ready' | 'Interview-ready';
  missingSKills: string[];
  recommendedCertifications: string[];
  generatedSummary: string;
}

export interface Analysis {
  overallScore: number;
  atsScore: number;
  sections: Section[];
  rewrittenBullets: RewrittenBullet[];
  keywordAnalysis: KeywordAnalysis;
  summary: string;
  strengths: string[];
  interviewPrep: InterviewPrep;
  smartCoaching: SmartCoaching;
}
