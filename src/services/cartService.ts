import { CartItem } from '@/types/productTypes';
import { storage } from './storageService';

class CartService {
    private readonly STORAGE_KEY = 'cart' as const;

    getCart(): CartItem[] {
        return storage.get<CartItem[]>(this.STORAGE_KEY, []);
    }

    saveCart(cart: CartItem[]): void {
        storage.set(this.STORAGE_KEY, cart);
    }

    clearCart(): void {
        storage.set(this.STORAGE_KEY, []);
    }
}

export const cartService = new CartService();
