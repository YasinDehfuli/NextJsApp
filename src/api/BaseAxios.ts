import axios, {AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError} from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

const baseAxios: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

baseAxios.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = typeof window !== 'undefined'
            ? localStorage.getItem('token')
            : null;

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (process.env.NODE_ENV === 'development') {
            console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
        }

        return config;
    },
    (error: AxiosError) => {
        console.error('[Request Error]', error);
        return Promise.reject(error);
    }
);

baseAxios.interceptors.response.use(
    (response: AxiosResponse) => {
        if (process.env.NODE_ENV === 'development') {
            console.log(`[API Response] ${response.config.url}`, response.status);
        }
        return response;
    },
    (error: AxiosError) => {
        if (error.response) {
            const {status, data} = error.response;

            switch (status) {
                case 401:
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('token');
                    }
                    console.error('[401 Unauthorized]', data);
                    break;
                case 403:
                    console.error('[403 Forbidden]', data);
                    break;
                case 404:
                    console.error('[404 Not Found]', data);
                    break;
                case 500:
                    console.error('[500 Server Error]', data);
                    break;
                default:
                    console.error(`[Error ${status}]`, data);
            }
        } else if (error.request) {
            console.error('[Network Error]', error.message);
        } else {
            console.error('[Request Setup Error]', error.message);
        }

        return Promise.reject(error);
    }
);

export default baseAxios;