import { getAllPosts } from '@/api/posts/route';
import { getAllPhotos } from '@/api/photos/route';
import { Product } from '@/types/productTypes';
import { generatePrice } from '@/utils/priceGenerator';

let productsCache: Product[] | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 5 * 60 * 1000;

const isCacheValid = (): boolean => {
    if (!productsCache || !cacheTimestamp) return false;
    return Date.now() - cacheTimestamp < CACHE_DURATION;
};

export const getAllProducts = async (): Promise<Product[]> => {
    if (isCacheValid() && productsCache) {
        return productsCache;
    }

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

    productsCache = products;
    cacheTimestamp = Date.now();

    return products;
};
