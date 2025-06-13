// src/ai/flows/activity-suggestion-tool.ts
'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SUBJECTS = ['ELA', 'Math', 'Science', 'History', 'Art'] as const;
type Subject = typeof SUBJECTS[number];

const SuggestActivitiesInputSchema = z.object({
  lessonObjective: z.string().describe('The specific learning objective of the lesson.'),
  subject: z.enum(SUBJECTS).describe('The subject of the lesson.'),
  gradeLevel: z.number().int().describe('The grade level of the lesson.'),
});
export type SuggestActivitiesInput = z.infer<typeof SuggestActivitiesInputSchema>;

const SuggestActivitiesOutputSchema = z.object({
  suggestedActivities: z.array(z.string()).describe('A list of suggested engaging activities for the lesson.'),
  subjectMismatchWarning: z.boolean().optional().describe('Flag indicating if there was a potential subject mismatch.'),
});
export type SuggestActivitiesOutput = z.infer<typeof SuggestActivitiesOutputSchema>;

export async function suggestActivities(input: SuggestActivitiesInput): Promise<SuggestActivitiesOutput> {
  return suggestActivitiesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestActivitiesPrompt',
  input: {schema: SuggestActivitiesInputSchema},
  output: {schema: SuggestActivitiesOutputSchema},
  prompt: `You are an expert curriculum designer and AI assistant for teachers.
Your goal is to suggest 3 to 5 engaging and varied instructional activities based on the provided lesson details.

**Important Guidelines:**
1. First analyze if the lesson objective matches the subject area. If not, either:
   - Suggest ELA activities that could incorporate the content from the objective (if possible)
   - OR note the subject mismatch
2. Ensure activities are specific, actionable, and appropriate for the grade level.
3. For ELA, focus on reading, writing, speaking, and listening skills.

Lesson Details:
Subject: {{{subject}}}
Grade Level: {{{gradeLevel}}}
Lesson Objective: {{{lessonObjective}}}

Response Requirements:
- Return a JSON object with "suggestedActivities" array
- If subject mismatch detected, set "subjectMismatchWarning": true
- Each activity should be a complete description (1-3 sentences)
- Include varied activity types (individual, group, creative, analytical, etc.)

Example for Science objective in ELA class:
{
  "suggestedActivities": [
    "Research and Presentation: Have students research one type of rock and present their findings in a formal report or oral presentation, focusing on clear communication of scientific concepts.",
    "Creative Writing: Write a short story from the perspective of a rock going through the rock cycle, emphasizing descriptive language and narrative structure.",
    "Debate: Organize a debate about which rock type is most useful to humans, focusing on argument construction and persuasive speaking skills."
  ],
  "subjectMismatchWarning": true
}
`,
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

const suggestActivitiesFlow = ai.defineFlow(
  {
    name: 'suggestActivitiesFlow',
    inputSchema: SuggestActivitiesInputSchema,
    outputSchema: SuggestActivitiesOutputSchema,
  },
  async (input: SuggestActivitiesInput): Promise<SuggestActivitiesOutput> => {
    const { output } = await prompt(input);

    if (output && Array.isArray(output.suggestedActivities)) {
      return {
        suggestedActivities: output.suggestedActivities.filter(activity => 
          typeof activity === 'string' && activity.trim() !== ''),
        subjectMismatchWarning: output.subjectMismatchWarning
      };
    }
    
    return { 
      suggestedActivities: [],
      subjectMismatchWarning: true
    };
  }
);