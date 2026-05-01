'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserContext } from '@/app/lib/user-store';
import { MapPin, User as UserIcon, Calendar, CheckCircle2, Globe, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OnboardingProps {
  onComplete: (data: UserContext) => void;
}

const COUNTRIES = [
  { value: 'India', label: '🇮🇳 India', flag: '🇮🇳' },
  { value: 'United States', label: '🇺🇸 United States', flag: '🇺🇸' },
  { value: 'United Kingdom', label: '🇬🇧 United Kingdom', flag: '🇬🇧' },
  { value: 'Canada', label: '🇨🇦 Canada', flag: '🇨🇦' },
  { value: 'Australia', label: '🇦🇺 Australia', flag: '🇦🇺' },
  { value: 'Germany', label: '🇩🇪 Germany', flag: '🇩🇪' },
  { value: 'France', label: '🇫🇷 France', flag: '🇫🇷' },
  { value: 'Brazil', label: '🇧🇷 Brazil', flag: '🇧🇷' },
  { value: 'Japan', label: '🇯🇵 Japan', flag: '🇯🇵' },
  { value: 'South Korea', label: '🇰🇷 South Korea', flag: '🇰🇷' },
];

const STEP_INFO = [
  { icon: Globe, title: 'Select your country', desc: 'Voting rules vary by nation. Tell us where you\'re voting from.' },
  { icon: MapPin, title: 'Where do you live?', desc: 'Your city helps us find local candidates and polling booths.' },
  { icon: Calendar, title: 'A bit about you', desc: 'Your age determines eligibility and registration routes.' },
  { icon: UserIcon, title: 'Voter Status', desc: 'Are you registered on the electoral roll?' },
];

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserContext>>({
    country: 'India',
    location: '',
    age: 18,
    voterStatus: 'unknown',
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = () => {
    onComplete({
      country: formData.country || 'India',
      location: formData.location || 'Unknown',
      age: Number(formData.age) || 18,
      voterStatus: formData.voterStatus as any,
      onboarded: true,
    });
  };

  const currentInfo = STEP_INFO[step - 1];

  return (
    <div className="flex flex-col gap-6 max-w-lg mx-auto p-4 w-full">
      {/* Step Progress */}
      <div className="flex justify-center mb-2">
        <div className="flex gap-2 items-center">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex items-center gap-2">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500",
                i < step
                  ? "bg-gradient-to-br from-primary to-accent text-white scale-90"
                  : i === step
                  ? "bg-gradient-to-br from-primary to-accent text-white glow-primary scale-110"
                  : "bg-secondary text-muted-foreground"
              )}>
                {i < step ? '✓' : i}
              </div>
              {i < 4 && (
                <div className={cn(
                  "w-8 h-0.5 rounded-full transition-colors duration-500",
                  i < step ? "bg-gradient-to-r from-primary to-accent" : "bg-secondary"
                )} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Card */}
      <Card className="glass-card border-border/30 shadow-2xl overflow-hidden">
        <CardHeader className="pb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 border border-primary/20">
            <currentInfo.icon className="w-7 h-7 text-primary" />
          </div>
          <CardTitle className="text-2xl">{currentInfo.title}</CardTitle>
          <CardDescription className="text-muted-foreground">{currentInfo.desc}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-2">
              <Label htmlFor="country" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Country</Label>
              <Select value={formData.country} onValueChange={(val) => setFormData({...formData, country: val})}>
                <SelectTrigger className="h-12 text-base bg-secondary/50 border-border/50 rounded-xl">
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent className="glass-card border-border/50">
                  {COUNTRIES.map(c => (
                    <SelectItem key={c.value} value={c.value} className="cursor-pointer">{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-2">
              <Label htmlFor="location" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">City, State or District</Label>
              <Input 
                id="location" 
                placeholder={formData.country === 'India' ? "e.g. Mumbai, Maharashtra" : "e.g. Austin, TX"} 
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="h-12 text-base bg-secondary/50 border-border/50 rounded-xl"
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-2">
              <Label htmlFor="age" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Your Age</Label>
              <Input 
                id="age" 
                type="number"
                min={16}
                max={120}
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})}
                className="h-12 text-base bg-secondary/50 border-border/50 rounded-xl"
              />
            </div>
          )}

          {step === 4 && (
            <RadioGroup 
              value={formData.voterStatus} 
              onValueChange={(val) => setFormData({...formData, voterStatus: val as any})}
              className="grid gap-3"
            >
              {[
                { id: 'registered', label: 'Yes, I am registered', emoji: '✅' },
                { id: 'unregistered', label: 'No, not yet', emoji: '📝' },
                { id: 'unknown', label: 'I am not sure', emoji: '🤔' }
              ].map(item => (
                <Label
                  key={item.id}
                  htmlFor={item.id}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer",
                    formData.voterStatus === item.id
                      ? "border-primary bg-primary/5 ring-1 ring-primary glow-primary"
                      : "border-border/50 bg-secondary/30 hover:border-primary/30"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value={item.id} id={item.id} />
                    <span className="text-base font-medium">{item.emoji} {item.label}</span>
                  </div>
                </Label>
              ))}
            </RadioGroup>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            {step > 1 && (
              <Button variant="outline" className="flex-1 h-12 text-base rounded-xl border-border/50 bg-secondary/30" onClick={prevStep}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            {step < 4 ? (
              <Button
                className="flex-1 h-12 text-base rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 btn-scale btn-glow"
                onClick={nextStep}
                disabled={step === 2 && !formData.location}
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                className="flex-1 h-12 text-base rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 btn-scale btn-glow"
                onClick={handleSubmit}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Launch My Roadmap
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
