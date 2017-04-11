
import { IKeyStorage, IPlainObject } from './types';
import { Promise } from '../utils';
import { RedisClient } from 'redis';

/**
 * MemoryStorage class. For tests.
 */
export class RedisStorage implements IKeyStorage<string> {
    private _client: any;
    // private client: RedisClient;
    constructor(client: RedisClient) {
        this._client = Promise.promisifyAll(client);
    }

    get(key: string): Promise<string[]> {
        return this._client.smembersAsync(key);
    }

    mget(keys: string[]): Promise<IPlainObject<string[]>> {
        const data = {};
        return Promise.map(keys, key => {
            return this.get(key).then(values => { data[key] = values; });
        }).then(() => data);
    }

    add(key: string, items: string[]): Promise<number> {
        return this.remove(key).then(() => {
            return this._client.saddAsync(key, items);
        });
    }

    set(key: string, items: string[]): Promise<number> {
        return this.remove(key).then(() => {
            return this.add(key, items);
        });
    }

    remove(key: string): Promise<number> {
        return this._client.delAsync(key);
    }

    del(key: string, items: string[]): Promise<number> {
        return this._client.sremAsync(key, items);
    }
}
