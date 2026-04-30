'use client';

import { useState } from 'react';
import { summarizeManifesto, ManifestoSummarizerOutput } from '@/ai/flows/manifesto-summarizer-flow';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Loader2, Sparkles } from 'lucide-react';

export function ManifestoTool() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  const handleSummarize = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await summarizeManifesto({ manifestoText: text });
      setSummary(res.summary);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            Manifesto Decoder
          </CardTitle>
          <CardDescription>Convert long political documents into neutral, concise summaries.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea 
            placeholder="Paste candidate platform or manifesto text here..." 
            className="min-h-[200px]"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Button 
            className="w-full h-12 bg-accent" 
            onClick={handleSummarize} 
            disabled={loading || !text.trim()}
          >
            {loading ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2 w-5 h-5" />}
            Generate Neutral Summary
          </Button>
        </CardContent>
      </Card>

      {summary && (
        <Card className="border-none shadow-lg animate-in slide-in-from-bottom-2">
          <CardHeader className="bg-secondary/30">
            <CardTitle className="text-sm font-headline uppercase tracking-widest text-primary">Key Takeaways</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ScrollArea className="h-[300px] rounded-md pr-4">
              <div className="prose prose-blue prose-sm max-w-none">
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">{summary}</p>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}