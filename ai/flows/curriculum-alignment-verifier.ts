'use server';
/**
 * @fileOverview A curriculum alignment verification AI agent.
 *
 * - curriculumAlignmentVerifier - A function that handles the curriculum alignment verification process.
 * - CurriculumAlignmentInput - The input type for the curriculumAlignmentVerifier function.
 * - CurriculumAlignmentOutput - The return type for the curriculumAlignmentVerifier function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CurriculumAlignmentInputSchema = z.object({
  scopeAndSequence: z.string().describe('The scope and sequence document.'),
  unitPlan: z.string().describe('The unit plan document.'),
  lessonPlan: z.string().describe('The lesson plan document.'),
  stateStandards: z.string().describe('The state standards document.'),
});
export type CurriculumAlignmentInput = z.infer<typeof CurriculumAlignmentInputSchema>;

const CurriculumAlignmentOutputSchema = z.object({
  isAligned: z.boolean().describe('Whether the curriculum is aligned with state standards.'),
  alignmentReport: z.string().describe('A report detailing the alignment of the curriculum with state standards.'),
});
export type CurriculumAlignmentOutput = z.infer<typeof CurriculumAlignmentOutputSchema>;

export async function curriculumAlignmentVerifier(input: CurriculumAlignmentInput): Promise<CurriculumAlignmentOutput> {
  return curriculumAlignmentVerifierFlow(input);
}

const prompt = ai.definePrompt({
  name: 'curriculumAlignmentVerifierPrompt',
  input: {schema: CurriculumAlignmentInputSchema},
  output: {schema: CurriculumAlignmentOutputSchema},
  prompt: `You are an expert curriculum coordinator. You will analyze the provided scope and sequence, unit plan, and lesson plan documents to determine if they are aligned with the provided state standards. Provide a detailed report on the alignment, including any discrepancies or areas for improvement.\n\nScope and Sequence: {{{scopeAndSequence}}}\nUnit Plan: {{{unitPlan}}}\nLesson Plan: {{{lessonPlan}}}\nState Standards: {{{stateStandards}}}`,
});

const curriculumAlignmentVerifierFlow = ai.defineFlow(
  {
    name: 'curriculumAlignmentVerifierFlow',
    inputSchema: CurriculumAlignmentInputSchema,
    outputSchema: CurriculumAlignmentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
