'use client';

import { useState } from 'react';
import { summarizeManifesto, ManifestoSummarizerOutput } from '@/ai/flows/manifesto-summarizer-flow';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Loader2, Sparkles, BookOpen } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export function ManifestoTool() {
  const { toast } = useToast();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  const handleSummarize = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setSummary(null);
    try {
      const res = await summarizeManifesto({ manifestoText: text });
      setSummary(res.summary);
    } catch (e: any) {
      console.error(e);
      toast({
        variant: "destructive",
        title: "Summarization Failed",
        description: e.message?.includes('503') 
          ? "AI services are currently busy. Please try again in a minute."
          : "Could not summarize the manifesto. Please try again.",
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
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent/20 to-teal-500/20 flex items-center justify-center border border-accent/20">
              <FileText className="w-4 h-4 text-accent" />
            </div>
            Manifesto Decoder
          </CardTitle>
          <CardDescription className="text-xs">Convert long political documents into neutral, concise summaries.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea 
            placeholder="Paste candidate platform or manifesto text here..." 
            className="min-h-[180px] resize-none bg-secondary/30 border-border/50 rounded-xl text-sm"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
            <span>{text.length} characters</span>
            <span>Min 50 characters recommended</span>
          </div>
          <Button 
            className="w-full h-11 bg-gradient-to-r from-accent to-teal-500 hover:opacity-90 rounded-xl btn-scale btn-glow text-sm font-semibold text-background" 
            onClick={handleSummarize} 
            disabled={loading || !text.trim() || text.length < 20}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2 w-4 h-4" />
                Summarizing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 w-4 h-4" />
                Generate Neutral Summary
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {summary && (
        <Card className="glass-card border-accent/20 overflow-hidden">
          <CardHeader className="pb-3 border-b border-border/20">
            <CardTitle className="flex items-center gap-2 text-sm">
              <BookOpen className="w-4 h-4 text-accent" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-accent">Key Takeaways</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ScrollArea className="h-[280px] rounded-xl pr-4">
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{summary}</p>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
