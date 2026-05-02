import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAnalytics, logEvent, isSupported, type Analytics } from 'firebase/analytics';

/**
 * Firebase configuration for VoteWise
 * Uses Google Analytics via Firebase for usage tracking and telemetry.
 */
const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '';
const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '';
const FIREBASE_APP_ID = process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '';

/**
 * Firebase configuration for VoteWise
 * Uses Google Analytics via Firebase for usage tracking and telemetry.
 * All values are optional - app works fully without Firebase.
 */
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  projectId: FIREBASE_PROJECT_ID || 'votewise-civic',
  appId: FIREBASE_APP_ID || '1:000000000000:web:votewise',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || '',
};

// Only initialize Firebase if we have a real API key
const isFirebaseConfigured = Boolean(FIREBASE_API_KEY && FIREBASE_API_KEY.length > 20 && !FIREBASE_APP_ID.includes('000000000000'));

let app: FirebaseApp | null = null;
let analytics: Analytics | null = null;

/**
 * Initialize Firebase app (singleton pattern)
 * Returns null safely if not configured
 */
export function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured) return null;
  if (!app) {
    try {
      const existingApps = getApps();
      app = existingApps.length > 0 ? existingApps[0] : initializeApp(firebaseConfig);
    } catch (error) {
      console.warn('Firebase app initialization failed:', error);
      return null;
    }
  }
  return app;
}

/**
 * Initialize Firebase Analytics (client-side only)
 */
export async function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window === 'undefined') return null;
  if (!isFirebaseConfigured) return null;
  if (analytics) return analytics;

  try {
    const supported = await isSupported();
    if (supported) {
      const firebaseApp = getFirebaseApp();
      if (firebaseApp) {
        analytics = getAnalytics(firebaseApp);
      }
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
