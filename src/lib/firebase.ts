import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAnalytics, logEvent, isSupported, type Analytics } from 'firebase/analytics';

/**
 * Firebase configuration for VoteWise
 * Uses Google Analytics via Firebase for usage tracking and telemetry.
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '',
  projectId: 'votewise-civic',
  appId: '1:000000000000:web:votewise',
  measurementId: 'G-VOTEWISE',
};

let app: FirebaseApp | null = null;
let analytics: Analytics | null = null;

/**
 * Initialize Firebase app (singleton pattern)
 */
export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    const existingApps = getApps();
    app = existingApps.length > 0 ? existingApps[0] : initializeApp(firebaseConfig);
  }
  return app;
}

/**
 * Initialize Firebase Analytics (client-side only)
 */
export async function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window === 'undefined') return null;
  if (analytics) return analytics;

  try {
    const supported = await isSupported();
    if (supported) {
      const firebaseApp = getFirebaseApp();
      analytics = getAnalytics(firebaseApp);
    }
  } catch (error) {
    console.warn('Firebase Analytics not available:', error);
  }
  return analytics;
}

/**
 * Log a custom analytics event
 */
export async function trackEvent(eventName: string, params?: Record<string, unknown>): Promise<void> {
  try {
    const analyticsInstance = await getFirebaseAnalytics();
    if (analyticsInstance) {
      logEvent(analyticsInstance, eventName, params);
    }
  } catch (error) {
    // Silently fail - analytics should never break the app
    console.debug('Analytics event failed:', eventName, error);
  }
}

/**
 * Predefined analytics events for VoteWise
 */
export const VoteWiseEvents = {
  ONBOARDING_STARTED: 'onboarding_started',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  COUNTRY_SELECTED: 'country_selected',
  QUIZ_STARTED: 'quiz_started',
  QUIZ_COMPLETED: 'quiz_completed',
  QUIZ_QUESTION_ANSWERED: 'quiz_question_answered',
  FACT_CHECK_REQUESTED: 'fact_check_requested',
  FACT_CHECK_COMPLETED: 'fact_check_completed',
  CIVIC_CONCEPT_SEARCHED: 'civic_concept_searched',
  MANIFESTO_SUMMARIZED: 'manifesto_summarized',
  ROADMAP_GENERATED: 'roadmap_generated',
  CHECKLIST_ITEM_TOGGLED: 'checklist_item_toggled',
  PAGE_VIEWED: 'page_viewed',
  AI_SERVICE_ERROR: 'ai_service_error',
} as const;
