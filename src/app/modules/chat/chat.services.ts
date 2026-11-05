import crypto from "crypto";
import httpStatus from "http-status";
import config from "../../config";
import ApiError from "../../../errors/ApiError";
import { IChatMessage, IChatSession, IOllamaChatMessage, IOllamaChatStreamChunk, ISSEStreamPayload } from "./chat.interface";
import { ChatMessage, ChatSession } from "./chat.model";
import { buildPortfolioSystemPrompt } from "./chat.knowledge";

/**
 * Check if a session has expired based on its expiresAt timestamp.
 */
const isSessionExpired = (session: IChatSession): boolean => {
    return new Date(session.expiresAt).getTime() <= Date.now();
};

/**
 * Helper to retrieve and validate configured Ollama URL.
 */
const getOllamaUrl = (): string => {
    const url = config.ollama.url?.trim();
    if (!url) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "OLLAMA_API_URL environment variable is not defined");
    }
    return url.replace(/\/+$/, "");
};

/**
 * Helper to retrieve and validate configured Ollama Model.
 */
const getOllamaModel = (requestedModel?: string): string => {
    const model = requestedModel?.trim() || config.ollama.model?.trim();
    if (!model) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "OLLAMA_MODEL environment variable is not defined");
    }
    return model;
};

/**
 * Helper to retrieve session duration in days.
 */
const getSessionExpiresInDays = (): number => {
    const parsed = Number(config.ollama.sessionExpiresInDays);
    return !isNaN(parsed) && parsed > 0 ? parsed : 30;
};

/**
 * Verify Ollama server connectivity by checking if the Ollama root URL is reachable.
 */
const checkOllamaHealth = async (): Promise<boolean> => {
    const url = getOllamaUrl();

    let res: Response;
    try {
        res = await fetch(`${url}/`, {
            method: "GET",
            signal: AbortSignal.timeout(5000),
        });
    } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : "Network error";
        throw new ApiError(httpStatus.SERVICE_UNAVAILABLE, `AI service (Ollama) is currently unreachable: ${errorMsg}`);
    }

    if (!res.ok) {
        throw new ApiError(httpStatus.SERVICE_UNAVAILABLE, `AI service responded with HTTP status ${res.status}`);
    }

    return true;
};

/**
 * Create a new guest chat session.
 */
const createSession = async (modelName?: string): Promise<IChatSession> => {
    const configuredModel = getOllamaModel(modelName);

    // Verify Ollama server is running
    await checkOllamaHealth();

    // Generate a unique, cryptographically secure session ID
    const sessionId = crypto.randomUUID();

    const expiresInDays = getSessionExpiresInDays();
    const expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000);

    const session = await ChatSession.create({
        sessionId,
        model: configuredModel,
        messageCount: 0,
        lastActivityAt: new Date(),
        expiresAt,
    });

    return session;
};

/**
 * Retrieve session by sessionId. Validates existence and expiration.
 */
const getSession = async (sessionId: string): Promise<IChatSession> => {
    if (!sessionId) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Session ID is required");
    }

    const session = await ChatSession.findOne({ sessionId, isDeleted: false });
    if (!session) {
        throw new ApiError(httpStatus.NOT_FOUND, "Chat session not found");
    }

    if (isSessionExpired(session)) {
        throw new ApiError(httpStatus.NOT_FOUND, "Chat session has expired");
    }

    return session;
};

/**
 * Retrieve previous messages of a session in chronological order.
 */
const getSessionMessages = async (sessionId: string): Promise<IChatMessage[]> => {
    // Validate session existence and validity first
    await getSession(sessionId);

    const messages = await ChatMessage.find({ session: sessionId, isDeleted: false }).sort({ createdAt: 1 }).select("session role content status createdAt updatedAt");

    return messages;
};

/**
 * Soft delete a session and all its associated messages.
 */
const deleteSession = async (sessionId: string): Promise<void> => {
    if (!sessionId) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Session ID is required");
    }

    const session = await ChatSession.findOne({ sessionId, isDeleted: false });
    if (!session) {
        throw new ApiError(httpStatus.NOT_FOUND, "Chat session not found");
    }

    const deletedAt = new Date();
    await ChatSession.updateOne({ sessionId }, { $set: { isDeleted: true, deletedAt } });
    await ChatMessage.updateMany({ session: sessionId }, { $set: { isDeleted: true, deletedAt } });
};

/**
 * Stream an AI response through Ollama using Server-Sent Events generator.
 */
