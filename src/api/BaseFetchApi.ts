import {storage} from '@/services/storageService';
import {errorHandler, ApiError, ErrorType} from '@/utils/BaseErrorHandler';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://jsonplaceholder.typicode.com';

interface FetchConfig extends RequestInit {
    baseURL?: string;
    timeout?: number;
    params?: Record<string, string | number | boolean>;
    transformRequest?: ((data: unknown, headers: Headers) => unknown)[];
    transformResponse?: ((data: unknown) => unknown)[];
}

interface RequestInterceptor {
    onFulfilled?: (config: FetchRequestConfig) => FetchRequestConfig | Promise<FetchRequestConfig>;
    onRejected?: (error: Error) => Error | Promise<Error>;
}

interface ResponseInterceptor {
    onFulfilled?: (response: Response) => Response | Promise<Response>;
    onRejected?: (error: Error) => Error | Promise<Error>;
}

interface FetchRequestConfig {
    url: string;
    method: string;
    headers: Headers;
    body?: BodyInit | null;
    signal?: AbortSignal;
}

class BaseFetchApi {
    private baseURL: string;
    private defaultHeaders: Headers;
    private timeout: number;
    private transformRequest: ((data: unknown, headers: Headers) => unknown)[];
    private transformResponse: ((data: unknown) => unknown)[];
    private requestInterceptors: RequestInterceptor[] = [];
    private responseInterceptors: ResponseInterceptor[] = [];

    constructor(config: FetchConfig = {}) {
        this.baseURL = config.baseURL || BASE_URL;
        this.timeout = config.timeout || 30000;
        this.defaultHeaders = new Headers({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...Object.fromEntries(new Headers(config.headers).entries()),
        });

        this.transformRequest = config.transformRequest || [
            (data, headers) => {
                if (data && typeof data === 'object' && headers.get('Content-Type') === 'application/json') {
                    return JSON.stringify(data);
                }
                return data;
            }
        ];

        this.transformResponse = config.transformResponse || [
            async (response) => {
                const contentType = (response as Response).headers?.get('content-type');
                if (contentType?.includes('application/json')) {
                    return await (response as Response).json();
                }
                return await (response as Response).text();
            }
        ];

        this.setupInterceptors();
    }

    private setupInterceptors() {
        this.requestInterceptors.push({
            onFulfilled: (config: FetchRequestConfig) => {
                const token = storage.get<string>('user', '');

                if (token) {
                    config.headers.set('Authorization', `Bearer ${token}`);
                }

                return config;
            },
            onRejected: (error: Error) => {
                return Promise.reject(error);
            }
        });

        this.responseInterceptors.push({
            onFulfilled: (response: Response) => {
                return response;
            },
            onRejected: async (error: Error) => {
                if (error instanceof Response && error.status === 401) {
                    storage.remove('user');
                }

                return Promise.reject(error);
            }
        });
    }

    private async applyRequestInterceptors(config: FetchRequestConfig): Promise<FetchRequestConfig> {
        let modifiedConfig = config;

        for (const interceptor of this.requestInterceptors) {
            if (interceptor.onFulfilled) {
                try {
                    modifiedConfig = await interceptor.onFulfilled(modifiedConfig);
                } catch (error) {
                    if (interceptor.onRejected) {
                        await interceptor.onRejected(error as Error);
                    }
                    throw error;
                }
            }
        }

        return modifiedConfig;
    }

    private async applyResponseInterceptors(response: Response): Promise<Response> {
        let modifiedResponse = response;

        for (const interceptor of this.responseInterceptors) {
            if (!modifiedResponse.ok && interceptor.onRejected) {
                try {
                    await interceptor.onRejected(modifiedResponse as unknown as Error);
                } catch (error) {
                    throw error;
                }
            } else if (interceptor.onFulfilled) {
                try {
                    modifiedResponse = await interceptor.onFulfilled(modifiedResponse);
                } catch (error) {
                    if (interceptor.onRejected) {
                        await interceptor.onRejected(error as Error);
                    }
                    throw error;
                }
            }
        }

        return modifiedResponse;
    }

    private createAbortSignal(timeoutMs: number): AbortSignal {
        const controller = new AbortController();
        setTimeout(() => controller.abort(), timeoutMs);
        return controller.signal;
    }

