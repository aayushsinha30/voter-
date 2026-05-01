'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UserContext } from '@/app/lib/user-store';
import { MapPin, User as UserIcon, Calendar, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OnboardingProps {
  onComplete: (data: UserContext) => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserContext>>({
    location: '',
    age: 18,
    voterStatus: 'unknown',
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = () => {
    onComplete({
      location: formData.location || 'Unknown',
      age: Number(formData.age) || 18,
      voterStatus: formData.voterStatus as any,
      onboarded: true,
    });
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-lg mx-auto p-4">
      <div className="flex justify-center mb-4">
        <div className="flex gap-2">
          {[1, 2, 3].map(i => (
            <div key={i} className={`w-12 h-1.5 rounded-full transition-colors ${i <= step ? 'bg-accent' : 'bg-muted'}`} />
          ))}
        </div>
      </div>

      {step === 1 && (
        <Card className="border-none shadow-xl">
          <CardHeader>
            <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center mb-4 text-primary">
              <MapPin className="w-6 h-6" />
            </div>
            <CardTitle className="text-2xl">Where do you vote?</CardTitle>
            <CardDescription>Knowing your location helps us find local candidates and polling places.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="location">City and State (or Zip Code)</Label>
              <Input 
                id="location" 
                placeholder="e.g. Austin, TX" 
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="h-12 text-lg"
              />
            </div>
            <Button className="w-full h-12 bg-accent text-lg btn-scale" onClick={nextStep} disabled={!formData.location}>
              Continue
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card className="border-none shadow-xl">
          <CardHeader>
            <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center mb-4 text-primary">
              <Calendar className="w-6 h-6" />
            </div>
            <CardTitle className="text-2xl">A little bit about you</CardTitle>
            <CardDescription>Age matters for certain registration deadlines and voting requirements.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="age">How old are you?</Label>
              <Input 
                id="age" 
                type="number"
                min={18}
                max={120}
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})}
                className="h-12 text-lg"
              />
            </div>
            <div className="flex gap-4">
              <Button variant="outline" className="flex-1 h-12 text-lg" onClick={prevStep}>Back</Button>
              <Button className="flex-1 h-12 bg-accent text-lg btn-scale" onClick={nextStep}>Continue</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card className="border-none shadow-xl">
          <CardHeader>
            <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center mb-4 text-primary">
              <UserIcon className="w-6 h-6" />
            </div>
            <CardTitle className="text-2xl">Voter Status</CardTitle>
            <CardDescription>Are you currently registered to vote in your area?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup 
              value={formData.voterStatus} 
              onValueChange={(val) => setFormData({...formData, voterStatus: val as any})}
              className="grid gap-4"
            >
              {[
                { id: 'registered', label: 'Yes, I am registered' },
                { id: 'unregistered', label: 'No, not yet' },
                { id: 'unknown', label: 'I am not sure' }
              ].map(item => (
                <Label
                  key={item.id}
                  htmlFor={item.id}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer",
                    formData.voterStatus === item.id ? "border-accent bg-accent/5 ring-1 ring-accent" : "border-border hover:border-accent/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value={item.id} id={item.id} />
                    <span className="text-lg font-medium">{item.label}</span>
                  </div>
                </Label>
              ))}
            </RadioGroup>
            <div className="flex gap-4 pt-4">
              <Button variant="outline" className="flex-1 h-12 text-lg" onClick={prevStep}>Back</Button>
              <Button className="flex-1 h-12 bg-accent text-lg btn-scale" onClick={handleSubmit}>
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Get Roadmap
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
