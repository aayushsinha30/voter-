'use client';

import { useUserContext } from '@/app/lib/user-store';
import { Onboarding } from '@/components/voting/Onboarding';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import { Checklist } from '@/components/voting/Checklist';
import { ElectionCountdown } from '@/components/voting/ElectionCountdown';
import { QuickStats } from '@/components/voting/QuickStats';
import { ElectionNewsFeed } from '@/components/voting/ElectionNewsFeed';
import { Card, CardContent } from '@/components/ui/card';
import { Bell, MapPin, Sparkles, ArrowRight, Zap, BookOpen, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function Home() {
  const { user, saveUser, loading } = useUserContext();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-pulse">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <p className="text-muted-foreground text-sm font-medium">Loading VoteWise...</p>
        </div>
      </div>
    );
  }

  if (!user || !user.onboarded || !user.country) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center mb-10 space-y-3">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6 glow-primary">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-headline gradient-text font-bold">VoteWise</h1>
          <p className="text-muted-foreground text-lg max-w-sm mx-auto">
            Your AI-powered civic command center for an informed vote.
          </p>
        </div>
        <Onboarding onComplete={(data) => saveUser(data)} />
      </main>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <TopBar />
      <main className="px-5 py-6 space-y-6 pb-28">
        {/* Hero Section */}
        <section className="space-y-4 stagger-item">
          <div>
            <h2 className="text-2xl font-headline">
              Welcome back<span className="gradient-text">,</span>
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              {user.voterStatus === 'registered'
                ? '✅ You are registered to vote'
                : user.voterStatus === 'unregistered'
                ? '⚠️ Registration needed'
                : '❓ Status unknown — check below'}
            </p>
          </div>
        </section>

        {/* Quick Stats Cards */}
        <section className="stagger-item">
          <QuickStats user={user} />
        </section>

        {/* Election Countdown */}
        <section className="stagger-item">
          <ElectionCountdown country={user.country} />
        </section>

        {/* Readiness Checklist */}
        <section className="space-y-3 stagger-item">
          <h3 className="text-xs font-headline uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
            <div className="w-1 h-4 rounded-full bg-gradient-to-b from-primary to-accent" />
            Readiness
          </h3>
          <Checklist />
        </section>

        {/* Election Phases */}
        <section className="space-y-3 stagger-item">
          <h3 className="text-xs font-headline uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
            <div className="w-1 h-4 rounded-full bg-gradient-to-b from-primary to-accent" />
            Election Timeline
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Phase 1: Voter Awareness', date: 'Ongoing', active: true, icon: BookOpen },
              { label: 'Phase 2: Nomination Review', date: 'Upcoming', active: false, icon: Bell },
              { label: 'Phase 3: Polling Day', date: 'TBD', active: false, icon: Zap }
            ].map((item, i) => (
              <div key={i} className={cn(
                "glass-card flex items-center gap-4 p-4 transition-all",
                item.active ? "border-primary/30 glow-primary" : "opacity-50"
              )}>
                <div className={cn(
                  "w-11 h-11 rounded-xl flex items-center justify-center shrink-0",
                  item.active
                    ? "bg-gradient-to-br from-primary to-accent text-white"
                    : "bg-secondary text-muted-foreground"
                )}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{user.country} · {item.date}</p>
                </div>
                {item.active && (
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-success pulse-live" />
                    <span className="text-[10px] font-bold text-success uppercase">Live</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="space-y-3 stagger-item">
          <h3 className="text-xs font-headline uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
            <div className="w-1 h-4 rounded-full bg-gradient-to-b from-primary to-accent" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Fact Check', desc: 'Verify any claim', href: '/tools', icon: ShieldCheck, color: 'from-primary to-purple-500' },
              { label: 'Learn Civics', desc: 'AI explainer', href: '/learn', icon: BookOpen, color: 'from-accent to-emerald-400' },
            ].map((action, i) => (
              <Link key={i} href={action.href}>
                <Card className={cn(
                  "glass-card border-none overflow-hidden group cursor-pointer h-full"
                )}>
                  <CardContent className="p-4 flex flex-col gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white",
                      action.color
                    )}>
                      <action.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{action.label}</p>
                      <p className="text-[11px] text-muted-foreground">{action.desc}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all mt-auto" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Election News Feed */}
        <section className="stagger-item">
          <ElectionNewsFeed country={user.country} />
        </section>
      </main>
      <BottomNav />
    </div>
  );
}
