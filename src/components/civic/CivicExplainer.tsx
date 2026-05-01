'use client';

import { useState } from 'react';
import { explainCivicConcept, CivicConceptExplainerOutput } from '@/ai/flows/civic-concept-explainer-flow';
import { useUserContext } from '@/app/lib/user-store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Search, Lightbulb, Loader2, Sparkles, Brain } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

const SUGGESTED_TOPICS: Record<string, string[]> = {
  'India': ['Lok Sabha', 'Rajya Sabha', 'EVM Machines', 'Anti-Defection Law', 'NOTA', 'First Past the Post'],
  'United States': ['Electoral College', 'Gerrymandering', 'Filibuster', 'Super PAC', 'Swing States', 'Ranked Choice Voting'],
  default: ['Democracy', 'Referendum', 'Constitution', 'Suffrage', 'Coalition', 'Electoral System'],
};

export function CivicExplainer() {
  const { user } = useUserContext();
  const { toast } = useToast();
  const [concept, setConcept] = useState('');
  const [level, setLevel] = useState<'simple' | 'detailed' | 'expert'>('simple');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CivicConceptExplainerOutput | null>(null);

  const topics = SUGGESTED_TOPICS[user?.country || ''] || SUGGESTED_TOPICS['default'];

  const handleExplain = async (topic?: string) => {
    const searchTerm = topic || concept;
    if (!searchTerm.trim()) return;
    if (topic) setConcept(topic);
    setLoading(true);
    try {
      const res = await explainCivicConcept({ 
        concept: searchTerm, 
        comprehensionLevel: level,
        country: user?.country || 'India' 
      });
      setResult(res);
    } catch (e: any) {
      console.error(e);
      toast({
        variant: "destructive",
        title: "Service Unavailable",
        description: e.message?.includes('503') 
          ? "AI models are currently in high demand. Please try again in a moment."
          : "Could not explain this concept. Please check your connection and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <Card className="glass-card border-border/30">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center border border-primary/20">
              <Brain className="w-4 h-4 text-primary" />
            </div>
            AI Civic Explainer
          </CardTitle>
          <CardDescription className="text-xs">Demystify politics in {user?.country || 'your country'}.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder={user?.country === 'India' ? "e.g. Lok Sabha, Anti-Defection Law..." : "e.g. Electoral College, Gerrymandering..."}
                className="pl-9 h-11 bg-secondary/50 border-border/50 rounded-xl text-sm"
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleExplain()}
              />
            </div>
            <Button
              className="h-11 px-5 bg-gradient-to-r from-primary to-accent hover:opacity-90 rounded-xl btn-scale"
              onClick={() => handleExplain()}
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            </Button>
          </div>
          
          {/* Comprehension Level */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Level</label>
            <Tabs value={level} onValueChange={(v) => setLevel(v as any)} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-secondary/50 p-1 h-9 rounded-xl">
                <TabsTrigger value="simple" className="text-xs rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">Simple</TabsTrigger>
                <TabsTrigger value="detailed" className="text-xs rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">Detailed</TabsTrigger>
                <TabsTrigger value="expert" className="text-xs rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">Expert</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Suggested Topics */}
          {!result && (
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Popular Topics</label>
              <div className="flex flex-wrap gap-2">
                {topics.map((topic, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="cursor-pointer bg-secondary/50 border border-border/30 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all py-1.5 px-3 text-xs rounded-lg"
                    onClick={() => handleExplain(topic)}
                  >
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {result && (
        <Card className="glass-card border-primary/20 overflow-hidden">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <Lightbulb className="w-5 h-5" />
              <h3 className="font-bold text-base">Explanation</h3>
            </div>
            <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">{result.explanation}</p>
            
            <div className="pt-4 border-t border-border/30 space-y-3">
              <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Related Concepts</h4>
              <div className="flex flex-wrap gap-2">
                {result.relatedTerms.map((term, i) => (
                  <Badge 
                    key={i} 
                    variant="secondary" 
                    className="cursor-pointer bg-secondary/50 border border-border/30 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all py-1.5 px-3 text-xs rounded-lg"
                    onClick={() => handleExplain(term)}
                  >
                    {term}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