    private buildUrl(url: string, params?: Record<string, string | number | boolean>): string {
        if (!params || Object.keys(params).length === 0) {
            return url;
        }

        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            searchParams.append(key, String(value));
        });

        const queryString = searchParams.toString();
        return queryString ? `${url}?${queryString}` : url;
    }


    private async request<T = unknown>(
        url: string,
        options: RequestInit & { timeout?: number; params?: Record<string, string | number | boolean> } = {}
    ): Promise<T> {
        const urlWithParams = this.buildUrl(url, options.params);
        const fullUrl = urlWithParams.startsWith('http') ? urlWithParams : `${this.baseURL}${urlWithParams}`;
        const headers = new Headers(this.defaultHeaders);

        if (options.headers) {
            const customHeaders = new Headers(options.headers);
            customHeaders.forEach((value, key) => {
                headers.set(key, value);
            });
        }

        let body = options.body;

        if (body && this.transformRequest.length > 0) {
            for (const transformer of this.transformRequest) {
                body = transformer(body, headers) as BodyInit;
            }
        }

        const requestConfig: FetchRequestConfig = {
            url: fullUrl,
            method: options.method || 'GET',
            headers,
            body,
            signal: this.createAbortSignal(options.timeout || this.timeout),
        };

        let modifiedConfig: FetchRequestConfig;

        try {
            modifiedConfig = await this.applyRequestInterceptors(requestConfig);
        } catch (error) {
            throw errorHandler.handleUnknownError(error, fullUrl, requestConfig.method);
        }

        try {
            const response = await fetch(modifiedConfig.url, {
                method: modifiedConfig.method,
                headers: modifiedConfig.headers,
                body: modifiedConfig.body,
                signal: modifiedConfig.signal,
                ...options,
            });

            const modifiedResponse = await this.applyResponseInterceptors(response);

            if (!modifiedResponse.ok) {
                let errorData: unknown;
                try {
                    const contentType = modifiedResponse.headers.get('content-type');
                    if (contentType?.includes('application/json')) {
                        errorData = await modifiedResponse.json();
                    } else {
                        errorData = await modifiedResponse.text();
                    }
                } catch {
                    errorData = modifiedResponse.statusText;
                }

                throw errorHandler.handleHttpError(
                    modifiedResponse.status,
                    modifiedResponse.statusText,
                    errorData,
                    modifiedConfig.url,
                    modifiedConfig.method
                );
            }

            let responseData: unknown = modifiedResponse;
            try {
                for (const transformer of this.transformResponse) {
                    responseData = await transformer(responseData);
                }
            } catch (parseError) {
                throw errorHandler.handleParseError(
                    parseError as Error,
                    modifiedConfig.url,
                    modifiedConfig.method
                );
            }

            return responseData as T;
        } catch (error) {
            if ((error as Error).name === 'AbortError') {
                throw errorHandler.handleTimeoutError(modifiedConfig.url, modifiedConfig.method);
            }

            if ((error as Error).name === 'TypeError' && (error as Error).message.includes('fetch')) {
                throw errorHandler.handleNetworkError(
                    error as Error,
                    modifiedConfig.url,
                    modifiedConfig.method
                );
            }

            throw error;
        }
    }

    async get<T = unknown>(
        url: string,
        config?: RequestInit & { timeout?: number; params?: Record<string, string | number | boolean> }
    ): Promise<T> {
        return this.request<T>(url, {...config, method: 'GET'});
    }

    async post<T = unknown>(
        url: string,
        data?: unknown,
        config?: RequestInit & { timeout?: number; params?: Record<string, string | number | boolean> }
    ): Promise<T> {
        return this.request<T>(url, {...config, method: 'POST', body: data as BodyInit});
    }

    async put<T = unknown>(
        url: string,
        data?: unknown,
        config?: RequestInit & { timeout?: number; params?: Record<string, string | number | boolean> }
    ): Promise<T> {
        return this.request<T>(url, {...config, method: 'PUT', body: data as BodyInit});
    }

    async patch<T = unknown>(
        url: string,
        data?: unknown,
        config?: RequestInit & { timeout?: number; params?: Record<string, string | number | boolean> }
    ): Promise<T> {
        return this.request<T>(url, {...config, method: 'PATCH', body: data as BodyInit});
    }

    async delete<T = unknown>(
        url: string,
        config?: RequestInit & { timeout?: number; params?: Record<string, string | number | boolean> }
    ): Promise<T> {
        return this.request<T>(url, {...config, method: 'DELETE'});
    }
}

const baseFetchApi = new BaseFetchApi({
    baseURL: BASE_URL,
    timeout: 30000,
});

export default baseFetchApi;
export {BaseFetchApi, errorHandler, ApiError, ErrorType};
export type {FetchConfig, FetchRequestConfig};
