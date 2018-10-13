interface CacheData {
    [key: string]: any;
}
export declare class Cache {
    protected _data: CacheData;
    constructor();
    memoize<T>(action: () => Promise<T>, cacheKey: string, checkCachedValue?: (value: T) => Promise<boolean>): () => Promise<T>;
    get<T>(cacheKey: string): T | undefined;
    set<T>(cacheKey: string, value: T): void;
    delete(cacheKey: string): void;
}
interface DurableCacheOptions {
    filePath: string;
}
export declare class DurableCache extends Cache {
    private options;
    constructor(options: DurableCacheOptions);
    private loadFromFile;
    save(): void;
    set<T>(cacheKey: string, value: T): void;
}
export declare const cache: DurableCache;
export default cache;
