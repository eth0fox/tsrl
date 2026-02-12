export interface BaseMessage {
    $type: string;
}

export interface BaseResponse {
    $type: string;
    sourceMessageId: string;
    success: boolean;
    errorInfo?: string;
}
