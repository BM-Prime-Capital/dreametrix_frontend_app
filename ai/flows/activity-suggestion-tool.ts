// src/ai/flows/activity-suggestion-tool.ts
'use server';

/**
 * @fileOverview AI-powered tool to suggest engaging activities for teachers based on lesson objectives.
 *
 * - suggestActivities - A function that suggests activities based on lesson objectives.
 * - SuggestActivitiesInput - The input type for the suggestActivities function.
 * - SuggestActivitiesOutput - The return type for the suggestActivities function.
 */

// Update the import path to the correct relative location of genkit, e.g.:
import { ai } from '../genkit';
// If the correct path is different, adjust accordingly.
import {z} from 'genkit';

const SuggestActivitiesInputSchema = z.object({
  lessonObjective: z
    .string()
    .describe('The specific learning objective of the lesson.'),
  subject: z.enum(['ELA', 'Math']).describe('The subject of the lesson.'),
  gradeLevel: z.number().int().describe('The grade level of the lesson.'),
});
export type SuggestActivitiesInput = z.infer<typeof SuggestActivitiesInputSchema>;

const SuggestActivitiesOutputSchema = z.object({
  suggestedActivities: z
    .array(z.string())
    .describe('A list of suggested engaging activities for the lesson.'),
});
export type SuggestActivitiesOutput = z.infer<typeof SuggestActivitiesOutputSchema>;

export async function suggestActivities(input: SuggestActivitiesInput): Promise<SuggestActivitiesOutput> {
  return suggestActivitiesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestActivitiesPrompt',
  input: {schema: SuggestActivitiesInputSchema},
  output: {schema: SuggestActivitiesOutputSchema},
  prompt: `You are an AI assistant designed to help teachers create engaging lesson plans.

  Based on the lesson objective, subject, and grade level provided, suggest a list of engaging activities that would help students learn and retain the material.

  Subject: {{{subject}}}
  Grade Level: {{{gradeLevel}}}
  Lesson Objective: {{{lessonObjective}}}

  Suggested Activities:
  {{#each suggestedActivities}}- {{this}}
  {{/each}}`,
});

const suggestActivitiesFlow = ai.defineFlow(
  {
    name: 'suggestActivitiesFlow',
    inputSchema: SuggestActivitiesInputSchema,
    outputSchema: SuggestActivitiesOutputSchema,
  },
  async input => {
    const {output} = await ai.generate({
      prompt: `Suggest 3 engaging activities for a ${input.subject} lesson at grade ${input.gradeLevel} with the objective: ${input.lessonObjective}. Return each activity as a bullet point.`,
      model: 'googleai/gemini-2.0-flash',
      config: {
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_ONLY_HIGH',
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_NONE',
          },
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_LOW_AND_ABOVE',
          },
        ],
      },
    });

    const suggestedActivities = output?.text?.split('\n')
      .map((activity: string) => activity.replace(/^\s*[\-\d\.]+\s*/, '').trim())
      .filter((activity: string) => activity !== null && activity !== undefined && activity !== '');

    return {suggestedActivities: suggestedActivities ?? []};
  }
);
