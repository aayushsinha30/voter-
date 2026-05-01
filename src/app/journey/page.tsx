'use client';

import { useUserContext } from '@/app/lib/user-store';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import { RoadmapDisplay } from '@/components/voting/RoadmapDisplay';
import { Onboarding } from '@/components/voting/Onboarding';
import { Compass, MapPin } from 'lucide-react';

export default function JourneyPage() {
  const { user, saveUser, loading } = useUserContext();

  if (loading) return null;
  
  if (!user || !user.country) return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <Onboarding onComplete={saveUser} />
    </main>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <TopBar />
      <main className="px-5 py-6 space-y-6 pb-28">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/20">
            <Compass className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-headline">Your Journey</h2>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <MapPin className="w-3 h-3" /> AI-generated roadmap for {user.location}, {user.country}
            </p>
          </div>
        </div>
        <RoadmapDisplay user={user} />
      </main>
      <BottomNav />
    </div>
  );
}
