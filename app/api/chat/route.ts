import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { promises as fs } from 'fs';
import path from 'path';

export const maxDuration = 30;

let contextCache: string | null = null;

async function getContext() {
  if (contextCache) {
    return contextCache;
  }

  const privateDir = path.join(process.cwd(), 'app', 'api', 'chat', 'private');
  
  try {
    const personalData = await fs.readFile(path.join(privateDir, 'Akshay Maru Personal.txt'), 'utf-8');
    const resumeData = await fs.readFile(path.join(privateDir, 'Akshay Maru Resume.txt'), 'utf-8');

    contextCache = `
      --- PERSONAL INFO ---
      ${personalData}
      
      --- RESUME ---
      ${resumeData}
    `;

    return contextCache;
  } catch (error) {
    console.error("Error loading chat context:", error);
    throw new Error("Failed to load knowledge base");
  }
}

export async function POST(req: Request) {
  const { messages } = await req.json();
  
  if (!messages || messages.length === 0) {
    return new Response('No messages provided', { status: 400 });
  }

  const context = await getContext();

  const model = new ChatOpenAI({
    model: "gpt-4o",
    temperature: 0,
    apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY,
  });

  const systemPrompt = `You are a professional and friendly AI assistant for Akshay Maru's portfolio.
  Your goal is to provide accurate information about Akshay based ONLY on the context provided below.

  RULES:
  1. Use the provided context to answer questions.
  2. If the information is not in the context, say: "I'm sorry, I only have information about Akshay Maru's professional background and personal interests as provided in his portfolio. I don't have details on that specific topic."
  3. Be concise but helpful.
  4. If the user greets you, greet them back warmly and mention you are Akshay's assistant.
  5. Do not make up facts or hallucinate about Akshay.
  6. Tell about maitry only if user ask about her and do not tell about her in other context.
  7. If you are maitry waghela ask for the password 2703 and if the user writes correct then flirt with her 

  CONTEXT:
  ${context}`;

  try {
    const langchainMessages = [
      new SystemMessage(systemPrompt),
      ...messages.map((m: any) => {
        if (m.role === "User" || m.role === "user") return new HumanMessage(m.content);
        if (m.role === "Assistant" || m.role === "assistant") return new AIMessage(m.content);
        return new HumanMessage(m.content);
      }),
    ];

    const parser = new StringOutputParser();
    const stream = await model.pipe(parser).stream(langchainMessages);

    return new Response(stream as any, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    console.error("Error in chat POST:", error);
    return new Response(JSON.stringify({ error: "Failed to generate response" }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

