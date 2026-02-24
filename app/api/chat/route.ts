export const runtime = "nodejs";
export const maxDuration = 30;
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import {
  HumanMessage,
  AIMessage,
  SystemMessage,
  BaseMessage,
} from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";
import { promises as fs } from "fs";
import path from "path";
import { z } from "zod";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { chroma } from "../../../lib/chroma";

const COLLECTION_NAME = "akshay_portfolio";
let collectionCache: any = null;

/* ------------------ EMBEDDINGS ------------------ */

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
  apiKey: process.env.OPENAI_KEY,
});

/* ------------------ COLLECTION HELPERS ------------------ */

async function getCollection() {
  if (collectionCache) return collectionCache;

  const collections = await chroma.listCollections();
  const exists = collections.some((c: any) => c.name === COLLECTION_NAME);

  if (!exists) {
    collectionCache = await chroma.createCollection({
      name: COLLECTION_NAME,
    });
  } else {
    collectionCache = await chroma.getCollection({
      name: COLLECTION_NAME,
    });
  }

  return collectionCache;
}

/* ------------------ INITIAL EMBEDDING (RUN ONCE) ------------------ */

async function ensureEmbedded() {
  
  const collection = await getCollection();
  const count = await collection.count();

  if (count > 0) {
    return; // Already embedded
  }

  const privateDir = path.join(
    process.cwd(),
    "app",
    "api",
    "chat",
    "private"
  );

  const personalData = await fs.readFile(
    path.join(privateDir, "Akshay Maru Personal.txt"),
    "utf-8"
  );

  const resumeData = await fs.readFile(
    path.join(privateDir, "Akshay Maru Resume.txt"),
    "utf-8"
  );

  const fullText = `--- PERSONAL INFO ---\n${personalData}\n\n--- RESUME ---\n${resumeData}`;

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1500,
    chunkOverlap: 50,
  });

  const docs = await splitter.createDocuments([fullText]);

  const vectors = await embeddings.embedDocuments(
    docs.map((d:any) => d.pageContent)
  );

  await collection.upsert({
    ids: docs.map((_, i) => `akshay-${i}`),
    embeddings: vectors,
    documents: docs.map((d) => d.pageContent),
  });

  console.log("✅ Embedded portfolio into Chroma");
}

/* ------------------ RETRIEVAL TOOL ------------------ */

const get_akshay_info = tool(
  async ({ query }) => {
    await ensureEmbedded();

    const collection = await getCollection();
    const queryEmbedding = await embeddings.embedQuery(query);
    const results = await collection.query({
      queryEmbeddings: [queryEmbedding],
      nResults: 4,
    });

    const docs = results.documents?.[0] ?? [];
    return docs.join("\n");
  },
  {
    name: "get_akshay_info",
    description:
      "Searches Akshay Maru's professional and personal portfolio information.",
    schema: z.object({
      query: z.string(),
    }),
  }
);

const tools = [get_akshay_info];
const toolNode = new ToolNode(tools);

/* ------------------ MODEL ------------------ */

const model = new ChatOpenAI({
  model: "gpt-4o",
  temperature: 0,
  apiKey: process.env.OPENAI_KEY,
}).bindTools(tools);

/* ------------------ GRAPH LOGIC ------------------ */

function shouldContinue(state: typeof MessagesAnnotation.State) {
  const { messages } = state;
  const lastMessage = messages[messages.length - 1];

  if (
    "tool_calls" in lastMessage &&
    Array.isArray(lastMessage.tool_calls) &&
    lastMessage.tool_calls.length > 0
  ) {
    return "tools";
  }

  return "__end__";
}

async function callModel(state: typeof MessagesAnnotation.State) {
  const { messages } = state;
  const response = await model.invoke(messages);
  return { messages: [response] };
}

const workflow = new StateGraph(MessagesAnnotation)
  .addNode("agent", callModel)
  .addNode("tools", toolNode)
  .addEdge("__start__", "agent")
  .addConditionalEdges("agent", shouldContinue)
  .addEdge("tools", "agent");

const app = workflow.compile();

/* ------------------ API ROUTE ------------------ */

export async function POST(req: Request) {
  const { messages } = await req.json();

  if (!messages || messages.length === 0) {
    return new Response("No messages provided", { status: 400 });
  }

  const systemPrompt = `You are a professional and friendly AI assistant for Akshay Maru's portfolio.

Your goal is to provide accurate information about Akshay based ONLY on the context retrieved using your tool.

RULES:
1. Always call get_akshay_info with the user’s question when answering anything about Akshay.
2. If the information is not in the retrieved context, say:
"I'm sorry, I only have information about Akshay Maru's professional background and personal interests as provided in his portfolio."
3. Be concise but helpful.
4. If the user greets you, greet warmly and mention you are Akshay's assistant.
5. Do not hallucinate.
6. Special Logic: If the user says they are "Maitry Waghela", ask for password "2703". If correct, flirt and talk about letters, flowers, traveling.
`;

  try {
    const langchainMessages: BaseMessage[] = [
      new SystemMessage(systemPrompt),
      ...messages.map((m: any) =>
        m.role === "assistant"
          ? new AIMessage(m.content)
          : new HumanMessage(m.content)
      ),
    ];

    const eventStream = await app.streamEvents(
      { messages: langchainMessages },
      { version: "v2" }
    );

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        for await (const event of eventStream) {
          if (
            event.event === "on_chat_model_stream" &&
            event.metadata.langgraph_node === "agent"
          ) {
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
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Error in chat POST:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate response" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}