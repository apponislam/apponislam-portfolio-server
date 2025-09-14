export interface IMessage {
    name: string;
    email: string;
    message: string;
    social?: string;
}

export interface PaginationOptions {
    page?: number;
    limit?: number;
}
