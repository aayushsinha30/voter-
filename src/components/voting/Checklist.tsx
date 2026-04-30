'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { FileCheck, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Checklist() {
  const [items, setItems] = useState([
    { id: 1, label: 'Valid Photo ID (Driver License, Passport, etc.)', checked: false, critical: true },
    { id: 2, label: 'Proof of Residence (Utility bill, bank statement)', checked: false, critical: true },
    { id: 3, label: 'Voter Registration Card (Optional but helpful)', checked: false, critical: false },
    { id: 4, label: 'Polling Location Address saved', checked: false, critical: true },
    { id: 5, label: 'Plan for transport to the polls', checked: false, critical: false },
  ]);

  const toggle = (id: number) => {
    setItems(items.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const completedCount = items.filter(i => i.checked).length;
  const progress = (completedCount / items.length) * 100;

  return (
    <Card className="border-none shadow-md overflow-hidden">
      <CardHeader className="bg-secondary/20">
        <div className="flex justify-between items-center mb-2">
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-success" />
            Readiness Checklist
          </CardTitle>
          <Badge variant="outline" className={cn(
            progress === 100 ? "bg-success/10 text-success border-success" : "text-muted-foreground"
          )}>
            {completedCount}/{items.length} Done
          </Badge>
        </div>
        <CardDescription>Essential documents and tasks for your voting day.</CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        {items.map(item => (
          <div key={item.id} className="flex items-start space-x-3 group cursor-pointer" onClick={() => toggle(item.id)}>
            <Checkbox checked={item.checked} className="mt-1 h-5 w-5 data-[state=checked]:bg-success data-[state=checked]:border-success" />
            <div className="grid gap-1.5 leading-none">
              <label className={cn(
                "text-sm font-medium leading-none cursor-pointer group-hover:text-primary transition-colors",
                item.checked && "line-through text-muted-foreground"
              )}>
                {item.label}
              </label>
              {item.critical && !item.checked && (
                <span className="text-[10px] flex items-center gap-1 text-warning font-bold uppercase tracking-tight">
                  <AlertCircle className="w-3 h-3" /> Required in most states
                </span>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}