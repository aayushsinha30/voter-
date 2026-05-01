'use client';

import { useEffect, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { trackEvent, VoteWiseEvents } from '@/lib/firebase';

/**
 * Custom hook for Google Analytics tracking via Firebase.
 * Automatically tracks page views and provides a method for custom events.
 */
export function useAnalytics() {
  const pathname = usePathname();
  const prevPathname = useRef<string | null>(null);

  // Track page views on route changes
  useEffect(() => {
    if (pathname && pathname !== prevPathname.current) {
      prevPathname.current = pathname;
      trackEvent(VoteWiseEvents.PAGE_VIEWED, {
        page_path: pathname,
        page_title: document.title,
        timestamp: new Date().toISOString(),
      });
    }
  }, [pathname]);

  // Memoized event tracker
  const track = useCallback((eventName: string, params?: Record<string, unknown>) => {
    trackEvent(eventName, {
      ...params,
      page_path: pathname,
      timestamp: new Date().toISOString(),
    });
  }, [pathname]);

  return { track, events: VoteWiseEvents };
}
