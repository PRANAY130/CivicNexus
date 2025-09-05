'use server';

/**
 * @fileOverview An image analysis AI agent that assesses the severity of an issue from an image.
 *
 * - analyzeImageSeverity - A function that handles the image severity analysis process.
 * - AnalyzeImageSeverityInput - The input type for the analyzeImageSeverity function.
 * - AnalyzeImageSeverityOutput - The return type for the analyzeImageSeverity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeImageSeverityInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo of the issue, as a data URI that must include a MIME type and use Base64 encoding. Expected format: data:<mimetype>;base64,<encoded_data>.'
    ),
});
export type AnalyzeImageSeverityInput = z.infer<typeof AnalyzeImageSeverityInputSchema>;

const AnalyzeImageSeverityOutputSchema = z.object({
  severityScore: z
    .number()
    .describe(
      'A score from 1-10 indicating the severity of the issue, with 1 being minor and 10 being critical.'
    ),
  reasoning: z.string().describe('The AI reasoning behind the severity score.'),
});
export type AnalyzeImageSeverityOutput = z.infer<typeof AnalyzeImageSeverityOutputSchema>;

export async function analyzeImageSeverity(
  input: AnalyzeImageSeverityInput
): Promise<AnalyzeImageSeverityOutput> {
  return analyzeImageSeverityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeImageSeverityPrompt',
  input: {schema: AnalyzeImageSeverityInputSchema},
  output: {schema: AnalyzeImageSeverityOutputSchema},
  prompt: `You are an AI assistant specialized in analyzing images to determine the severity of civic issues.

You will be provided with an image of a reported issue, and you must assess its severity on a scale of 1 to 10, where 1 is a minor issue and 10 is a critical issue.

Provide a severity score and a brief explanation of your reasoning.

Here is the image:

{{media url=photoDataUri}}

Consider factors like public safety, environmental impact, and disruption to daily life when determining the severity score.

Ensure that your response includes both the severity score and the reasoning behind it.

Severity Score: <score>
Reasoning: <reason>`,
});

const analyzeImageSeverityFlow = ai.defineFlow(
  {
    name: 'analyzeImageSeverityFlow',
    inputSchema: AnalyzeImageSeverityInputSchema,
    outputSchema: AnalyzeImageSeverityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
