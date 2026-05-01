'use client';

import { personalVotingRoadmap, PersonalVotingRoadmapOutput } from '@/ai/flows/personal-voting-roadmap-flow';
import { UserContext } from '@/app/lib/user-store';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, CheckCircle2, Circle, AlertCircle, RefreshCw, Sparkles, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

export function RoadmapDisplay({ user }: { user: UserContext }) {
  const { toast } = useToast();
  const [roadmap, setRoadmap] = useState<PersonalVotingRoadmapOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchRoadmap() {
    setLoading(true);
    setError(null);
    
    // Don't attempt fetch if critical data is missing
    if (!user.location || !user.voterStatus) {
      setLoading(false);
      return;
    }
    
    try {
      const result = await personalVotingRoadmap({
        country: user.country || 'India',
        location: user.location,
        age: user.age,
        voterStatus: user.voterStatus
      });
      if ('error' in result) {
        throw new Error(result.error);
      }
      setRoadmap(result);
    } catch (e: any) {
      console.error("Roadmap generation failed", e);
      const msg = e.message?.includes('429')
        ? "API Quota Exceeded. Check your Google Gemini API billing/limits."
        : e.message?.includes('503') 
        ? "AI model is busy. Please try refreshing." 
        : "Failed to generate roadmap.";
      setError(msg);
      toast({
        variant: "destructive",
        title: "Generation Error",
        description: msg,
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRoadmap();
  }, [user.country, user.location, user.voterStatus, user.age]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="glass-card border-border/30">
            <CardHeader><Skeleton className="h-6 w-1/2 bg-secondary" /></CardHeader>
            <CardContent><Skeleton className="h-20 w-full bg-secondary" /></CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="glass-card border-destructive/20 text-center p-8 space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center border border-destructive/20">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-bold">Something went wrong</h3>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
        <Button variant="outline" onClick={fetchRoadmap} className="gap-2 rounded-xl border-border/50">
          <RefreshCw className="w-4 h-4" /> Try Again
        </Button>
      </Card>
    );
  }

  if (!roadmap) return (
    <div className="p-4 text-center text-muted-foreground italic">
      Unable to generate your voting roadmap. Please check your location settings.
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-headline">{roadmap.title}</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-3.5 h-3.5" />
          <span>Tailored for {user.location}, {user.country}</span>
        </div>
      </div>

      <div className="relative space-y-6">
        {/* Timeline line */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 timeline-line" />

        {roadmap.steps.map((step, idx) => (
          <div key={idx} className="relative flex gap-4 ml-0">
            {/* Timeline dot */}
            <div className={cn(
              "w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 z-10",
              idx === 0
                ? "border-primary bg-primary/10 text-primary timeline-glow"
                : "border-border/50 bg-secondary text-muted-foreground"
            )}>
              {idx === 0 ? <Sparkles className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            </div>

            <Card className="glass-card border-border/30 flex-1 hover:border-primary/20 transition-all">
              <CardHeader className="p-4 pb-2">
                <Badge variant="outline" className="w-fit mb-2 text-[10px] font-bold rounded-full px-3 py-1 border-primary/30 text-primary uppercase tracking-wider">
                  Step {step.stepNumber}
                </Badge>
                <CardTitle className="text-base leading-snug">{step.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                {step.actionableLink && (
                  <Button variant="link" className="p-0 h-auto text-primary text-sm mt-3 gap-1.5" asChild>
                    <a href={step.actionableLink.startsWith('http') ? step.actionableLink : `https://${step.actionableLink}`} target="_blank" rel="noopener noreferrer">
                      Take Action <ExternalLink className="w-3 h-3" />
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      <div className="flex justify-center pt-2">
        <Button
          variant="outline"
          onClick={fetchRoadmap}
          className="gap-2 rounded-xl border-border/50 hover:border-primary/30"
        >
          <RefreshCw className="w-4 h-4" /> Regenerate Roadmap
        </Button>
      </div>
    </div>
  );
}
