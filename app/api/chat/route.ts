import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { getSystemPrompt } from '@/lib/chat/system-prompt';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, context } = await req.json();

    // Get context-aware system prompt
    const systemPrompt = getSystemPrompt(context as 'hiring' | 'automation' | undefined);

    // Stream response from Gemini
    const result = await streamText({
      model: google('models/gemini-1.5-flash-latest'),
      system: systemPrompt,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process chat request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
