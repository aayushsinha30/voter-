'use server';
/**
 * @fileOverview A GenAI agent that explains complex civic concepts in simple language.
 *
 * - explainCivicConcept - A function that handles the civic concept explanation process.
 * - CivicConceptExplainerInput - The input type for the explainCivicConcept function.
 * - CivicConceptExplainerOutput - The return type for the explainCivicConcept function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CivicConceptExplainerInputSchema = z.object({
  concept: z.string().describe('The complex civic concept to be explained.'),
  comprehensionLevel: z
    .enum(['simple', 'detailed', 'expert'])
    .optional()
    .describe(
      'The desired comprehension level for the explanation (e.g., "simple" for a basic overview, "detailed" for more depth, "expert" for advanced explanations).'
    ),
});
export type CivicConceptExplainerInput = z.infer<
  typeof CivicConceptExplainerInputSchema
>;

const CivicConceptExplainerOutputSchema = z.object({
  explanation: z.string().describe('A simple, easy-to-understand explanation of the civic concept.'),
  relatedTerms: z
    .array(z.string())
    .describe('A list of related terms or concepts that might aid further understanding.'),
});
export type CivicConceptExplainerOutput = z.infer<
  typeof CivicConceptExplainerOutputSchema
>;

export async function explainCivicConcept(
  input: CivicConceptExplainerInput
): Promise<CivicConceptExplainerOutput> {
  return civicConceptExplainerFlow(input);
}

const civicConceptExplainerPrompt = ai.definePrompt({
  name: 'civicConceptExplainerPrompt',
  input: {schema: CivicConceptExplainerInputSchema},
  output: {schema: CivicConceptExplainerOutputSchema},
  prompt: `You are an AI assistant specialized in explaining complex civic concepts in simple, easy-to-understand language. Your goal is to make political processes and terminology accessible to everyone, helping users make informed voting decisions.\n\nPlease explain the following civic concept: "{{{concept}}}}".\n\n{{#if comprehensionLevel}}\nAdapt the explanation to a "{{{comprehensionLevel}}}" comprehension level.\n{{else}}\nProvide a simple explanation suitable for a general audience.\n{{/if}}\n\nAfter explaining the concept, provide a list of related terms or concepts that someone might find useful for further understanding.\n\nPlease ensure the explanation is neutral, objective, and avoids jargon where possible. Focus on clarity and conciseness.`,
});

const civicConceptExplainerFlow = ai.defineFlow(
  {
    name: 'civicConceptExplainerFlow',
    inputSchema: CivicConceptExplainerInputSchema,
    outputSchema: CivicConceptExplainerOutputSchema,
  },
  async input => {
    const {output} = await civicConceptExplainerPrompt(input);
    return output!;
  }
);
