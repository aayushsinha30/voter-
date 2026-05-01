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
  country: z.string().optional().describe('The country context for the explanation (e.g., India, USA).'),
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
  prompt: `You are an AI assistant specialized in explaining complex civic concepts in simple, easy-to-understand language.

Concept: "{{{concept}}}"
{{#if country}}
Country Context: {{{country}}}
{{/if}}

Instructions:
1. Explain the concept clearly. 
2. If a country context is provided, explain how this concept specifically applies or works in that country (e.g., if India, mention the Lok Sabha or Rajya Sabha if relevant).
3. Adapting to level: {{#if comprehensionLevel}}{{{comprehensionLevel}}}{{else}}simple{{/if}}.
4. Provide a list of related terms that are relevant to the user's country if possible.

Maintain a neutral, objective, and jargon-free tone.`,
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
