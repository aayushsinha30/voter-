'use client';

import { useState } from 'react';
import { checkMisinformation, MisinformationCheckerOutput } from '@/ai/flows/misinformation-checker-flow';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, ShieldCheck, Loader2, AlertTriangle, Sparkles, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { useAnalytics } from '@/hooks/use-analytics';

export function MisinfoChecker() {
  const { toast } = useToast();
  const { track, events } = useAnalytics();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MisinformationCheckerOutput | null>(null);

  const handleCheck = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      track(events.FACT_CHECK_REQUESTED, { text_length: input.length });
      const res = await checkMisinformation({ information: input });
      setResult(res);
      track(events.FACT_CHECK_COMPLETED, {
        is_misinformation: res.isMisinformation,
        confidence: res.confidenceScore,
      });
    } catch (e: any) {
      console.error(e);
      toast({
        variant: "destructive",
        title: "Analysis Error",
        description: e.message?.includes('503') 
          ? "AI model is experiencing high load. Please try again shortly."
          : "Unable to analyze information at this time.",
      });
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return 'text-success border-success/30 bg-success/10';
    if (score >= 50) return 'text-warning border-warning/30 bg-warning/10';
    return 'text-destructive border-destructive/30 bg-destructive/10';
  };

  return (
    <div className="space-y-5">
      <Card className="glass-card border-border/30">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-success/20 to-emerald-500/20 flex items-center justify-center border border-success/20">
              <ShieldCheck className="w-4 h-4 text-success" />
            </div>
            AI Fact Checker
          </CardTitle>
          <CardDescription className="text-xs">Paste news articles or social media posts to verify accuracy.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea 
            placeholder="Paste the text you want to fact-check here..." 
            className="min-h-[140px] resize-none bg-secondary/30 border-border/50 rounded-xl text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button 
            className="w-full h-11 bg-gradient-to-r from-primary to-accent hover:opacity-90 rounded-xl btn-scale btn-glow text-sm font-semibold" 
            onClick={handleCheck}
            disabled={loading || !input.trim()}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2 w-4 h-4" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 w-4 h-4" />
                Analyze Information
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card className={cn(
          "glass-card overflow-hidden border-l-4",
          result.isMisinformation ? "border-l-destructive" : "border-l-success"
        )}>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start gap-3">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                  result.isMisinformation
                    ? "bg-destructive/10 border border-destructive/20"
                    : "bg-success/10 border border-success/20"
                )}>
                  {result.isMisinformation
                    ? <ShieldAlert className="w-5 h-5 text-destructive" />
                    : <ShieldCheck className="w-5 h-5 text-success" />
                  }
                </div>
                <div>
                  <CardTitle className="text-base">
                    {result.isMisinformation ? "⚠️ Potential Misinformation" : "✅ Likely Accurate"}
                  </CardTitle>
                  <CardDescription className="text-[10px]">AI-powered assessment</CardDescription>
                </div>
              </div>
              <Badge className={cn(
                "rounded-full px-3 py-1 text-[10px] font-bold border",
                getConfidenceColor(result.confidenceScore)
              )}>
                {result.confidenceScore}%
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {result.isMisinformation && (
              <div className="bg-destructive/5 border border-destructive/10 p-3 rounded-xl flex gap-3">
                <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                <p className="text-xs font-medium text-destructive/90">This content may contain misleading information.</p>
              </div>
            )}
            <div className="text-muted-foreground text-xs italic bg-secondary/20 p-3 rounded-xl border border-border/20">
              "{input.length > 120 ? input.substring(0, 120) + '...' : input}"
            </div>
            <p className="text-sm text-foreground leading-relaxed">{result.explanation}</p>
          </CardContent>
          <CardFooter className="text-[10px] text-muted-foreground flex items-center gap-1.5 border-t border-border/20 pt-4">
            <Info className="w-3 h-3" />
            AI tools can make mistakes. Always cross-verify with trusted election officials.
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
