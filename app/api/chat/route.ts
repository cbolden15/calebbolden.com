import { google } from '@ai-sdk/google';
import { streamText, convertToModelMessages } from 'ai';
import { getSystemPrompt, type ChatContext } from '@/lib/chat/system-prompt';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, context } = await req.json();

  const systemPrompt = getSystemPrompt(context as ChatContext);

  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: google('gemini-2.0-flash'),
    system: systemPrompt,
    messages: modelMessages,
  });

  return result.toUIMessageStreamResponse();
}
