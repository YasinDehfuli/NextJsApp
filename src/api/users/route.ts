import baseAxios from '../BaseAxios';
import {UsersType, UserType} from '@/types/userTypes';

export const getAllUsers = async (): Promise<UsersType[]> => {
    const response = await baseAxios.get<UsersType[]>('/users');
    return response.data;
};

export const getUserById = async (id: number): Promise<UserType> => {
    const response = await baseAxios.get<UserType>(`/users/${id}`);
    return response.data;
};

export const createUser = async (user: Partial<UsersType>): Promise<UsersType> => {
    const response = await baseAxios.post<UsersType>('/users', user);
    return response.data;
};

export const updateUser = async (id: number, user: Partial<UserType>): Promise<UserType> => {
    const response = await baseAxios.put<UserType>(`/users/${id}`, user);
    return response.data;
};

export const patchUser = async (id: number, user: Partial<UserType>): Promise<UserType> => {
    const response = await baseAxios.patch<UserType>(`/users/${id}`, user);
    return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
    await baseAxios.delete(`/users/${id}`);
};

export const getUserPosts = async (userId: number) => {
    const response = await baseAxios.get(`/users/${userId}/posts`);
    return response.data;
};

export const getUserTodos = async (userId: number) => {
    const response = await baseAxios.get(`/users/${userId}/photos`);
    return response.data;
};