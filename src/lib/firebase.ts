import { type FirebaseApp } from 'firebase/app';
import { type Analytics } from 'firebase/analytics';

/**
 * Hard-Disabled Firebase Configuration
 * To prevent client-side crashes on the Quiz page caused by expired/invalid API keys.
 * The app now runs in "Offline Mode" for analytics.
 */
const isFirebaseConfigured = false;

export function getFirebaseApp(): FirebaseApp | null {
  return null;
}

export async function getFirebaseAnalytics(): Promise<Analytics | null> {
  return null;
}

export async function trackEvent(eventName: string, params?: Record<string, unknown>): Promise<void> {
  // No-op: Analytics is disabled to prevent crashes
  console.debug('Analytics Disabled:', eventName, params);
}

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
