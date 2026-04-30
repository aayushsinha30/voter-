'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, MapPin, BookOpen, ShieldCheck, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Journey', href: '/journey', icon: MapPin },
    { label: 'Learn', href: '/learn', icon: BookOpen },
    { label: 'Tools', href: '/tools', icon: ShieldCheck },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border px-6 py-3 flex justify-between items-center z-50 md:max-w-md md:mx-auto md:rounded-t-2xl md:shadow-2xl">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 transition-colors duration-200",
              isActive ? "text-accent" : "text-muted-foreground hover:text-primary"
            )}
          >
            <Icon className={cn("w-6 h-6", isActive && "fill-current")} />
            <span className="text-[10px] font-medium tracking-wide uppercase">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}