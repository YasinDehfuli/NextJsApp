import baseAxios from '../BaseAxios';
import {PhotoTypes} from '@/types/photoTypes';

export const getAllPhotos = async (): Promise<PhotoTypes[]> => {
    const response = await baseAxios.get<PhotoTypes[]>('/photos');
    return response.data;
};

export const getPhotoById = async (id: number): Promise<PhotoTypes> => {
    const response = await baseAxios.get<PhotoTypes>(`/photos/${id}`);
    return response.data;
};

export const getPhotosByAlbumId = async (albumId: number): Promise<PhotoTypes[]> => {
    const response = await baseAxios.get<PhotoTypes[]>(`/photos?albumId=${albumId}`);
    return response.data;
};

export const getPhotosPaginated = async (start: number, limit: number): Promise<PhotoTypes[]> => {
    const response = await baseAxios.get<PhotoTypes[]>(`/photos?_start=${start}&_limit=${limit}`);
    return response.data;
};

export const createPhoto = async (photo: Partial<PhotoTypes>): Promise<PhotoTypes> => {
    const response = await baseAxios.post<PhotoTypes>('/photos', photo);
    return response.data;
};

export const updatePhoto = async (id: number, photo: Partial<PhotoTypes>): Promise<PhotoTypes> => {
    const response = await baseAxios.put<PhotoTypes>(`/photos/${id}`, photo);
    return response.data;
};

export const patchPhoto = async (id: number, photo: Partial<PhotoTypes>): Promise<PhotoTypes> => {
    const response = await baseAxios.patch<PhotoTypes>(`/photos/${id}`, photo);
    return response.data;
};

export const deletePhoto = async (id: number): Promise<void> => {
    await baseAxios.delete(`/photos/${id}`);
};