const streamChat = async function* (sessionId: string, userMessageContent: string, signal?: AbortSignal): AsyncGenerator<ISSEStreamPayload, void, unknown> {
    // 1. Validate session
    const session = await getSession(sessionId);

    const trimmedUserMessage = userMessageContent.trim();
    if (!trimmedUserMessage) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Message cannot be empty");
    }

    // 2. Retrieve completed conversation history
    const previousMessages = await ChatMessage.find({
        session: sessionId,
        status: "completed",
        isDeleted: false,
    })
        .sort({ createdAt: 1 })
        .select("role content");

    // 3. Format message history for Ollama /api/chat
    const ollamaMessages: IOllamaChatMessage[] = [];

    const systemPrompt = buildPortfolioSystemPrompt();
    if (systemPrompt) {
        ollamaMessages.push({
            role: "system",
            content: systemPrompt,
        });
    }

    for (const msg of previousMessages) {
        ollamaMessages.push({
            role: msg.role as "user" | "assistant",
            content: msg.content,
        });
    }

    ollamaMessages.push({
        role: "user",
        content: trimmedUserMessage,
    });

    // 4. Save the user's message in MongoDB
    await ChatMessage.create({
        session: sessionId,
        role: "user",
        content: trimmedUserMessage,
        status: "completed",
    });

    // 5. Create assistant placeholder message in MongoDB with status: "pending"
    const assistantMessage = await ChatMessage.create({
        session: sessionId,
        role: "assistant",
        content: "",
        status: "pending",
    });

    // 6. Connect to Ollama streaming API
    const ollamaChatUrl = `${getOllamaUrl()}/api/chat`;

    let ollamaRes: Response;
    try {
        ollamaRes = await fetch(ollamaChatUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: session.model || getOllamaModel(),
                messages: ollamaMessages,
                stream: true,
                options: {
                    num_ctx: 2048,
                    num_predict: 250,
                    temperature: 0.3,
                },
                keep_alive: "24h",
            }),
            signal,
        });
    } catch (fetchErr: unknown) {
        await ChatMessage.findByIdAndUpdate(assistantMessage._id, {
            status: "failed",
            content: "Connection timed out while contacting the AI service. Please try sending your message again.",
        });
        const errMessage = fetchErr instanceof Error ? fetchErr.message : "Connection failed";
        throw new ApiError(httpStatus.SERVICE_UNAVAILABLE, `Failed to connect to Ollama server: ${errMessage}`);
    }

    if (!ollamaRes.ok) {
        await ChatMessage.findByIdAndUpdate(assistantMessage._id, {
            status: "failed",
            content: "The AI service is currently unavailable. Please try again in a moment.",
        });
        throw new ApiError(httpStatus.BAD_GATEWAY, `Ollama server returned error status ${ollamaRes.status} ${ollamaRes.statusText}`);
    }

    const reader = ollamaRes.body?.getReader();
    if (!reader) {
        await ChatMessage.findByIdAndUpdate(assistantMessage._id, {
            status: "failed",
            content: "No response stream could be established with the AI service. Please try again.",
        });
        throw new ApiError(httpStatus.BAD_GATEWAY, "No readable response stream available from Ollama");
    }

    let accumulatedContent = "";
    const decoder = new TextDecoder("utf-8");
    let lineBuffer = "";

    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            lineBuffer += decoder.decode(value, { stream: true });
            const lines = lineBuffer.split("\n");
            // The last item is an incomplete line or empty string after trailing newline
            lineBuffer = lines.pop() ?? "";

            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed) continue;

                let parsedChunk: IOllamaChatStreamChunk;
                try {
                    parsedChunk = JSON.parse(trimmed) as IOllamaChatStreamChunk;
                } catch {
                    continue;
                }

                if (parsedChunk.error) {
                    throw new Error(parsedChunk.error);
                }

                const chunkContent = parsedChunk.message?.content || "";
                if (chunkContent) {
                    accumulatedContent += chunkContent;
                    yield {
                        content: chunkContent,
                        done: false,
                    };
                }
            }
        }

        // Process any remainder in lineBuffer
        if (lineBuffer.trim()) {
            try {
                const parsedChunk = JSON.parse(lineBuffer.trim()) as IOllamaChatStreamChunk;
                if (parsedChunk.error) throw new Error(parsedChunk.error);
                const chunkContent = parsedChunk.message?.content || "";
                if (chunkContent) {
                    accumulatedContent += chunkContent;
                    yield {
                        content: chunkContent,
                        done: false,
                    };
                }
            } catch {
                // Ignore remainder JSON parse error
            }
        }

        // 7. Update assistant message with completed content
        await ChatMessage.findByIdAndUpdate(assistantMessage._id, {
            content: accumulatedContent,
            status: "completed",
        });

        // 8. Update session messageCount and lastActivityAt
        const expiresInDays = getSessionExpiresInDays();
        await ChatSession.findOneAndUpdate(
            { sessionId },
            {
                $inc: { messageCount: 2 },
                $set: {
                    lastActivityAt: new Date(),
                    expiresAt: new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000),
                },
            },
        );

        // 9. Send completion payload with IDs
        yield {
            content: "",
            done: true,
            messageId: assistantMessage._id.toString(),
            sessionId,
        };
    } catch (err: unknown) {
        const isAborted = signal?.aborted || (err instanceof Error && err.name === "AbortError");

        // Save accumulated content even if aborted or error occurred
        await ChatMessage.findByIdAndUpdate(assistantMessage._id, {
            content: accumulatedContent || "Sorry, the response was interrupted. Please try again.",
            status: isAborted && accumulatedContent ? "completed" : "failed",
        });

        if (accumulatedContent) {
            await ChatSession.findOneAndUpdate(
                { sessionId },
                {
                    $inc: { messageCount: 2 },
                    $set: { lastActivityAt: new Date() },
                },
            );
        }

        throw err;
    }
};

/**
 * Check if Ollama server root URL is reachable and running.
 */
const checkAiHealth = async () => {
    await checkOllamaHealth();
    return {
        status: "online",
        running: true,
        ollamaUrl: getOllamaUrl(),
        model: config.ollama.model || "llama3.2:3b",
    };
};

export const chatServices = {
    checkOllamaHealth,
    checkAiHealth,
    createSession,
    getSession,
    getSessionMessages,
    deleteSession,
    streamChat,
};
