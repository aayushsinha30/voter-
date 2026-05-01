'use client';

import { useState, useEffect } from 'react';

export interface UserContext {
  country: string;
  location: string;
  age: number;
  voterStatus: 'registered' | 'unregistered' | 'unknown';
  onboarded: boolean;
}

const STORAGE_KEY = 'votewise_user_context';

export function useUserContext() {
  const [user, setUser] = useState<UserContext | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setUser(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  const saveUser = (data: UserContext) => {
    setUser(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const resetUser = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return { user, saveUser, resetUser, loading };
}
