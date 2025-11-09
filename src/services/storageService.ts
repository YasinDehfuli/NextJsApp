type StorageKey = 'cart' | 'user' | 'preferences';

class StorageService {
    private isAvailable(): boolean {
        return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
    }

    set<T>(key: StorageKey, value: T): void {
        if (!this.isAvailable()) return;

        try {
            const serialized = JSON.stringify(value);
            localStorage.setItem(key, serialized);
        } catch (error) {
            console.error(`Error saving (${key}):`, error);
        }
    }

    get<T>(key: StorageKey, defaultValue: T): T {
        if (!this.isAvailable()) return defaultValue;

        try {
            const item = localStorage.getItem(key);
            if (item === null) return defaultValue;

            return JSON.parse(item) as T;
        } catch (error) {
            console.error(`error reading (${key}):`, error);
            return defaultValue;
        }
    }

    remove(key: StorageKey): void {
        if (!this.isAvailable()) return;

        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`error removing (${key}):`, error);
        }
    }

    clear(): void {
        if (!this.isAvailable()) return;

        try {
            localStorage.clear();
        } catch (error) {
            console.error('error clearing:', error);
        }
    }
}

export const storage = new StorageService();
