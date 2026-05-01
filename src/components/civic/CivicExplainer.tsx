'use client';

import { useState } from 'react';
import { explainCivicConcept, CivicConceptExplainerOutput } from '@/ai/flows/civic-concept-explainer-flow';
import { useUserContext } from '@/app/lib/user-store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Search, Lightbulb, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export function CivicExplainer() {
  const { user } = useUserContext();
  const { toast } = useToast();
  const [concept, setConcept] = useState('');
  const [level, setLevel] = useState<'simple' | 'detailed' | 'expert'>('simple');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CivicConceptExplainerOutput | null>(null);

  const handleExplain = async () => {
    if (!concept.trim()) return;
    setLoading(true);
    try {
      const res = await explainCivicConcept({ 
        concept, 
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
    <div className="space-y-6">
      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            Civic Explainer
          </CardTitle>
          <CardDescription>Demystify politics in {user?.country || 'India'}.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder={user?.country === 'India' ? "e.g. Lok Sabha, Anti-Defection Law..." : "e.g. Electoral College, Gerrymandering..."}
                className="pl-9 h-12"
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleExplain()}
              />
            </div>
            <Button className="h-12 px-6 bg-accent" onClick={handleExplain} disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : "Explain"}
            </Button>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Comprehension Level</label>
            <Tabs value={level} onValueChange={(v) => setLevel(v as any)} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="simple">Simple</TabsTrigger>
                <TabsTrigger value="detailed">Detailed</TabsTrigger>
                <TabsTrigger value="expert">Expert</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card className="border-none shadow-lg animate-in fade-in zoom-in-95 duration-300">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-2 text-accent">
              <Lightbulb className="w-5 h-5" />
              <h3 className="font-bold text-lg">Key Explanation</h3>
            </div>
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">{result.explanation}</p>
            
            <div className="pt-4 border-t space-y-3">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Related Concepts</h4>
              <div className="flex flex-wrap gap-2">
                {result.relatedTerms.map((term, i) => (
                  <Badge 
                    key={i} 
                    variant="secondary" 
                    className="cursor-pointer hover:bg-primary hover:text-white transition-colors py-1.5 px-3"
                    onClick={() => setConcept(term)}
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
