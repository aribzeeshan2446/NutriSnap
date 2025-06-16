
'use server';
/**
 * @fileOverview Estimates the calorie and macro content of a meal from an image.
 *
 * - estimateCalorieContent - A function that handles the calorie estimation process.
 * - EstimateCalorieContentInput - The input type for the estimateCalorieContent function.
 * - EstimateCalorieContentOutput - The return type for the estimateCalorieContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EstimateCalorieContentInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a meal, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  previousEstimates: z
    .string()
    .optional()
    .describe('Previous calorie estimates for the user.'),
});
export type EstimateCalorieContentInput = z.infer<typeof EstimateCalorieContentInputSchema>;

const EstimateCalorieContentOutputSchema = z.object({
  calorieEstimate: z.number().describe('Estimated calorie content of the meal.'),
  macroContent: z
    .object({
      protein: z.number().describe('Estimated protein content in grams.'),
      carbohydrates: z.number().describe('Estimated carbohydrate content in grams.'),
      fat: z.number().describe('Estimated fat content in grams.'),
    })
    .describe('Estimated macro content of the meal.'),
  ingredients: z.string().describe('A list of the ingredients found in the meal.'),
});
export type EstimateCalorieContentOutput = z.infer<typeof EstimateCalorieContentOutputSchema>;

export async function estimateCalorieContent(input: EstimateCalorieContentInput): Promise<EstimateCalorieContentOutput> {
  return estimateCalorieContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'estimateCalorieContentPrompt',
  input: {schema: EstimateCalorieContentInputSchema},
  output: {schema: EstimateCalorieContentOutputSchema},
  prompt: `You are an expert nutritionist specializing in estimating the calorie and macro content of meals from images.

You will use this information to estimate the calorie and macro content of the meal.

Consider any previous calorie estimates for the user, if provided.

Previous Estimates: {{{previousEstimates}}}

Use the following image as the primary source of information about the meal.

Photo: {{media url=photoDataUri}}

Output the ingredients, calorie estimate, and macro content (protein, carbohydrates, and fat).
`,
});

const estimateCalorieContentFlow = ai.defineFlow(
  {
    name: 'estimateCalorieContentFlow',
    inputSchema: EstimateCalorieContentInputSchema,
    outputSchema: EstimateCalorieContentOutputSchema,
  },
  async input => {
    try {
      const result = await prompt(input);
      if (!result.output) {
        console.error('EstimateCalorieContentFlow: AI model did not return an output or output was empty. Full result:', result);
        throw new Error('AI model did not return the expected output structure for calorie estimation.');
      }
      if (typeof result.output.calorieEstimate !== 'number' || !result.output.macroContent || !result.output.ingredients) {
          console.error('EstimateCalorieContentFlow: AI model output is missing required fields. Output received:', result.output);
          throw new Error('AI model returned an incomplete output structure.');
      }
      return result.output;
    } catch (error) {
      console.error('[Genkit Flow Error - estimateCalorieContentFlow] Failed to process AI prompt:', error);
      // Re-throw the error so it can be caught by the calling Server Action
      // and a user-friendly message can be displayed.
      if (error instanceof Error) {
        throw new Error(`AI processing error in estimateCalorieContentFlow: ${error.message}`);
      }
      throw new Error('An unknown error occurred during AI processing in estimateCalorieContentFlow.');
    }
  }
);

