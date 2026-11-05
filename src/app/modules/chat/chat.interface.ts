export interface IChatSession {
    sessionId: string;
    model: string;
    messageCount: number;
    lastActivityAt: Date;
    expiresAt: Date;
    isDeleted?: boolean;
    deletedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IChatMessage {
    session: string;
    role: "user" | "assistant";
    content: string;
    status: "pending" | "completed" | "failed";
    isDeleted?: boolean;
    deletedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}


export type IChatSessionDocument = Document & IChatSession;
export type IChatMessageDocument = Document & IChatMessage;

export interface IOllamaChatMessage {
    role: "system" | "user" | "assistant";
    content: string;
}

export interface IOllamaChatStreamChunk {
    model?: string;
    created_at?: string;
    message?: {
        role?: "assistant";
        content?: string;
    };
    done?: boolean;
    done_reason?: string;
    error?: string;
}

export interface ISSEStreamPayload {
    content: string;
    done: boolean;
    messageId?: string;
    sessionId?: string;
    error?: string;
}
