import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, LogOut, ArrowLeft, User, Mail, Clock, Briefcase, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

interface ResumeUpload {
  id: string;
  resume_text: string;
  job_description: string | null;
  analysis: any;
  created_at: string;
}

export default function Profile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [uploads, setUploads] = useState<ResumeUpload[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchUploads();
  }, [user]);

  const fetchUploads = async () => {
  setIsLoading(true);
  try {
    const { data, error } = await supabase
      .from("resume_uploads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error); 
      throw error;
    }
    setUploads(data || []);
  } catch (error) {
    console.error("Fetch error:", error); 
    toast.error("Failed to load resume history");
  } finally {
    setIsLoading(false);
  }
};

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const toggleExpand = (id: string) =>
    setExpandedId(expandedId === id ? null : id);

  return (
    <div className="min-h-screen bg-background">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 -right-40 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl hero-gradient shadow-lg">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold text-foreground">ResuAI</span>
            </Link>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-2">
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:block">Sign Out</span>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-4xl">
        {/* Back */}
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Profile Card */}
        <Card className="mb-8 border-border/50 bg-card/80 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground font-display">My Profile</h1>
                <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{user?.email}</span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs">
                    Member since {user?.created_at ? formatDate(user.created_at) : "—"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resume History */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-semibold text-foreground">Resume History</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">
              {uploads.length}
            </span>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 rounded-xl bg-card/50 border border-border/50 animate-pulse" />
              ))}
            </div>
          ) : uploads.length === 0 ? (
            <Card className="border-border/50 bg-card/50">
              <CardContent className="py-12 text-center">
                <FileText className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No resume analyses yet.</p>
                <Link to="/">
                  <Button variant="outline" size="sm" className="mt-4">
                    Analyze your first resume
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {uploads.map((upload, index) => (
                <Card key={upload.id} className="border-border/50 bg-card/80 hover:border-accent/30 transition-all duration-200">
                  <CardContent className="py-4">
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleExpand(upload.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            Resume Analysis #{uploads.length - index}
                          </p>
                          <p className="text-xs text-muted-foreground">{formatDate(upload.created_at)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {upload.analysis?.overallScore && (
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-success/10 text-success border border-success/20">
                            Score: {upload.analysis.overallScore}
                          </span>
                        )}
                        {expandedId === upload.id ? (
                          <ChevronUp className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {expandedId === upload.id && (
                      <div className="mt-4 pt-4 border-t border-border/50 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                        {upload.job_description && (
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Job Description</p>
                            <p className="text-sm text-foreground bg-muted/30 rounded-lg p-3 line-clamp-3">
                              {upload.job_description}
                            </p>
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Resume Preview</p>
                          <p className="text-sm text-foreground bg-muted/30 rounded-lg p-3 line-clamp-4">
                            {upload.resume_text}
                          </p>
                        </div>
                        {upload.analysis?.strengths?.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Strengths</p>
                            <ul className="space-y-1">
                              {upload.analysis.strengths.slice(0, 3).map((s: string, i: number) => (
                                <li key={i} className="text-sm text-foreground flex items-start gap-2">
                                  <span className="text-success mt-0.5">✓</span> {s}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}