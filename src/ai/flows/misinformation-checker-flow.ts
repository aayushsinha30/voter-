'use server';
/**
 * @fileOverview A Genkit flow for checking user-provided information against trusted knowledge for misinformation.
 *
 * - checkMisinformation - A function that handles the misinformation checking process.
 * - MisinformationCheckerInput - The input type for the checkMisinformation function.
 * - MisinformationCheckerOutput - The return type for the checkMisinformation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MisinformationCheckerInputSchema = z.object({
  information: z
    .string()
    .describe('The news article, social media post, or statement to check for misinformation.'),
});
export type MisinformationCheckerInput = z.infer<typeof MisinformationCheckerInputSchema>;

const MisinformationCheckerOutputSchema = z.object({
  isMisinformation: z
    .boolean()
    .describe('True if the provided information contains misinformation, false otherwise.'),
  confidenceScore: z
    .number()
    .min(0)
    .max(100)
    .describe('A confidence score (0-100) for the assessment, where 100 is highly confident.'),
  explanation: z
    .string()
    .describe(
      'A detailed explanation of the assessment, highlighting any detected misinformation and referencing factual knowledge, or explaining why the information appears accurate.'
    ),
});
export type MisinformationCheckerOutput = z.infer<typeof MisinformationCheckerOutputSchema>;

export async function checkMisinformation(
  input: MisinformationCheckerInput
): Promise<MisinformationCheckerOutput> {
  return misinformationCheckerFlow(input);
}

const misinformationCheckerPrompt = ai.definePrompt({
  name: 'misinformationCheckerPrompt',
  input: {schema: MisinformationCheckerInputSchema},
  output: {schema: MisinformationCheckerOutputSchema},
  prompt: `You are a neutral, objective, and highly knowledgeable fact-checking AI assistant. Your primary goal is to analyze user-provided text for potential misinformation, factual inaccuracies, or misleading statements.

Instructions:
1. Carefully read and understand the 'information' provided by the user.
2. Cross-reference the claims made in the information with your vast training data of factual knowledge. Do not invent sources or make up facts.
3. Determine if the information contains false or misleading content. Focus on identifying inconsistencies, factual inaccuracies, or known misleading narratives.
4. Provide a boolean value for 'isMisinformation': true if misinformation is detected, false otherwise.
5. Provide a 'confidenceScore' from 0 to 100, indicating how confident you are in your assessment.
6. Write a detailed 'explanation'.
    - If misinformation is detected, clearly state what is false or misleading, explain why, and reference the correct factual knowledge or common understanding that contradicts it.
    - If no misinformation is detected, explain why the information appears to be accurate, aligns with known facts, or is unverified but not overtly false or misleading.
7. Maintain a neutral and objective tone throughout your explanation. Avoid expressing personal opinions or biases.

Information to check:
{{{information}}}`,
});

const misinformationCheckerFlow = ai.defineFlow(
  {
    name: 'misinformationCheckerFlow',
    inputSchema: MisinformationCheckerInputSchema,
    outputSchema: MisinformationCheckerOutputSchema,
  },
  async input => {
    const {output} = await misinformationCheckerPrompt(input);
    if (!output) {
      throw new Error('Failed to get an output from the misinformation checker prompt.');
    }
    return output;
  }
);
