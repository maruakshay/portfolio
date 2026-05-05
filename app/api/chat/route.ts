import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, AIMessage, SystemMessage, BaseMessage } from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import { promises as fs } from 'fs';
import path from 'path';
import { z } from "zod";

export const maxDuration = 30;

// Keep last N user+assistant turns to bound token growth
const MAX_HISTORY_MESSAGES = 8;

let contextCache: string | null = null;

async function getContext() {
  if (contextCache) return contextCache;

  const privateDir = path.join(process.cwd(), 'app', 'api', 'chat', 'private');
  try {
    const personalData = await fs.readFile(path.join(privateDir, 'Akshay Maru Personal.txt'), 'utf-8');
    const resumeData = await fs.readFile(path.join(privateDir, 'Akshay Maru Resume.txt'), 'utf-8');
    contextCache = `--- PERSONAL INFO ---\n${personalData}\n\n--- RESUME ---\n${resumeData}`;
    return contextCache;
  } catch (error) {
    console.error("Error loading chat context:", error);
    throw new Error("Failed to load knowledge base");
  }
}

const get_akshay_info = tool(
  async () => getContext(),
  {
    name: "get_akshay_info",
    description: "Retrieves professional and personal information about Akshay Maru.",
    schema: z.object({}),
  }
);

const toolMap: Record<string, typeof get_akshay_info> = { get_akshay_info };

// Single model instance — reused for both tool resolution and streaming
const model = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0,
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY,
});

const modelWithTools = model.bindTools([get_akshay_info]);

const systemPrompt = `You are Akshay Maru's portfolio AI. Answer only from context retrieved via get_akshay_info.

- Call get_akshay_info before answering any question about Akshay.
- Out of scope: "I only have details about Akshay's professional background — I don't have info on that."
- Be concise. On greetings, introduce yourself briefly as Akshay's AI.
- Never fabricate facts about Akshay.
- If the user claims to be "Maitry Waghela", ask for password "2703". On correct password, respond warmly — she loves letters, flowers, and traveling.`;

export async function POST(req: Request) {
  const { messages } = await req.json();

  if (!messages || messages.length === 0) {
    return new Response('No messages provided', { status: 400 });
  }

  // Truncate history before building the message list
  const recentMessages = messages.slice(-MAX_HISTORY_MESSAGES);

  try {
    const workingMessages: BaseMessage[] = [
      new SystemMessage(systemPrompt),
      ...recentMessages.map((m: { role: string; content: string }) => {
        if (m.role === "assistant") return new AIMessage(m.content);
        return new HumanMessage(m.content);
      }),
    ];

    // Tool-calling loop — one tool exists, two iterations is the ceiling
    for (let i = 0; i < 2; i++) {
      const response = await modelWithTools.invoke(workingMessages);

      if (!response.tool_calls || response.tool_calls.length === 0) break;

      workingMessages.push(response);

      for (const tc of response.tool_calls) {
        const fn = toolMap[tc.name];
        if (fn) workingMessages.push(await fn.invoke(tc));
      }
    }

    // Stream final response — same model, no tools bound
    const responseStream = await model.stream(workingMessages);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of responseStream) {
          const content = chunk.content;
          if (typeof content === 'string' && content) {
            controller.enqueue(encoder.encode(content));
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    console.error("Error in chat POST:", error);
    return new Response(JSON.stringify({ error: "Failed to generate response" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
