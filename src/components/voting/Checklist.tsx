'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { FileCheck, AlertCircle, CheckCircle2, Shield } from 'lucide-react';
import { useUserContext } from '@/app/lib/user-store';
import { cn } from '@/lib/utils';

export function Checklist() {
  const { user } = useUserContext();
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (user?.country === 'India') {
      setItems([
        { id: 1, label: 'EPIC Card (Voter ID) or Aadhaar Card', checked: false, critical: true },
        { id: 2, label: 'Voter Information Slip (from ECI portal)', checked: false, critical: true },
        { id: 3, label: 'Check Polling Station Location', checked: false, critical: true },
        { id: 4, label: 'Check name on Electoral Roll (voters.eci.gov.in)', checked: false, critical: true },
        { id: 5, label: 'Identify candidate for your constituency', checked: false, critical: false },
      ]);
    } else {
      setItems([
        { id: 1, label: 'Valid Photo ID (Driver License, Passport)', checked: false, critical: true },
        { id: 2, label: 'Proof of Residence (Utility bill, bank statement)', checked: false, critical: true },
        { id: 3, label: 'Voter Registration Card', checked: false, critical: false },
        { id: 4, label: 'Polling Location Address saved', checked: false, critical: true },
        { id: 5, label: 'Plan for transport to the polls', checked: false, critical: false },
      ]);
    }
  }, [user]);

  const toggle = (id: number) => {
    setItems(items.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const completedCount = items.filter(i => i.checked).length;
  const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0;

  return (
    <Card className="glass-card border-border/30 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center mb-1">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-success/20 to-success/5 flex items-center justify-center border border-success/20">
              <Shield className="w-4 h-4 text-success" />
            </div>
            Readiness Checklist
          </CardTitle>
          <Badge variant="outline" className={cn(
            "rounded-full px-3 py-1 text-[10px] font-bold border",
            progress === 100
              ? "bg-success/10 text-success border-success/30 badge-glow"
              : "text-muted-foreground border-border/50"
          )}>
            {completedCount}/{items.length}
          </Badge>
        </div>
        <CardDescription className="text-xs">Essential documents for {user?.country || 'your area'}.</CardDescription>
        {/* Progress Bar */}
        <div className="mt-3 h-1.5 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${progress}%`,
              background: progress === 100
                ? 'hsl(var(--success))'
                : 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))'
            }}
          />
        </div>
      </CardHeader>
      <CardContent className="pt-2 space-y-1">
        {items.map(item => (
          <div
            key={item.id}
            className={cn(
              "flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all group hover:bg-secondary/30",
              item.checked && "opacity-60"
            )}
            onClick={() => toggle(item.id)}
          >
            <Checkbox
              checked={item.checked}
              className={cn(
                "mt-0.5 h-5 w-5 rounded-md border-border/50 transition-all",
                item.checked && "data-[state=checked]:bg-success data-[state=checked]:border-success"
              )}
            />
            <div className="grid gap-1 leading-none">
              <label className={cn(
                "text-sm font-medium leading-snug cursor-pointer group-hover:text-foreground transition-colors",
                item.checked && "line-through text-muted-foreground"
              )}>
                {item.label}
              </label>
              {item.critical && !item.checked && (
                <span className="text-[10px] flex items-center gap-1 text-warning font-bold uppercase tracking-tight">
                  <AlertCircle className="w-3 h-3" /> Required
                </span>
              )}
              {item.checked && (
                <span className="text-[10px] flex items-center gap-1 text-success font-medium">
                  <CheckCircle2 className="w-3 h-3" /> Done
                </span>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
