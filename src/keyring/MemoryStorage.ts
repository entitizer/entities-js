
import { IKeyStorage } from './types';
import { Promise } from '../utils';
const NodeCache = require('node-cache');

/**
 * MemoryStorage class. For tests.
 */
export class MemoryStorage<T> implements IKeyStorage<T> {
    _store: any;
    constructor(filename: string) {
        this._store = new NodeCache();
    }

    get(key: string) {
        return new Promise((resolve) => {
            const data = this._store.get(key);
            resolve(data);
        });
    }

    mget(keys: string[]) {
        return new Promise((resolve) => {
            const data = this._store.mget(keys);
            resolve(data);
        });
    }

    set(key: string, value: T) {
        return new Promise((resolve) => {
            this._store.set(key, value);
            resolve(true);
        });
    }

    remove(key: string) {
        return new Promise((resolve) => {
            this._store.del(key);
            resolve(true);
        });
    }
}
