'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Newspaper, ExternalLink, Clock } from 'lucide-react';

interface ElectionNewsFeedProps {
  country: string;
}

const NEWS_DATA: Record<string, Array<{ title: string; source: string; time: string; url: string; tag: string }>> = {
  'India': [
    { title: 'ECI announces updated voter registration guidelines for 2027', source: 'The Hindu', time: '2h ago', url: '#', tag: 'Official' },
    { title: 'Digital Voter ID now accepted at all polling stations nationwide', source: 'NDTV', time: '5h ago', url: '#', tag: 'Policy' },
    { title: 'New constituencies formed under latest delimitation exercise', source: 'Indian Express', time: '1d ago', url: '#', tag: 'Updates' },
  ],
  'United States': [
    { title: 'Voter registration deadlines updated for 2026 midterms', source: 'AP News', time: '3h ago', url: '#', tag: 'Official' },
    { title: 'New early voting locations announced across swing states', source: 'Reuters', time: '6h ago', url: '#', tag: 'Policy' },
    { title: 'Mail-in ballot guidelines simplified in 12 states', source: 'NPR', time: '1d ago', url: '#', tag: 'Updates' },
  ],
  default: [
    { title: 'Global democracy index shows improvement in voter turnout', source: 'Reuters', time: '4h ago', url: '#', tag: 'Global' },
    { title: 'Digital voting reforms discussed at international summit', source: 'BBC', time: '8h ago', url: '#', tag: 'Policy' },
    { title: 'Youth voter engagement reaches record highs worldwide', source: 'Al Jazeera', time: '1d ago', url: '#', tag: 'Trends' },
  ],
};

const TAG_COLORS: Record<string, string> = {
  'Official': 'bg-primary/10 text-primary border-primary/20',
  'Policy': 'bg-accent/10 text-accent border-accent/20',
  'Updates': 'bg-info/10 text-blue-400 border-blue-400/20',
  'Global': 'bg-purple-500/10 text-purple-400 border-purple-400/20',
  'Trends': 'bg-success/10 text-success border-success/20',
};

export function ElectionNewsFeed({ country }: ElectionNewsFeedProps) {
  const news = NEWS_DATA[country] || NEWS_DATA['default'];

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-headline uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
        <div className="w-1 h-4 rounded-full bg-gradient-to-b from-primary to-accent" />
        Election News
      </h3>
      <div className="space-y-2">
        {news.map((item, i) => (
          <a key={i} href={item.url} className="block">
            <Card className="glass-card border-border/20 news-card">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-secondary/80 flex items-center justify-center shrink-0 mt-0.5">
                  <Newspaper className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0 space-y-1.5">
                  <p className="text-sm font-medium leading-snug line-clamp-2">{item.title}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${TAG_COLORS[item.tag] || TAG_COLORS['Updates']}`}>
                      {item.tag}
                    </span>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {item.time}
                    </span>
                    <span className="text-[10px] text-muted-foreground">· {item.source}</span>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-1" />
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
}
