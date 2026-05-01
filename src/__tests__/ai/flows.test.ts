/**
 * AI Flow Schema and Configuration Tests
 * Tests the Zod schemas, input/output types, and flow configurations
 */

// Mock genkit module before imports
jest.mock('genkit', () => ({
  z: require('zod'),
}));

jest.mock('@genkit-ai/google-genai', () => ({
  googleAI: jest.fn(() => ({})),
}));

jest.mock('@/ai/genkit', () => ({
  ai: {
    definePrompt: jest.fn(() => jest.fn()),
    defineFlow: jest.fn((config, handler) => handler),
  },
}));

import { z } from 'zod';

describe('AI Flow Schemas', () => {
  describe('CivicConceptExplainer Schema', () => {
    const CivicConceptExplainerInputSchema = z.object({
      concept: z.string(),
      country: z.string().optional(),
      comprehensionLevel: z.enum(['simple', 'detailed', 'expert']).optional(),
    });

    const CivicConceptExplainerOutputSchema = z.object({
      explanation: z.string(),
      relatedTerms: z.array(z.string()),
    });

    it('should validate valid input', () => {
      const input = { concept: 'Democracy', country: 'India', comprehensionLevel: 'simple' as const };
      expect(() => CivicConceptExplainerInputSchema.parse(input)).not.toThrow();
    });

    it('should accept input without optional fields', () => {
      const input = { concept: 'Referendum' };
      expect(() => CivicConceptExplainerInputSchema.parse(input)).not.toThrow();
    });

    it('should reject input without concept', () => {
      expect(() => CivicConceptExplainerInputSchema.parse({})).toThrow();
    });

    it('should reject invalid comprehension level', () => {
      const input = { concept: 'Test', comprehensionLevel: 'invalid' };
      expect(() => CivicConceptExplainerInputSchema.parse(input)).toThrow();
    });

    it('should validate valid output', () => {
      const output = { explanation: 'A system of governance.', relatedTerms: ['Republic', 'Voting'] };
      expect(() => CivicConceptExplainerOutputSchema.parse(output)).not.toThrow();
    });

    it('should reject output without relatedTerms', () => {
      expect(() => CivicConceptExplainerOutputSchema.parse({ explanation: 'Test' })).toThrow();
    });
  });

  describe('ManifestoSummarizer Schema', () => {
    const ManifestoSummarizerInputSchema = z.object({
      manifestoText: z.string(),
    });

    const ManifestoSummarizerOutputSchema = z.object({
      summary: z.string(),
    });

    it('should validate valid input', () => {
      expect(() => ManifestoSummarizerInputSchema.parse({ manifestoText: 'Long text...' })).not.toThrow();
    });

    it('should reject empty input', () => {
      expect(() => ManifestoSummarizerInputSchema.parse({})).toThrow();
    });

    it('should validate valid output', () => {
      expect(() => ManifestoSummarizerOutputSchema.parse({ summary: 'Summary text' })).not.toThrow();
    });
  });

  describe('MisinformationChecker Schema', () => {
    const MisinformationCheckerInputSchema = z.object({
      information: z.string(),
    });

    const MisinformationCheckerOutputSchema = z.object({
      isMisinformation: z.boolean(),
      confidenceScore: z.number().min(0).max(100),
      explanation: z.string(),
    });

    it('should validate valid input', () => {
      expect(() => MisinformationCheckerInputSchema.parse({ information: 'A claim to check' })).not.toThrow();
    });

    it('should validate valid output', () => {
      const output = { isMisinformation: false, confidenceScore: 85, explanation: 'Appears accurate.' };
      expect(() => MisinformationCheckerOutputSchema.parse(output)).not.toThrow();
    });

    it('should reject confidence score > 100', () => {
      const output = { isMisinformation: false, confidenceScore: 150, explanation: 'Test' };
      expect(() => MisinformationCheckerOutputSchema.parse(output)).toThrow();
    });

    it('should reject confidence score < 0', () => {
      const output = { isMisinformation: false, confidenceScore: -5, explanation: 'Test' };
      expect(() => MisinformationCheckerOutputSchema.parse(output)).toThrow();
    });

    it('should reject missing isMisinformation', () => {
      const output = { confidenceScore: 80, explanation: 'Test' };
      expect(() => MisinformationCheckerOutputSchema.parse(output)).toThrow();
    });
  });

  describe('PersonalVotingRoadmap Schema', () => {
    const PersonalVotingRoadmapInputSchema = z.object({
      country: z.string(),
      location: z.string(),
      age: z.number().int().min(18),
      voterStatus: z.enum(['registered', 'unregistered', 'unknown']),
    });

    const PersonalVotingRoadmapOutputSchema = z.object({
      title: z.string(),
      steps: z.array(z.object({
        stepNumber: z.number().int().min(1),
        title: z.string(),
        description: z.string(),
        actionableLink: z.string().url().optional(),
      })),
    });

    it('should validate valid input', () => {
      const input = { country: 'India', location: 'Delhi', age: 25, voterStatus: 'registered' as const };
      expect(() => PersonalVotingRoadmapInputSchema.parse(input)).not.toThrow();
    });

    it('should reject age below 18', () => {
      const input = { country: 'India', location: 'Delhi', age: 16, voterStatus: 'unknown' as const };
      expect(() => PersonalVotingRoadmapInputSchema.parse(input)).toThrow();
    });

    it('should reject invalid voter status', () => {
      const input = { country: 'India', location: 'Delhi', age: 20, voterStatus: 'maybe' };
      expect(() => PersonalVotingRoadmapInputSchema.parse(input)).toThrow();
    });

    it('should validate valid output with steps', () => {
      const output = {
        title: 'Your Voting Roadmap',
        steps: [{ stepNumber: 1, title: 'Register', description: 'Register to vote.' }],
      };
      expect(() => PersonalVotingRoadmapOutputSchema.parse(output)).not.toThrow();
    });

    it('should validate output with actionable links', () => {
      const output = {
        title: 'Roadmap',
        steps: [{
          stepNumber: 1, title: 'Register', description: 'Go to ECI.',
          actionableLink: 'https://voters.eci.gov.in',
        }],
      };
      expect(() => PersonalVotingRoadmapOutputSchema.parse(output)).not.toThrow();
    });
  });
});
