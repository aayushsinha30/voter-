'use client';

import { Progress } from "@/components/ui/progress";
import { usePathname } from 'next/navigation';

export function TopBar() {
  const pathname = usePathname();
  
  const getProgress = () => {
    if (pathname === '/') return 25;
    if (pathname === '/journey') return 60;
    if (pathname === '/learn') return 85;
    if (pathname === '/tools') return 100;
    return 0;
  };

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md px-6 py-4 flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-headline text-primary">VoteWise</h1>
        <div className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded">
          {Math.round(getProgress())}% Ready
        </div>
      </div>
      <Progress value={getProgress()} className="h-1 bg-secondary [&>div]:bg-accent transition-all" />
    </header>
  );
}