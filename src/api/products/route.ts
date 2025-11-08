import { getAllPosts } from '../posts/route';
import { getAllPhotos } from '../photos/route';
import { Product } from '@/types/productTypes';

const generatePrice = (id: number): number => {
    const seed = id * 137.5;
    return parseFloat((10 + (seed % 90)).toFixed(2));
};

export const getAllProducts = async (): Promise<Product[]> => {
    const [posts, photos] = await Promise.all([getAllPosts(), getAllPhotos()]);

    const products: Product[] = posts.slice(0, 50).map((post) => {
        const photo = photos.find(p => p.id === post.id) || photos[0];
        return {
            id: post.id,
            title: post.title,
            description: post.body,
            image: photo.url,
            thumbnailUrl: photo.thumbnailUrl,
            price: generatePrice(post.id),
            userId: post.userId,
        };
    });

    return products;
};

export const getProductById = async (id: number): Promise<Product | null> => {
    const products = await getAllProducts();
    return products.find(product => product.id === id) || null;
};

export const getProductsByUserId = async (userId: number): Promise<Product[]> => {
    const products = await getAllProducts();
    return products.filter(product => product.userId === userId);
};