import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { chatServices } from "./chat.services";

/**
 * POST /api/chat/sessions
 * Check Ollama connectivity and create a new guest session.
 */
const createSession = catchAsync(async (req: Request, res: Response) => {
    const { model } = req.body || {};
    const session = await chatServices.createSession(model);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Chat session created successfully",
        data: session,
    });
});

/**
 * GET /api/chat/sessions/:sessionId
 * Validate and retrieve session details.
 */
const getSession = catchAsync(async (req: Request, res: Response) => {
    const sessionId = req.params.sessionId as string;
    const session = await chatServices.getSession(sessionId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Chat session retrieved successfully",
        data: session,
    });
});

/**
 * GET /api/chat/sessions/:sessionId/messages
 * Retrieve messages for a given session in chronological order.
 */
const getSessionMessages = catchAsync(async (req: Request, res: Response) => {
    const sessionId = req.params.sessionId as string;
    const messages = await chatServices.getSessionMessages(sessionId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Chat messages retrieved successfully",
        data: messages,
    });
});

/**
 * DELETE /api/chat/sessions/:sessionId
 * Delete the session and its associated messages.
 */
const deleteSession = catchAsync(async (req: Request, res: Response) => {
    const sessionId = req.params.sessionId as string;
    await chatServices.deleteSession(sessionId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Chat session and messages deleted successfully",
        data: null,
    });
});

/**
 * POST /api/chat
 * Send message to Ollama with history and stream the response via Server-Sent Events (SSE).
 */
const sendChatMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { sessionId, message } = req.body;
    const abortController = new AbortController();

    // Abort generation if client closes the connection
    req.on("close", () => {
        if (!res.writableEnded) {
            abortController.abort();
        }
    });

    try {
        const streamGenerator = chatServices.streamChat(sessionId, message, abortController.signal);

        // Fetch the first chunk to ensure session and Ollama connections are valid BEFORE committing SSE headers
        const firstChunkResult = await streamGenerator.next();

        // Session and initial setup succeeded, now establish SSE headers
        res.writeHead(httpStatus.OK, {
            "Content-Type": "text/event-stream; charset=utf-8",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
            "X-Accel-Buffering": "no",
        });
        res.flushHeaders?.();

        // Write the first chunk
        if (!firstChunkResult.done && firstChunkResult.value) {
            res.write(`data: ${JSON.stringify(firstChunkResult.value)}\n\n`);
            const flushableRes = res as unknown as { flush?: () => void };
            if (typeof flushableRes.flush === "function") {
                flushableRes.flush();
            }
        }

        // Iterate through remaining stream chunks
        for await (const chunk of streamGenerator) {
            if (res.writableEnded) break;

            res.write(`data: ${JSON.stringify(chunk)}\n\n`);
            const flushableRes = res as unknown as { flush?: () => void };
            if (typeof flushableRes.flush === "function") {
                flushableRes.flush();
            }
        }

        if (!res.writableEnded) {
            res.end();
        }
    } catch (err: unknown) {
        // If SSE headers have not yet been sent, delegate to Express global error handler
        if (!res.headersSent) {
            return next(err);
        }

        // If headers were already sent, transmit the error over the open SSE stream and end response
        if (!res.writableEnded) {
            const errorMessage = err instanceof Error ? err.message : "An error occurred during streaming";
            res.write(
                `data: ${JSON.stringify({
                    content: "",
                    done: true,
                    error: errorMessage,
                })}\n\n`,
            );
            res.end();
        }
    }
};

/**
 * GET /api/v1/chat/health or /api/v1/chat/status
 * Check if Ollama server is running and the configured model is available.
 */
const checkHealth = catchAsync(async (req: Request, res: Response) => {
    const statusData = await chatServices.checkAiHealth();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "AI service is online and model is available",
        data: statusData,
    });
});

export const chatControllers = {
    checkHealth,
    createSession,
    getSession,
    getSessionMessages,
    deleteSession,
    sendChatMessage,
};
