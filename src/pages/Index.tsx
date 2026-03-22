import { useState } from "react";
import { Link } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/hooks/useAuth";
import { ResumeInput } from "@/components/ResumeInput";
import { AnalysisResults, type Analysis } from "@/components/analysis";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FileText, Shield, Zap, Award, Sparkles, Brain, Target, LogIn, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Shield,
    title: "ATS-Optimized",
    description: "Beat applicant tracking systems"
  },
  {
    icon: Zap,
    title: "Instant Analysis",
    description: "Get feedback in seconds"
  },
  {
    icon: Award,
    title: "Achievement-Focused",
    description: "Transform duties into wins"
  },
  {
    icon: Brain,
    title: "Interview Prep",
    description: "Predict likely questions"
  },
  {
    icon: Target,
    title: "Career Coaching",
    description: "Personalized growth tips"
  },
 
];

export default function Index() {
  const auth = useAuth();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async (resume: string, jobDescription?: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-resume', {
        body: { resume, jobDescription }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setAnalysis(data);

      

      toast.success("Analysis complete! Review your personalized suggestions below.");
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to analyze resume. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysis(null);
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 -right-40 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl hero-gradient shadow-lg">
              <FileText className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <span className="font-display text-xl font-bold text-foreground">ResuAI</span>
              <span className="ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-accent/10 text-accent">AI</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {auth.user ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-accent/10 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium hidden md:block">{auth.user.email}</span>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={auth.signOut}
                  className="h-8 px-2"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex gap-1">
                <NavLink
                  to="/login"
                  className="text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-md hover:bg-accent/50 transition-colors hidden sm:block"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="text-sm bg-primary text-primary-foreground font-medium px-4 py-1.5 rounded-md hover:bg-primary/90 transition-colors hidden sm:block"
                >
                  Get Started
                </NavLink>
                <Button variant="outline" size="sm" className="sm:hidden">
                  <LogIn className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      {!analysis && (
        <section className="py-16 md:py-20 border-b border-border/50 relative">
          <div className="container mx-auto px-4 text-center max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20 text-success mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">AI-Powered Career Upgrade</span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
              Transform Your Resume Into a{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-success bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                Career Catalyst
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-900">
              Get premium AI analysis with 3D visualization, interview prep,
              and personalized career coaching. Not just feedback—a career upgrade.
            </p>

            {/* Feature Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-12 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-card/50 border border-border/50 hover:border-accent/30 hover:bg-accent/5 transition-all duration-300 group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="p-1.5 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                    <feature.icon className="w-3.5 h-3.5 text-accent" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-semibold text-foreground block">{feature.title}</span>
                    <span className="text-[10px] text-muted-foreground">{feature.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-5xl">
        {analysis ? (
          <AnalysisResults analysis={analysis} onReset={handleReset} />
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000" style={{ animationDelay: '200ms' }}>
            <ResumeInput onAnalyze={handleAnalyze} isLoading={isLoading} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 mt-12 bg-card/30">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <p className="text-sm font-medium text-foreground">Secure & Private</p>
          </div>
          <p className="text-xs text-muted-foreground">
            Your resume data is processed securely and never stored. Powered by advanced AI.
          </p>
        </div>
      </footer>
    </div>
  );
}