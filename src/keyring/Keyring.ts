
import { IKeyStorage, IPlainObject } from './types';

export class Keyring<T> implements IKeyStorage<T> {
    private _storage: IKeyStorage<T>;

    constructor(storage: IKeyStorage<T>) {
        if (!storage) {
            throw new Error('`storage` param is required');
        }
        this._storage = storage;
    }

    get(key: string) {
        return this._storage.get(key);
    }

    mget(keys: string[]): Promise<IPlainObject<T>> {
        return this._storage.mget(keys);
    }

    set(key: string, value: T) {
        return this._storage.set(key, value);
    }

    remove(key: string) {
        return this._storage.remove(key);
    }
}
