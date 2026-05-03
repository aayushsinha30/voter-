/**
 * GHOST MODE Firebase Configuration
 * Completely stripped of all Firebase SDK imports to prevent client-side crashes.
 * The app now runs in 100% "Offline Mode" for analytics.
 */

export function getFirebaseApp(): any {
  return null;
}

export async function getFirebaseAnalytics(): Promise<any> {
  return null;
}

export async function trackEvent(eventName: string, params?: Record<string, unknown>): Promise<void> {
  // No-op: All background tracking is strictly disabled to guarantee stability
  console.log('Analytics Suppressed:', eventName, params);
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
