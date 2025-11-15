import baseFetchApi from '../BaseFetchApi';
import {PhotoTypes} from '@/types/photoTypes';

export const getAllPhotos = async (): Promise<PhotoTypes[]> => {
    return await baseFetchApi.get<PhotoTypes[]>('/photos');
};