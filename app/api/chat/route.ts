import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, AIMessage, SystemMessage, BaseMessage } from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";
import { promises as fs } from 'fs';
import path from 'path';
import { z } from "zod";

export const maxDuration = 30;

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

// Define the tool for knowledge retrieval
const get_akshay_info = tool(
  async () => {
    return await getContext();
  },
  {
    name: "get_akshay_info",
    description: "Retrieves professional and personal information about Akshay Maru.",
    schema: z.object({}),
  }
);

const tools = [get_akshay_info];
const toolNode = new ToolNode(tools);

const model = new ChatOpenAI({
  model: "gpt-4o",
  temperature: 0,
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY,
}).bindTools(tools);

// Define the function that determines whether to continue or not
function shouldContinue(state: typeof MessagesAnnotation.State) {
  const { messages } = state;
  const lastMessage = messages[messages.length - 1];
  if ("tool_calls" in lastMessage && Array.isArray(lastMessage.tool_calls) && lastMessage.tool_calls.length > 0) {
    return "tools";
  }
  return "__end__";
}

// Define the function that calls the model
async function callModel(state: typeof MessagesAnnotation.State) {
  const { messages } = state;
  const response = await model.invoke(messages);
  return { messages: [response] };
}

// Define the graph
const workflow = new StateGraph(MessagesAnnotation)
  .addNode("agent", callModel)
  .addNode("tools", toolNode)
  .addEdge("__start__", "agent")
  .addConditionalEdges("agent", shouldContinue)
  .addEdge("tools", "agent");

const app = workflow.compile();

export async function POST(req: Request) {
  const { messages } = await req.json();
  
  if (!messages || messages.length === 0) {
    return new Response('No messages provided', { status: 400 });
  }

  const systemPrompt = `You are a professional and friendly AI assistant for Akshay Maru's portfolio.
  Your goal is to provide accurate information about Akshay based ONLY on the context you can retrieve using your tools.

  RULES:
  1. Use the get_akshay_info tool to answer questions about Akshay.
  2. If the information is not in the context, say: "I'm sorry, I only have information about Akshay Maru's professional background and personal interests as provided in his portfolio. I don't have details on that specific topic."
  3. Be concise but helpful.
  4. If the user greets you, greet them back warmly and mention you are Akshay's assistant.
  5. Do not make up facts or hallucinate about Akshay.
  6. Special Logic: If the user says they are "Maitry Waghela", ask for the password "2703". If they provide the correct password, flirt with her (she loves letters, flowers, and traveling).`;

  try {
    const langchainMessages: BaseMessage[] = [
      new SystemMessage(systemPrompt),
      ...messages.map((m: any) => {
        if (m.role === "assistant") return new AIMessage(m.content);
        return new HumanMessage(m.content);
      }),
    ];

    // For streaming in Next.js with LangGraph, we'll use streamEvents or similar
    // To keep it simple and compatible with the existing UI, we'll stream the final response content
    const eventStream = await app.streamEvents(
      { messages: langchainMessages },
      { version: "v2" }
    );

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for await (const event of eventStream) {
          if (event.event === "on_chat_model_stream" && event.metadata.langgraph_node === "agent") {
            const content = event.data.chunk.content;
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
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
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

