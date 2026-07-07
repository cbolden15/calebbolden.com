import { google } from '@ai-sdk/google';
import { streamText, convertToModelMessages, stepCountIs } from 'ai';
import { getSystemPrompt } from '@/lib/chat/system-prompt';
import { chatTools } from '@/lib/chat/tools';

export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const systemPrompt = getSystemPrompt();

  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: google('gemini-3.5-flash'),
    system: systemPrompt,
    messages: modelMessages,
    tools: chatTools,
    stopWhen: stepCountIs(3),
  });

  return result.toUIMessageStreamResponse();
}
