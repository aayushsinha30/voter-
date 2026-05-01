'use client';

import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import { CivicExplainer } from '@/components/civic/CivicExplainer';
import { ManifestoTool } from '@/components/manifesto/ManifestoTool';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Brain, FileText } from 'lucide-react';

export default function LearnPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <TopBar />
      <main className="px-5 py-6 pb-28 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center border border-blue-500/20">
            <BookOpen className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-headline">Knowledge Center</h2>
            <p className="text-xs text-muted-foreground">Master civic concepts and decode candidate platforms.</p>
          </div>
        </div>

        <Tabs defaultValue="explainer" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 h-11 bg-secondary/50 p-1 rounded-xl border border-border/30">
            <TabsTrigger
              value="explainer"
              className="rounded-lg text-xs font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white transition-all flex items-center gap-1.5"
            >
              <Brain className="w-3.5 h-3.5" />
              AI Explainer
            </TabsTrigger>
            <TabsTrigger
              value="manifesto"
              className="rounded-lg text-xs font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent data-[state=active]:to-teal-500 data-[state=active]:text-background transition-all flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              Manifesto Decoder
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="explainer">
            <CivicExplainer />
          </TabsContent>
          
          <TabsContent value="manifesto">
            <ManifestoTool />
          </TabsContent>
        </Tabs>
      </main>
      <BottomNav />
    </div>
  );
}