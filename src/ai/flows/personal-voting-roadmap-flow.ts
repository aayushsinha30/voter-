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
  location: z.string().describe('The user\'s current residential location (city, state, zip code).'),
  age: z.number().int().min(18).describe('The user\'s age in years.'),
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
      actionableLink: z.string().url().optional().describe('An optional URL for an external resource or action related to the step.'),
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
  prompt: `You are an expert civic engagement assistant dedicated to helping individuals vote successfully. Your task is to generate a personalized, step-by-step voting roadmap based on the provided user information.

Consider the user's location, age, and voter status to provide highly relevant and actionable steps. Ensure the roadmap covers everything from registration (if needed) to casting a ballot.

User Information:
Location: {{{location}}}
Age: {{{age}}}
Voter Status: {{{voterStatus}}}

Generate a step-by-step roadmap tailored to this user. Each step should include a title, a detailed description, and an optional actionable link if applicable (e.g., a link to a voter registration site or election official website).`,
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
