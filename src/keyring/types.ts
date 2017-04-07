
export type IPlainObject<T> = {
    [index: string]: T
}

export interface IKeyStorage<T> {
    set(key: string, value: T): Promise<boolean>;
    get(key: string): Promise<T>;
    mget(keys: string[]): Promise<IPlainObject<T>>
    remove(key: string): Promise<boolean>;
}
