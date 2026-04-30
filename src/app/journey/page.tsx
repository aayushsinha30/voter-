'use client';

import { useUserContext } from '@/app/lib/user-store';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import { RoadmapDisplay } from '@/components/voting/RoadmapDisplay';
import { Onboarding } from '@/components/voting/Onboarding';

export default function JourneyPage() {
  const { user, saveUser, loading } = useUserContext();

  if (loading) return null;
  if (!user) return <Onboarding onComplete={saveUser} />;

  return (
    <div className="max-w-2xl mx-auto">
      <TopBar />
      <main className="px-6 py-8 space-y-8 pb-32">
        <RoadmapDisplay user={user} />
      </main>
      <BottomNav />
    </div>
  );
}