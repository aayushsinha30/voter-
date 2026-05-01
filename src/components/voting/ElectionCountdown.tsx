'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Clock, CalendarDays } from 'lucide-react';

interface CountdownProps {
  country: string;
}

function getNextElectionDate(country: string): { date: Date; name: string } {
  const now = new Date();
  const elections: Record<string, { date: Date; name: string }[]> = {
    'India': [
      { date: new Date('2027-05-01'), name: 'General Elections 2027' },
      { date: new Date('2026-11-15'), name: 'State Assembly Elections' },
    ],
    'United States': [
      { date: new Date('2026-11-03'), name: 'Midterm Elections 2026' },
      { date: new Date('2028-11-05'), name: 'Presidential Election 2028' },
    ],
    'United Kingdom': [
      { date: new Date('2029-07-15'), name: 'General Election 2029' },
    ],
    'Canada': [
      { date: new Date('2029-10-20'), name: 'Federal Election 2029' },
    ],
    'Australia': [
      { date: new Date('2028-05-20'), name: 'Federal Election 2028' },
    ],
  };

  const countryElections = elections[country] || elections['India'];
  const upcoming = countryElections.filter(e => e.date > now).sort((a, b) => a.date.getTime() - b.date.getTime());
  return upcoming[0] || countryElections[0];
}

export function ElectionCountdown({ country }: CountdownProps) {
  const election = getNextElectionDate(country);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = election.date.getTime();
      const diff = Math.max(0, target - now);

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [election.date]);

  const digits = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hrs', value: timeLeft.hours },
    { label: 'Min', value: timeLeft.minutes },
    { label: 'Sec', value: timeLeft.seconds },
  ];

  return (
    <Card className="glass-card-accent border-primary/20 overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <CalendarDays className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Next Election</p>
            <p className="text-sm font-bold">{election.name}</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {digits.map((d, i) => (
            <div key={i} className="text-center">
              <div className="countdown-digit py-3 px-2">
                <span className="text-2xl font-headline font-bold gradient-text">
                  {String(d.value).padStart(2, '0')}
                </span>
              </div>
              <p className="text-[10px] font-semibold text-muted-foreground mt-1.5 uppercase tracking-wider">{d.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2 text-[11px] text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>{election.date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </CardContent>
    </Card>
  );
}
