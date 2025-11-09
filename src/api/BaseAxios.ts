import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { storage } from '@/services/storageService';

// https://jsonplaceholder.typicode.com is a sample for api's NEXT_PUBLIC_API_URL is same with jsonplace holder url
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://jsonplaceholder.typicode.com';

const baseAxios: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: 30000,
    transformRequest: [
        (data, headers) => {
            if (data && typeof data === 'object' && headers?.['Content-Type'] === 'application/json') {
                return JSON.stringify(data);
            }
            return data;
        }
    ],
    transformResponse: [
        (data) => {
            if (typeof data === 'string') {
                try {
                    return JSON.parse(data);
                } catch {
                    return data;
                }
            }
            return data;
        }
    ],
});

baseAxios.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = storage.get<string>('user', '');

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error: AxiosError) => {
        console.error('Request error:', error.message);
        return Promise.reject(error);
    }
);

baseAxios.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            storage.remove('user');
        }

        const errorMessage = error.response?.data || error.message || 'An error occurred';
        console.error('Response error:', errorMessage);

        return Promise.reject(error);
    }
);

export default baseAxios;