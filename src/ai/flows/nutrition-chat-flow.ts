
'use server';
/**
 * @fileOverview A conversational AI flow for nutrition advice.
 *
 * - nutritionChat - A function that handles the conversation.
 * - NutritionChatInput - The input type for the nutritionChat function.
 * - NutritionChatOutput - The return type for the nutritionChat function.
 */

import {ai}from '@/ai/genkit';
import {z}
from 'genkit';

const ConversationMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  text: z.string(),
});
export type ConversationMessage = z.infer<typeof ConversationMessageSchema>;

const NutritionChatInputSchema = z.object({
  newMessage: z.string().describe("The latest message from the user."),
  history: z.array(ConversationMessageSchema).optional().describe("The conversation history up to this point."),
});
export type NutritionChatInput = z.infer<typeof NutritionChatInputSchema>;

const NutritionChatOutputSchema = z.object({
  aiResponseText: z.string().describe("The AI's text response to the user's message."),
});
export type NutritionChatOutput = z.infer<typeof NutritionChatOutputSchema>;

export async function nutritionChat(input: NutritionChatInput): Promise<NutritionChatOutput> {
  return nutritionChatFlow(input);
}

const systemPrompt = `You are NutriAI, a friendly and knowledgeable nutrition and wellness assistant.
Your goal is to provide helpful, supportive, and evidence-based advice to users regarding their diet, food intake, healthy eating habits, and general wellness.
Be encouraging and practical. If a user asks for something outside of nutrition or wellness, politely steer the conversation back or state that you cannot help with that topic.
Keep your responses concise and easy to understand.`;

const MAX_HISTORY_MESSAGES = 6; // Limit to the last 3 pairs of user/AI messages

const prompt = ai.definePrompt({
  name: 'nutritionChatPrompt',
  input: {schema: NutritionChatInputSchema},
  output: {schema: z.object({aiResponseText: z.string()})},
  system: systemPrompt,
  prompt: (input) => {
    const relevantHistory = (input.history || []).slice(-MAX_HISTORY_MESSAGES);
    const historyMessages = relevantHistory.map(msg => `${msg.role === 'user' ? 'User' : 'AI'}: ${msg.text}`);
    return [
      ...historyMessages,
      `User: ${input.newMessage}`,
      `AI:`
    ].join('\n');
  },
  config: {
    temperature: 0.3, 
    safetySettings: [
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    ],
  }
});

const nutritionChatFlow = ai.defineFlow(
  {
    name: 'nutritionChatFlow',
    inputSchema: NutritionChatInputSchema,
    outputSchema: NutritionChatOutputSchema,
  },
  async (input) => {
    let llmOutput;
    try {
      const result = await prompt(input);
      llmOutput = result.output;
    } catch (error) {
      console.error('[Genkit Flow Error - nutritionChatFlow] Failed to process AI prompt:', error);
      // Re-throw the error for the Server Action to handle.
      if (error instanceof Error) {
        throw new Error(`AI processing error in nutritionChatFlow: ${error.message}`);
      }
      throw new Error('An unknown error occurred during AI processing in nutritionChatFlow.');
    }
    
    let aiResponseText: string;

    if (!llmOutput?.aiResponseText) {
      console.warn('LLM did not return aiResponseText. Using fallback text. Output:', llmOutput);
      aiResponseText = "I'm sorry, I couldn't generate a response at this moment. This might be due to a temporary issue or content filtering.";
    } else {
      aiResponseText = llmOutput.aiResponseText;
    }
    
    return { aiResponseText };
  }
);

