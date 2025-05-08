import fastify from "fastify";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import fastifyStatic from "@fastify/static";
import { MessagingClient } from "miaw-api-client";
import { FastifyRequest, FastifyReply } from "fastify";
import cors from "@fastify/cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

interface SalesforceConfig {
  baseUrl: string;
  orgId: string;
  developerName: string;
}

function getRequiredEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getSalesforceConfig(): SalesforceConfig {
  return {
    baseUrl: getRequiredEnvVar("SALESFORCE_BASE_URL"),
    orgId: getRequiredEnvVar("SALESFORCE_ORG_ID"),
    developerName: getRequiredEnvVar("SALESFORCE_DEVELOPER_NAME"),
  };
}

// Initialize the client
const config = getSalesforceConfig();
const client = new MessagingClient({
  ...config,
  logger: console,
});

const app = fastify({
  logger: process.env.NODE_ENV === "development",
}); // Store active conversations
const conversations = new Map();

// Helper function to get a conversation from the in-memory store
function getConversation(conversationId: string) {
  const conversation = conversations.get(conversationId);
  if (!conversation) {
    throw new Error("Conversation not found");
  }
  return conversation;
}

// Register static file serving
app.register(fastifyStatic, {
  root: path.join(__dirname, "public"),
  prefix: "/",
  decorateReply: true,
});

// Register CORS
app.register(cors, {
  origin: process.env.ALLOWED_ORIGIN || "http://localhost:5173",
  credentials: true,
});

// Initialize chat session
app.post("/api/chat/init", async () => {
  const { accessToken } = await client.createToken();
  const { id: conversationId } = await client.createConversation(accessToken);

  // Store the token and conversation ID
  conversations.set(conversationId, { accessToken });

  return { conversationId };
});

// Send message
app.post(
  "/api/chat/send",
  async (
    request: FastifyRequest<{ Body: { conversationId: string; text: string } }>,
    reply
  ) => {
    const { conversationId, text } = request.body;
    const conversation = await getConversation(conversationId);

    const messageEntry = await client.sendMessage(
      conversation.accessToken,
      conversationId,
      { text }
    );

    return messageEntry;
  }
);

// Stream events (SSE endpoint)
app.get(
  "/api/chat/events/:conversationId",
  async (
    request: FastifyRequest<{ Params: { conversationId: string } }>,
    reply: FastifyReply
  ) => {
    const { conversationId } = request.params;
    const conversation = await getConversation(conversationId);

    // Set headers for SSE and CORS
    reply.raw.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin":
        process.env.ALLOWED_ORIGIN || "http://localhost:5173",
      "Access-Control-Allow-Credentials": "true",
    });

    // Set up event stream
    const eventStream = client.createEventStream(conversation.accessToken, {
      lastEventId: "0",
      onEvent: (event: any) => {
        try {
          // Pass through the raw event data
          reply.raw.write(`data: ${JSON.stringify(event)}\n\n`);
        } catch (error) {
          console.error("Error processing event:", error);
        }
      },
      onError: (error: Event) => {
        console.error("Stream error:", error);
        reply.raw.end();
      },
    });

    // Clean up on connection close
    request.raw.on("close", () => {
      if (eventStream) {
        eventStream.close();
      }
    });
  }
);

// Close conversation
app.post(
  "/api/chat/close",
  async (request: FastifyRequest<{ Body: { conversationId: string } }>) => {
    const { conversationId } = request.body;
    const conversation = await getConversation(conversationId);

    // Close the conversation
    await client.closeConversation(conversation.accessToken, conversationId);

    // Remove the conversation from our store
    conversations.delete(conversationId);

    return { success: true };
  }
);

// Start the server
const start = async () => {
  try {
    await app.listen({
      port: parseInt(process.env.PORT || "8080"),
      host: process.env.NODE_ENV === "production" ? "0.0.0.0" : "127.0.0.1",
    });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
