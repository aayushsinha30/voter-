'use client';

import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import { MisinfoChecker } from '@/components/safety/MisinfoChecker';
import { ShieldCheck, AlertTriangle, TrendingUp, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function ToolsPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <TopBar />
      <main className="px-5 py-6 pb-28 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-success/20 to-emerald-500/20 flex items-center justify-center border border-success/20">
            <ShieldCheck className="w-5 h-5 text-success" />
          </div>
          <div>
            <h2 className="text-2xl font-headline">Safety & Verification</h2>
            <p className="text-xs text-muted-foreground">Identify misinformation and verify sources.</p>
          </div>
        </div>

        <MisinfoChecker />

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: AlertTriangle, label: 'Misinfo Speed', value: '70% faster', color: 'text-warning', bg: 'from-warning/10 to-orange-500/10', border: 'border-warning/20' },
            { icon: TrendingUp, label: 'During Elections', value: '3x more', color: 'text-destructive', bg: 'from-destructive/10 to-red-500/10', border: 'border-destructive/20' },
            { icon: Eye, label: 'AI Accuracy', value: '~85%', color: 'text-success', bg: 'from-success/10 to-emerald-500/10', border: 'border-success/20' },
          ].map((stat, i) => (
            <Card key={i} className={`glass-card border-border/20 ${stat.border}`}>
              <CardContent className="p-3 text-center space-y-2">
                <div className={`w-8 h-8 mx-auto rounded-lg bg-gradient-to-br ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <p className={`text-sm font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wider">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Card */}
        <Card className="glass-card-accent border-primary/15">
          <CardContent className="p-5 space-y-3">
            <h3 className="font-bold text-sm gradient-text">Why verify information?</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              During election seasons, misinformation spreads 70% faster than factual news on social media. 
              VoteWise uses AI to help you filter noise and make decisions based on verified information. 
              Always cross-check with trusted local election authorities.
            </p>
          </CardContent>
        </Card>
      </main>
      <BottomNav />
    </div>
  );
}