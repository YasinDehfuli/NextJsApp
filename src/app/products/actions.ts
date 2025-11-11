'use server';

import { getAllPosts } from '@/api/posts/route';
import { getAllPhotos } from '@/api/photos/route';
import { Product } from '@/types/productTypes';
import { generatePrice } from '@/utils/priceGenerator';
import { unstable_cache } from 'next/cache';

export const getProducts = unstable_cache(
    async (): Promise<Product[]> => {
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
    },
    ['products-list'],
    {
        revalidate: 300,
        tags: ['products'],
    }
);
