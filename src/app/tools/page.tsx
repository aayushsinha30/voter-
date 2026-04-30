'use client';

import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import { MisinfoChecker } from '@/components/safety/MisinfoChecker';

export default function ToolsPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <TopBar />
      <main className="px-6 py-8 pb-32 space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-headline text-primary">Safety & Verification</h2>
          <p className="text-muted-foreground">Identify misinformation and ensure your sources are reliable.</p>
        </div>

        <MisinfoChecker />

        <div className="p-6 bg-accent/5 border border-accent/20 rounded-2xl space-y-3">
          <h3 className="font-bold text-accent">Why verify?</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            During election seasons, misinformation spreads 70% faster than factual news. VoteWise helps you filter the noise so you can make decisions based on reality.
          </p>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}