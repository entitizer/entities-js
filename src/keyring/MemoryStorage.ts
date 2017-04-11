
import { IKeyStorage, IPlainObject } from './types';
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

    get(key: string): Promise<T[]> {
        return new Promise((resolve) => {
            const data = this._store.get(key);
            resolve(data);
        });
    }

    add(key: string, items: T[]): Promise<number> {
        return this.get(key).then(values => {
            let count = 0;
            items.forEach(item => {
                if (!values || values.indexOf(item) < 0) {
                    values = values || [];
                    values.push(item);
                    count++;
                }
            });

            return count;
        });
    }

    mget(keys: string[]): Promise<IPlainObject<T[]>> {
        return new Promise((resolve) => {
            const data = this._store.mget(keys);
            resolve(data);
        });
    }

    set(key: string, items: T[]): Promise<number> {
        return new Promise((resolve) => {
            this._store.set(key, items);
            resolve(items.length);
        });
    }

    remove(key: string): Promise<number> {
        return new Promise((resolve) => {
            this._store.del(key);
            resolve(1);
        });
    }

    del(key: string, items: T[]): Promise<number> {
        return this.get(key).then(data => {
            if (!data) {
                return 0;
            }
            let count = 0;
            items.forEach(item => {
                if (data.indexOf(item) > -1) {
                    data.splice(data.indexOf(item), 1);
                    count++;
                }
            });
            return count;
        });
    }
}
