import baseAxios from '../BaseAxios';
import {PostTypes} from '@/types/postTypes';

export const getAllPosts = async (): Promise<PostTypes[]> => {
    const response = await baseAxios.get<PostTypes[]>('/posts');
    return response.data;
};

export const getPostById = async (id: number): Promise<PostTypes> => {
    const response = await baseAxios.get<PostTypes>(`/posts/${id}`);
    return response.data;
};

export const getPostsByUserId = async (userId: number): Promise<PostTypes[]> => {
    const response = await baseAxios.get<PostTypes[]>(`/posts?userId=${userId}`);
    return response.data;
};

export const createPost = async (post: Partial<PostTypes>): Promise<PostTypes> => {
    const response = await baseAxios.post<PostTypes>('/posts', post);
    return response.data;
};

export const updatePost = async (id: number, post: Partial<PostTypes>): Promise<PostTypes> => {
    const response = await baseAxios.put<PostTypes>(`/posts/${id}`, post);
    return response.data;
};

export const patchPost = async (id: number, post: Partial<PostTypes>): Promise<PostTypes> => {
    const response = await baseAxios.patch<PostTypes>(`/posts/${id}`, post);
    return response.data;
};

export const deletePost = async (id: number): Promise<void> => {
    await baseAxios.delete(`/posts/${id}`);
};

export const getPostComments = async (postId: number) => {
    const response = await baseAxios.get(`/posts/${postId}/comments`);
    return response.data;
};

export const getCommentsByPostId = async (postId: number) => {
    const response = await baseAxios.get(`/comments?postId=${postId}`);
    return response.data;
};
