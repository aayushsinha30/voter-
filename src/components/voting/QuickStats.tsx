'use client';

import { Card, CardContent } from "@/components/ui/card";
import { UserContext } from '@/app/lib/user-store';
import { MapPin, UserCheck, Globe, TrendingUp } from 'lucide-react';

interface QuickStatsProps {
  user: UserContext;
}

export function QuickStats({ user }: QuickStatsProps) {
  const stats = [
    {
      icon: Globe,
      label: 'Country',
      value: user.country,
      gradient: 'from-blue-500/20 to-cyan-500/20',
      iconColor: 'text-blue-400',
      borderColor: 'border-blue-500/20',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: user.location || 'Not set',
      gradient: 'from-primary/20 to-purple-500/20',
      iconColor: 'text-primary',
      borderColor: 'border-primary/20',
    },
    {
      icon: UserCheck,
      label: 'Status',
      value: user.voterStatus === 'registered' ? 'Registered' : user.voterStatus === 'unregistered' ? 'Not Registered' : 'Unknown',
      gradient: user.voterStatus === 'registered' ? 'from-success/20 to-emerald-500/20' : 'from-warning/20 to-orange-500/20',
      iconColor: user.voterStatus === 'registered' ? 'text-success' : 'text-warning',
      borderColor: user.voterStatus === 'registered' ? 'border-success/20' : 'border-warning/20',
    },
    {
      icon: TrendingUp,
      label: 'Age',
      value: `${user.age} yrs`,
      gradient: 'from-accent/20 to-teal-500/20',
      iconColor: 'text-accent',
      borderColor: 'border-accent/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat, i) => (
        <Card key={i} className={`glass-card border-border/20 ${stat.borderColor} overflow-hidden group`}>
          <CardContent className="p-3.5 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shrink-0`}>
              <stat.icon className={`w-4 h-4 ${stat.iconColor}`} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              <p className="text-sm font-bold truncate">{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
