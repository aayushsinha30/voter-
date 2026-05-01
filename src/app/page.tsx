'use client';

import { useUserContext } from '@/app/lib/user-store';
import { Onboarding } from '@/components/voting/Onboarding';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import { Checklist } from '@/components/voting/Checklist';
import { Card, CardContent } from '@/components/ui/card';
import { Bell, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Home() {
  const { user, saveUser, loading } = useUserContext();

  if (loading) return null;

  if (!user || !user.onboarded) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-headline text-primary mb-2">VoteWise</h1>
          <p className="text-muted-foreground">Your personalized civic roadmap to an informed vote.</p>
        </div>
        <Onboarding onComplete={(data) => saveUser(data)} />
      </main>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <TopBar />
      <main className="px-6 py-8 space-y-8 pb-32 animate-in fade-in duration-500">
        <section className="space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-headline">Welcome back</h2>
              <p className="text-muted-foreground">Status: {user.voterStatus === 'registered' ? 'Registered to vote' : 'Needs attention'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="border-none bg-accent text-white shadow-lg btn-scale">
              <CardContent className="p-4 flex flex-col gap-2">
                <Bell className="w-6 h-6" />
                <span className="font-bold text-lg">Next Window</span>
                <span className="text-sm opacity-90">Registration Open</span>
              </CardContent>
            </Card>
            <Card className="border-none bg-primary text-white shadow-lg btn-scale">
              <CardContent className="p-4 flex flex-col gap-2">
                <MapPin className="w-6 h-6" />
                <span className="font-bold text-lg">Electoral Area</span>
                <span className="text-sm opacity-90">{user.location}</span>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-headline uppercase tracking-widest text-muted-foreground">Readiness</h3>
          <Checklist />
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-headline uppercase tracking-widest text-muted-foreground">Election Phases</h3>
          <div className="space-y-3">
            {[
              { label: 'Phase 1: Voter Awareness', date: 'Ongoing', active: true },
              { label: 'Phase 2: Nomination Review', date: 'Upcoming', active: false },
              { label: 'Phase 3: Polling Day', date: 'TBD', active: false }
            ].map((item, i) => (
              <div key={i} className={cn(
                "flex items-center gap-4 p-4 rounded-xl border transition-all",
                item.active ? "bg-white border-accent shadow-sm" : "bg-secondary/50 border-border opacity-60"
              )}>
                <div className={cn(
                  "w-12 h-12 rounded-lg flex flex-col items-center justify-center font-bold text-xs",
                  item.active ? "bg-accent text-white" : "bg-muted text-muted-foreground"
                )}>
                  <span>{item.date}</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{user.country}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <BottomNav />
    </div>
  );
}
