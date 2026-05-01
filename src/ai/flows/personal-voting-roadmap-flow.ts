'use server';
/**
 * @fileOverview A Genkit flow to generate a personalized step-by-step voting roadmap.
 *
 * - personalVotingRoadmap - A function that handles the generation of the voting roadmap.
 * - PersonalVotingRoadmapInput - The input type for the personalVotingRoadmap function.
 * - PersonalVotingRoadmapOutput - The return type for the personalVotingRoadmap function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalVotingRoadmapInputSchema = z.object({
  country: z.string().describe('The user\'s country of residence (e.g., India, USA).'),
  location: z.string().describe('The user\'s current residential location (city, state, zip code).'),
  age: z.number().int().min(16).describe('The user\'s age in years.'),
  voterStatus: z.enum(['registered', 'unregistered', 'unknown']).describe('The user\'s current voter registration status.'),
});
export type PersonalVotingRoadmapInput = z.infer<typeof PersonalVotingRoadmapInputSchema>;

const PersonalVotingRoadmapOutputSchema = z.object({
  title: z.string().describe('A title for the personalized voting roadmap.'),
  steps: z.array(
    z.object({
      stepNumber: z.number().int().min(1).describe('The sequential number of the step.'),
      title: z.string().describe('A concise title for the step.'),
      description: z.string().describe('A detailed explanation of what needs to be done for this step.'),
      actionableLink: z.string().optional().describe('An optional URL for an external resource or action related to the step. Should include https:// if possible.'),
    })
  ).describe('An ordered list of steps the user needs to take to vote successfully.'),
});
export type PersonalVotingRoadmapOutput = z.infer<typeof PersonalVotingRoadmapOutputSchema>;

export async function personalVotingRoadmap(input: PersonalVotingRoadmapInput): Promise<PersonalVotingRoadmapOutput> {
  return personalVotingRoadmapFlow(input);
}

const personalVotingRoadmapPrompt = ai.definePrompt({
  name: 'personalVotingRoadmapPrompt',
  input: {schema: PersonalVotingRoadmapInputSchema},
  output: {schema: PersonalVotingRoadmapOutputSchema},
  prompt: `You are an expert civic engagement assistant dedicated to helping individuals vote successfully in their specific country. Your task is to generate a personalized, step-by-step voting roadmap.

Context:
Country: {{{country}}}
Location: {{{location}}}
Age: {{{age}}}
Voter Status: {{{voterStatus}}}

Instructions:
1. Tailor all steps to the electoral laws and procedures of {{{country}}}.
2. If India, reference Aadhaar, EPIC (Voter ID), and the Election Commission of India (ECI) portal.
3. If USA, reference state-specific registration, DMV requirements, or vote-by-mail processes.
4. Ensure the steps are sequential and easy to follow.
5. Provide actual official URLs for links if you are certain of them (e.g., voters.eci.gov.in for India, vote.gov for USA).

Generate a roadmap with a relevant title.`,
});

const personalVotingRoadmapFlow = ai.defineFlow(
  {
    name: 'personalVotingRoadmapFlow',
    inputSchema: PersonalVotingRoadmapInputSchema,
    outputSchema: PersonalVotingRoadmapOutputSchema,
  },
  async (input) => {
    const {output} = await personalVotingRoadmapPrompt(input);
    return output!;
  }
);
