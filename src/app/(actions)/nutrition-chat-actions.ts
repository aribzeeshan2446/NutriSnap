
'use server';

import { nutritionChat, NutritionChatInput, NutritionChatOutput, ConversationMessage } from '@/ai/flows/nutrition-chat-flow';

export async function handleNutritionChatAction(
  newMessage: string,
  history: ConversationMessage[]
): Promise<{ data?: NutritionChatOutput; error?: string }> {
  if (!newMessage.trim()) {
    return { error: 'Message cannot be empty.' };
  }

  try {
    const input: NutritionChatInput = {
      newMessage,
      history: history,
    };

    const result = await nutritionChat(input);
    return { data: result };

  } catch (error) {
    if (error instanceof Error) {
      console.error('Error in nutrition chat action:', error.message, error.stack);
    } else {
      console.error('Error in nutrition chat action (raw):', String(error));
    }
    
    let userFriendlyError = 'An unknown error occurred while communicating with the AI. Please try again.';
    if (error instanceof Error) {
      const lowerCaseMessage = error.message ? error.message.toLowerCase() : "";
      const overloadKeywords = [
        'overload', 'rate limit', 'capacity', 'try again', 
        'temporarily unavailable', 'service unavailable', 
        'resource exhausted', 'too busy', 'please retry',
        'model is overloaded', 'server is busy', 'internal error', 'server error'
      ];

      if (overloadKeywords.some(keyword => lowerCaseMessage.includes(keyword))) {
        userFriendlyError = 'The AI service is currently experiencing high demand or is temporarily unavailable. Please try your message again in a few moments.';
      } else if (lowerCaseMessage.includes('safety') || lowerCaseMessage.includes('blocked')) {
        userFriendlyError = 'The response was blocked due to safety settings. Please rephrase your message or try a different topic.';
       } else if (lowerCaseMessage.includes('api key') || lowerCaseMessage.includes('permission denied') || lowerCaseMessage.includes('authentication')) {
        userFriendlyError = 'There was an issue authenticating with the AI service. Please check your setup and Google Cloud project.';
      } else if (error.message) { // Use original error message if no specific match
         userFriendlyError = `Failed to get AI response: ${error.message}.`;
      }
    } else if (typeof error === 'string') {
      userFriendlyError = `AI communication error: ${error}`;
    }
    return { error: userFriendlyError };
  }
}
