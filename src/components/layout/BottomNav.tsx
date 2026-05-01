'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, BookOpen, ShieldCheck, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Journey', href: '/journey', icon: Compass },
    { label: 'Learn', href: '/learn', icon: BookOpen },
    { label: 'Tools', href: '/tools', icon: ShieldCheck },
    { label: 'Quiz', href: '/quiz', icon: Trophy },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-2xl mx-auto px-4 pb-2">
        <div className="glass-card flex justify-between items-center px-3 py-2.5 border border-border/50">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-300 relative group",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-primary/10 rounded-xl" />
                )}
                <Icon className={cn(
                  "w-5 h-5 relative z-10 transition-transform duration-300",
                  isActive && "scale-110"
                )} />
                <span className={cn(
                  "text-[10px] font-semibold tracking-wider uppercase relative z-10",
                  isActive && "gradient-text"
                )}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-gradient-to-r from-primary to-accent" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}