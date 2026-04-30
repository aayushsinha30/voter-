'use client';

import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import { CivicExplainer } from '@/components/civic/CivicExplainer';
import { ManifestoTool } from '@/components/manifesto/ManifestoTool';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LearnPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <TopBar />
      <main className="px-6 py-8 pb-32 space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-headline text-primary">Knowledge Center</h2>
          <p className="text-muted-foreground">Master civic concepts and decode candidate platforms with ease.</p>
        </div>

        <Tabs defaultValue="explainer" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 h-12 bg-secondary/50 p-1">
            <TabsTrigger value="explainer" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">ELI15 Explainer</TabsTrigger>
            <TabsTrigger value="manifesto" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Manifesto Tool</TabsTrigger>
          </TabsList>
          
          <TabsContent value="explainer" className="animate-in fade-in slide-in-from-left-4 duration-300">
            <CivicExplainer />
          </TabsContent>
          
          <TabsContent value="manifesto" className="animate-in fade-in slide-in-from-right-4 duration-300">
            <ManifestoTool />
          </TabsContent>
        </Tabs>
      </main>
      <BottomNav />
    </div>
  );
}