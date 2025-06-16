
'use server';

import { estimateCalorieContent, EstimateCalorieContentInput, EstimateCalorieContentOutput } from '@/ai/flows/estimate-calorie-content';

export async function handleEstimateCaloriesAction(
  formData: FormData
): Promise<{ data?: EstimateCalorieContentOutput; error?: string }> {
  const imageFile = formData.get('imageFile') as File | null;

  if (!imageFile) {
    return { error: 'No image file provided.' };
  }

  try {
    const MimeType = imageFile.type;
    if (!MimeType.startsWith('image/')) {
        return { error: 'Invalid file type. Please upload an image.' };
    }
    const buffer = await imageFile.arrayBuffer();
    const base64String = Buffer.from(buffer).toString('base64');
    const photoDataUri = `data:${MimeType};base64,${base64String}`;

    const previousEstimates = formData.get('previousEstimates') as string || '';

    const input: EstimateCalorieContentInput = {
      photoDataUri,
      previousEstimates,
    };

    const result = await estimateCalorieContent(input);
    return { data: result };

  } catch (error) {
    if (error instanceof Error) {
      console.error('Error estimating calories (Action):', error.message, error.stack);
    } else {
      console.error('Error estimating calories (Action) (raw):', String(error));
    }

    let userFriendlyError = 'An unknown error occurred during calorie estimation. Please try again.';
    if (error instanceof Error) {
      const lowerCaseMessage = error.message ? error.message.toLowerCase() : "";
      
      const overloadKeywords = [
        'overload', 'rate limit', 'capacity', 'try again', 
        'temporarily unavailable', 'service unavailable', 
        'resource exhausted', 'too busy', 'please retry',
        'model is overloaded', 'server is busy', 'internal error', 'server error'
      ];
      
      if (overloadKeywords.some(keyword => lowerCaseMessage.includes(keyword))) {
        userFriendlyError = 'The AI service is currently experiencing high demand or is temporarily unavailable. Please try again in a few moments.';
      } else if (lowerCaseMessage.includes('safety') || lowerCaseMessage.includes('blocked')) {
        userFriendlyError = 'The image analysis was blocked due to safety settings. Please try a different image or check the content.';
      } else if (lowerCaseMessage.includes('api key') || lowerCaseMessage.includes('permission denied') || lowerCaseMessage.includes('authentication')) {
        userFriendlyError = 'There was an issue authenticating with the AI service. Please check your setup and Google Cloud project.';
      } else if (lowerCaseMessage.includes('expected output structure') || lowerCaseMessage.includes('incomplete output')) {
        userFriendlyError = 'The AI model returned an unexpected response. This can sometimes happen due to high load or content filtering. Please try again.';
      } else if (error.message) { // Use original error message if no specific match
        userFriendlyError = `An error occurred during calorie estimation: ${error.message}.`;
      }
    } else if (typeof error === 'string') {
      userFriendlyError = `An error occurred: ${error}`;
    }
    return { error: userFriendlyError };
  }
}
