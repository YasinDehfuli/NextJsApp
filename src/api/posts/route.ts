import baseFetchApi from '../BaseFetchApi';
import {PostTypes} from '@/types/postTypes';

export const getAllPosts = async (): Promise<PostTypes[]> => {
    return await baseFetchApi.get<PostTypes[]>('/posts');
};
