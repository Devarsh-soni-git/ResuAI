import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Briefcase, Sparkles, Loader2, Upload, X, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js';

interface ResumeInputProps {
  onAnalyze: (resume: string, jobDescription?: string, jobKeyword?: string) => void;
  isLoading: boolean;
}

export function ResumeInput({ onAnalyze, isLoading }: ResumeInputProps) {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobKeyword, setJobKeyword] = useState("");
  const [showJobDescription, setShowJobDescription] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isParsingFile, setIsParsingFile] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsParsingFile(true);
    setUploadedFileName(null);

    try {
      // If it's a PDF, try to extract text locally first using pdfjs
      const fileName = file.name.toLowerCase();
      if (file.type === 'application/pdf' || fileName.endsWith('.pdf')) {
        try {
          const arrayBuffer = await file.arrayBuffer();
          // Use a CDN worker for convenience in dev; adjust if you prefer bundling the worker
          pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js';
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          let extracted = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const pageText = content.items.map((t: any) => (t.str || '')).join(' ');
            extracted += pageText + '\n\n';
          }
          if (extracted.trim()) {
            setResume(extracted.trim());
            setUploadedFileName(file.name);
            toast.success(`Resume uploaded: ${file.name}`);
            return;
          }
          // If local extraction failed or produced empty text, fall through to server parsing
        } catch (localErr) {
          console.error('Local PDF parse error:', localErr);
          // continue to server-side parsing as a fallback
        }
      }

      // Fallback: send file to server function (parse-resume)
      const formData = new FormData();
      formData.append('file', file);

      const { data, error } = await supabase.functions.invoke('parse-resume', {
        body: formData,
      });

      if (error) {
        console.error('Parse error:', error);
        toast.error('Failed to parse file. Please try pasting your resume text instead.');
        return;
      }

      if (data.error) {
        toast.error(data.error);
        return;
      }

      if (data.text) {
        setResume(data.text);
        setUploadedFileName(data.fileName || file.name);
        toast.success(`Resume uploaded: ${file.name}`);
      }
    } catch (err) {
      console.error('Upload error:', err);
      toast.error('Failed to upload file. Please try again or paste your resume text.');
    } finally {
      setIsParsingFile(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    disabled: isParsingFile || isLoading,
  });

  const clearUpload = () => {
    setUploadedFileName(null);
    setResume("");
  };

  const handleSubmit = () => {
    if (resume.trim()) {
      onAnalyze(resume, jobDescription.trim() || undefined, jobKeyword.trim() || undefined);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 shadow-soft card-gradient border-0">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold text-foreground">Your Resume</h2>
            <p className="text-sm text-muted-foreground">Upload a PDF or paste your resume content</p>
          </div>
        </div>

        {/* File Upload Zone */}
        <div
          {...getRootProps()}
          className={`
            mb-4 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200
            ${isDragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-border/50 hover:border-primary/50 hover:bg-muted/30'
            }
            ${isParsingFile ? 'opacity-50 cursor-wait' : ''}
          `}
        >
          <input {...getInputProps()} />
          {isParsingFile ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Extracting text from your resume...</p>
            </div>
          ) : uploadedFileName ? (
            <div className="flex items-center justify-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-accent" />
              <span className="text-sm font-medium text-foreground">{uploadedFileName}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  clearUpload();
                }}
                className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-8 h-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {isDragActive ? 'Drop your resume here' : 'Drag & drop your PDF resume, or click to select'}
              </p>
              <p className="text-xs text-muted-foreground/70">Supports PDF and TXT files</p>
            </div>
          )}
        </div>

        <div className="relative">
          <div className="absolute inset-x-0 top-0 flex items-center justify-center -mt-3">
            <span className="px-2 text-xs text-muted-foreground bg-card">or paste your resume text</span>
          </div>
        </div>

        <Textarea
          placeholder="Paste your resume here... Include your experience, skills, education, and achievements."
          value={resume}
          onChange={(e) => {
            setResume(e.target.value);
            if (uploadedFileName) setUploadedFileName(null);
          }}
          className="min-h-[250px] resize-none border-border/50 focus:border-primary transition-colors font-body text-sm mt-4"
        />
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {resume.length > 0 ? `${resume.split(/\s+/).filter(Boolean).length} words` : "Start typing or paste your resume"}
          </span>
        </div>
      </Card>

      <Card className={`p-6 shadow-soft card-gradient border-0 transition-all duration-300 ${showJobDescription ? 'opacity-100' : 'opacity-60 hover:opacity-80'}`}>
        <button 
          onClick={() => setShowJobDescription(!showJobDescription)}
          className="flex items-center gap-3 w-full text-left"
        >
          <div className="p-2 rounded-lg bg-accent/10">
            <Briefcase className="w-5 h-5 text-accent" />
          </div>
          <div className="flex-1">
            <h2 className="font-display text-lg font-semibold text-foreground">Target Job Description</h2>
            <p className="text-sm text-muted-foreground">
              {showJobDescription ? "Add a job description for tailored suggestions" : "Optional: Click to add for better keyword matching"}
            </p>
          </div>
          <span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
            Optional
          </span>
        </button>
        
        <div className="mt-4 grid gap-4">
          <div>
            <label htmlFor="job-keyword" className="text-sm font-medium text-foreground block mb-2">
              Target Job Keyword
            </label>
            <Input
              id="job-keyword"
              placeholder="e.g. Product Manager, Data Analyst, Software Engineer"
              value={jobKeyword}
              onChange={(e) => setJobKeyword(e.target.value)}
              className="border-border/50 focus:border-accent transition-colors font-body text-sm"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Use a keyword to fetch LinkedIn jobs that match your desired role.
            </p>
          </div>

          {showJobDescription && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <Textarea
                placeholder="Paste the job description you're targeting... This helps identify keyword gaps and skill mismatches."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="min-h-[180px] resize-none border-border/50 focus:border-accent transition-colors font-body text-sm"
              />
            </div>
          )}
        </div>
      </Card>

      <Button 
        onClick={handleSubmit}
        disabled={!resume.trim() || isLoading || isParsingFile}
        className="w-full h-14 text-lg font-semibold hero-gradient hover:opacity-90 transition-opacity shadow-elevated"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Analyzing Your Resume...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 mr-2" />
            Analyze & Improve Resume
          </>
        )}
      </Button>
    </div>
  );
}
