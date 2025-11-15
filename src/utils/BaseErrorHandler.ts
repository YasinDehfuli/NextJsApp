export enum ErrorType {
    NETWORK_ERROR = 'NETWORK_ERROR',
    TIMEOUT_ERROR = 'TIMEOUT_ERROR',
    HTTP_ERROR = 'HTTP_ERROR',
    PARSE_ERROR = 'PARSE_ERROR',
    UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface ApiErrorDetails {
    type: ErrorType;
    message: string;
    statusCode?: number;
    statusText?: string;
    data?: unknown;
    url?: string;
    method?: string;
    timestamp: string;
    stack?: string;
}

export class ApiError extends Error {
    public readonly type: ErrorType;
    public readonly statusCode?: number;
    public readonly statusText?: string;
    public readonly data?: unknown;
    public readonly url?: string;
    public readonly method?: string;
    public readonly timestamp: string;

    constructor(details: ApiErrorDetails) {
        super(details.message);
        this.name = 'ApiError';
        this.type = details.type;
        this.statusCode = details.statusCode;
        this.statusText = details.statusText;
        this.data = details.data;
        this.url = details.url;
        this.method = details.method;
        this.timestamp = details.timestamp;

        if (details.stack) {
            this.stack = details.stack;
        }

        Object.setPrototypeOf(this, ApiError.prototype);
    }
}

export class BaseErrorHandler {
    private static instance: BaseErrorHandler;
    private errorListeners: Array<(error: ApiError) => void> = [];

    private constructor() {
    }

    static getInstance(): BaseErrorHandler {
        if (!BaseErrorHandler.instance) {
            BaseErrorHandler.instance = new BaseErrorHandler();
        }
        return BaseErrorHandler.instance;
    }

    private notifyListeners(error: ApiError): void {
        this.errorListeners.forEach(listener => {
            try {
                listener(error);
            } catch (err) {
                console.error('Error in error listener:', err);
            }
        });
    }

    handleNetworkError(error: Error, url?: string, method?: string): ApiError {
        const apiError = new ApiError({
            type: ErrorType.NETWORK_ERROR,
            message: `Network error: ${error.message}`,
            url,
            method,
            timestamp: new Date().toISOString(),
            stack: error.stack,
        });

        this.logError(apiError);
        this.notifyListeners(apiError);
        return apiError;
    }

    handleTimeoutError(url?: string, method?: string): ApiError {
        const apiError = new ApiError({
            type: ErrorType.TIMEOUT_ERROR,
            message: 'Request timeout - The request took too long to complete',
            url,
            method,
            timestamp: new Date().toISOString(),
        });

        this.logError(apiError);
        this.notifyListeners(apiError);
        return apiError;
    }

    handleHttpError(
        statusCode: number,
        statusText: string,
        data: unknown,
        url?: string,
        method?: string
    ): ApiError {
        const apiError = new ApiError({
            type: ErrorType.HTTP_ERROR,
            message: this.getHttpErrorMessage(statusCode, statusText),
            statusCode,
            statusText,
            data,
            url,
            method,
            timestamp: new Date().toISOString(),
        });

        this.logError(apiError);
        this.notifyListeners(apiError);
        return apiError;
    }

    handleParseError(error: Error, url?: string, method?: string): ApiError {
        const apiError = new ApiError({
            type: ErrorType.PARSE_ERROR,
            message: `Failed to parse response: ${error.message}`,
            url,
            method,
            timestamp: new Date().toISOString(),
            stack: error.stack,
        });

        this.logError(apiError);
        this.notifyListeners(apiError);
        return apiError;
    }

    handleUnknownError(error: Error | unknown, url?: string, method?: string): ApiError {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        const errorStack = error instanceof Error ? error.stack : undefined;

        const apiError = new ApiError({
            type: ErrorType.UNKNOWN_ERROR,
            message: errorMessage,
            url,
            method,
            timestamp: new Date().toISOString(),
            stack: errorStack,
        });

        this.logError(apiError);
        this.notifyListeners(apiError);
        return apiError;
    }

    private getHttpErrorMessage(statusCode: number, statusText: string): string {
        const errorMessages: Record<number, string> = {
            400: 'Bad Request - The request could not be understood',
            401: 'Unauthorized - Authentication required',
            403: 'Forbidden - Access denied',
            404: 'Not Found - The requested resource was not found',
            405: 'Method Not Allowed - Invalid request method',
            408: 'Request Timeout - The request took too long',
            409: 'Conflict - Request conflicts with current state',
            422: 'Unprocessable Entity - Validation failed',
            429: 'Too Many Requests - Rate limit exceeded',
            500: 'Internal Server Error - Something went wrong on the server',
            502: 'Bad Gateway - Invalid response from upstream server',
            503: 'Service Unavailable - Server is temporarily unavailable',
            504: 'Gateway Timeout - Upstream server timed out',
        };

        return errorMessages[statusCode] || `HTTP Error ${statusCode}: ${statusText}`;
    }

    private logError(error: ApiError): void {
        const isDevelopment = process.env.NODE_ENV === 'development';

        if (isDevelopment) {
            console.group(`API Error [${error.type}]`);
            console.error('Message:', error.message);
            if (error.statusCode) console.error('Status:', error.statusCode);
            if (error.url) console.error('URL:', error.url);
            if (error.method) console.error('Method:', error.method);
            if (error.data) console.error('Data:', error.data);
            console.error('Timestamp:', error.timestamp);
            if (error.stack) console.error('Stack:', error.stack);
            console.groupEnd();
        } else {
            console.error(`[${error.type}] ${error.message}`, {
                statusCode: error.statusCode,
                url: error.url,
                timestamp: error.timestamp,
            });
        }
    }
}

export const errorHandler = BaseErrorHandler.getInstance();
