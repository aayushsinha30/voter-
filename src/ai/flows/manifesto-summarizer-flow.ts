'use server';
/**
 * @fileOverview A GenAI tool that decodes political manifestos into neutral, concise summaries.
 *
 * - summarizeManifesto - A function that handles the manifesto summarization process.
 * - ManifestoSummarizerInput - The input type for the summarizeManifesto function.
 * - ManifestoSummarizerOutput - The return type for the summarizeManifesto function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ManifestoSummarizerInputSchema = z.object({
  manifestoText: z.string().describe('The full text of the political manifesto or candidate platform.'),
});
export type ManifestoSummarizerInput = z.infer<typeof ManifestoSummarizerInputSchema>;

const ManifestoSummarizerOutputSchema = z.object({
  summary: z.string().describe('A neutral, concise summary of the political manifesto.'),
});
export type ManifestoSummarizerOutput = z.infer<typeof ManifestoSummarizerOutputSchema>;

export async function summarizeManifesto(input: ManifestoSummarizerInput): Promise<ManifestoSummarizerOutput> {
  return manifestoSummarizerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'manifestoSummarizerPrompt',
  input: {schema: ManifestoSummarizerInputSchema},
  output: {schema: ManifestoSummarizerOutputSchema},
  prompt: `You are an AI assistant tasked with summarizing political manifestos or candidate platforms.
Your goal is to provide a neutral, concise summary of the given text, highlighting key points without introducing any bias or personal opinion.

Manifesto Text:
---
{{{manifestoText}}}
---

Please provide a neutral and concise summary of the manifesto in the following JSON format.
`,
});

const manifestoSummarizerFlow = ai.defineFlow(
  {
    name: 'manifestoSummarizerFlow',
    inputSchema: ManifestoSummarizerInputSchema,
    outputSchema: ManifestoSummarizerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
