'use client';

import { Progress } from "@/components/ui/progress";
import { usePathname } from 'next/navigation';
import { useUserContext } from '@/app/lib/user-store';
import { Vote, Settings, RotateCcw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function TopBar() {
  const pathname = usePathname();
  const { user, resetUser } = useUserContext();
  
  const getProgress = () => {
    if (pathname === '/') return 20;
    if (pathname === '/journey') return 40;
    if (pathname === '/learn') return 60;
    if (pathname === '/tools') return 80;
    if (pathname === '/quiz') return 100;
    return 0;
  };

  const progress = getProgress();

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/60 border-b border-border/30">
      <div className="px-6 py-3 flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Vote className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg font-headline gradient-text font-bold">VoteWise</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-[11px] font-semibold text-muted-foreground bg-secondary/80 px-3 py-1.5 rounded-full border border-border/50">
              <span className="gradient-text">{Math.round(progress)}%</span> Ready
            </div>
            {user?.onboarded && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-secondary">
                    <Settings className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass-card border-border/50">
                  <DropdownMenuItem onClick={resetUser} className="text-destructive focus:text-destructive cursor-pointer">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset Profile
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
        <div className="relative h-1 bg-secondary/50 rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </header>
  );
}