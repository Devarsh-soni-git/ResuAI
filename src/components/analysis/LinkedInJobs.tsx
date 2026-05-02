import { ExternalLink, Briefcase, MapPin, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { LinkedInJob } from "./types";

interface LinkedInJobsProps {
  jobs: LinkedInJob[];
}

export function LinkedInJobs({ jobs }: LinkedInJobsProps) {
  return (
    <Card className="p-6 border-0 shadow-soft">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground">LinkedIn Job Matches</h3>
          <p className="text-sm text-muted-foreground">
            Browse recent LinkedIn postings for the keyword you entered.
          </p>
        </div>
        <div className="rounded-full bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
          {jobs.length} Jobs
        </div>
      </div>

      <div className="space-y-4">
        {jobs.slice(0, 6).map((job) => (
          <article key={job.id} className="rounded-3xl border border-border/50 bg-background/80 p-5 shadow-sm transition-shadow hover:border-accent/40 hover:shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <Briefcase className="w-4 h-4" />
                  <span>{job.company || "Unknown company"}</span>
                </div>
                <h4 className="text-lg font-semibold text-foreground">{job.title}</h4>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{job.location || "Remote / Worldwide"}</span>
                  <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{job.posted || "Posted recently"}</span>
                </div>
              </div>
              <a
                href={job.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/10"
              >
                View on LinkedIn
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              {job.snippet || "No description snippet available from the job listing."}
            </p>
          </article>
        ))}
      </div>
    </Card>
  );
}
