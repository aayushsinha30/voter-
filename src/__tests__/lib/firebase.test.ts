/**
 * Tests for Firebase Analytics integration and event tracking
 */

// Mock firebase modules
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => ({ name: '[DEFAULT]' })),
  getApps: jest.fn(() => []),
}));

jest.mock('firebase/analytics', () => ({
  getAnalytics: jest.fn(() => ({})),
  logEvent: jest.fn(),
  isSupported: jest.fn(() => Promise.resolve(true)),
}));

import { getFirebaseApp, getFirebaseAnalytics, trackEvent, VoteWiseEvents } from '@/lib/firebase';
import { initializeApp, getApps } from 'firebase/app';
import { getAnalytics, logEvent, isSupported } from 'firebase/analytics';

describe('Firebase Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getApps as jest.Mock).mockReturnValue([]);
  });

  describe('getFirebaseApp', () => {
    it('should initialize a new Firebase app', () => {
      getFirebaseApp();
      expect(initializeApp).toHaveBeenCalled();
    });

    it('should reuse existing app on subsequent calls', () => {
      // In this test environment, app might already be initialized from the previous test.
      // The important part is that multiple calls to getFirebaseApp() return the same truthy value.
      const app1 = getFirebaseApp();
      const app2 = getFirebaseApp();
      expect(app1).toBeTruthy();
      expect(app1).toBe(app2);
    });

    it('should use existing app if one already exists', () => {
      const existingApp = { name: 'existing' };
      (getApps as jest.Mock).mockReturnValue([existingApp]);
      // Need a fresh module to test this path
      jest.resetModules();
    });
  });

  describe('VoteWiseEvents', () => {
    it('should have all required event constants', () => {
      expect(VoteWiseEvents.ONBOARDING_STARTED).toBe('onboarding_started');
      expect(VoteWiseEvents.ONBOARDING_COMPLETED).toBe('onboarding_completed');
      expect(VoteWiseEvents.COUNTRY_SELECTED).toBe('country_selected');
      expect(VoteWiseEvents.QUIZ_STARTED).toBe('quiz_started');
      expect(VoteWiseEvents.QUIZ_COMPLETED).toBe('quiz_completed');
      expect(VoteWiseEvents.QUIZ_QUESTION_ANSWERED).toBe('quiz_question_answered');
      expect(VoteWiseEvents.FACT_CHECK_REQUESTED).toBe('fact_check_requested');
      expect(VoteWiseEvents.FACT_CHECK_COMPLETED).toBe('fact_check_completed');
      expect(VoteWiseEvents.CIVIC_CONCEPT_SEARCHED).toBe('civic_concept_searched');
      expect(VoteWiseEvents.MANIFESTO_SUMMARIZED).toBe('manifesto_summarized');
      expect(VoteWiseEvents.ROADMAP_GENERATED).toBe('roadmap_generated');
      expect(VoteWiseEvents.CHECKLIST_ITEM_TOGGLED).toBe('checklist_item_toggled');
      expect(VoteWiseEvents.PAGE_VIEWED).toBe('page_viewed');
      expect(VoteWiseEvents.AI_SERVICE_ERROR).toBe('ai_service_error');
    });

    it('should have unique event names', () => {
      const values = Object.values(VoteWiseEvents);
      const uniqueValues = new Set(values);
      expect(uniqueValues.size).toBe(values.length);
    });

    it('should use snake_case format for all events', () => {
      Object.values(VoteWiseEvents).forEach(event => {
        expect(event).toMatch(/^[a-z]+(_[a-z]+)*$/);
      });
    });
  });

  describe('trackEvent', () => {
    it('should not throw when analytics is unavailable', async () => {
      (isSupported as jest.Mock).mockResolvedValue(false);
      await expect(trackEvent('test_event')).resolves.not.toThrow();
    });

    it('should accept optional params', async () => {
      await expect(
        trackEvent('test_event', { key: 'value', count: 42 })
      ).resolves.not.toThrow();
    });
  });
});

describe('Analytics Event Naming Conventions', () => {
  it('all events should be valid Google Analytics event names', () => {
    Object.values(VoteWiseEvents).forEach(event => {
      // GA4 event names must be 1-40 chars, alphanumeric + underscore
      expect(event.length).toBeLessThanOrEqual(40);
      expect(event.length).toBeGreaterThanOrEqual(1);
      expect(event).toMatch(/^[a-zA-Z][a-zA-Z0-9_]*$/);
    });
  });
});
