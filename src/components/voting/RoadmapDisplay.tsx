'use client';

import { personalVotingRoadmap, PersonalVotingRoadmapOutput } from '@/ai/flows/personal-voting-roadmap-flow';
import { UserContext } from '@/app/lib/user-store';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, CheckCircle2, Circle } from 'lucide-react';
import { Button } from "@/components/ui/button";

export function RoadmapDisplay({ user }: { user: UserContext }) {
  const [roadmap, setRoadmap] = useState<PersonalVotingRoadmapOutput | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRoadmap() {
      try {
        const result = await personalVotingRoadmap({
          location: user.location,
          age: user.age,
          voterStatus: user.voterStatus
        });
        setRoadmap(result);
      } catch (e) {
        console.error("Roadmap generation failed", e);
      } finally {
        setLoading(false);
      }
    }
    fetchRoadmap();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
            <CardContent><Skeleton className="h-20 w-full" /></CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!roadmap) return <div>Failed to load roadmap. Please try again.</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="space-y-2">
        <h2 className="text-2xl font-headline text-primary">{roadmap.title}</h2>
        <p className="text-muted-foreground">Tailored for {user.location}</p>
      </div>

      <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-accent before:to-transparent">
        {roadmap.steps.map((step, idx) => (
          <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-accent bg-background text-accent shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 timeline-glow">
              {idx === 0 ? <Circle className="w-5 h-5 fill-accent/20" /> : <CheckCircle2 className="w-5 h-5" />}
            </div>

            <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] ml-4 md:ml-0 border-none shadow-md transition-all hover:shadow-lg">
              <CardHeader className="p-4 pb-2">
                <Badge variant="outline" className="w-fit mb-2 text-accent border-accent">Step {step.stepNumber}</Badge>
                <CardTitle className="text-lg leading-tight">{step.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{step.description}</p>
                {step.actionableLink && (
                  <Button variant="link" className="p-0 h-auto text-accent text-sm" asChild>
                    <a href={step.actionableLink} target="_blank" rel="noopener noreferrer">
                      Take Action <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}