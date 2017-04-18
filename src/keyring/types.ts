
export type IPlainObject<T> = {
    [index: string]: T
}

export interface IKeyStorage<T> {
    set(key: string, items: T[]): Promise<number>;
    add(key: string, items: T[]): Promise<number>;
    get(key: string): Promise<T[]>;
    mget(keys: string[]): Promise<IPlainObject<T[]>>
    removeItems(key: string, items: T[]): Promise<number>;
    remove(key: string): Promise<number>;
}
