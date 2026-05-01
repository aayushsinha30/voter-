import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

/**
 * Genkit AI configuration for VoteWise
 * Uses Google Gemini 2.0 Flash for fast, efficient AI responses.
 * The API key is read from GOOGLE_GENAI_API_KEY or GOOGLE_API_KEY environment variables.
 */
const apiKey = process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;

export const ai = genkit({
  plugins: [googleAI(apiKey ? { apiKey } : undefined)],
  model: 'googleai/gemini-2.0-flash',
});
