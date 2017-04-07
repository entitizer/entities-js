
import { IKeyStorage } from './types';
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

    get(key: string): Promise<string> {
        return this._client.getAsync(key);
    }

    mget(keys: string[]) {
        return this._client.mgetAsync(keys);
    }

    set(key: string, value: string) {
        return this._client.setAsync(key, value);
    }

    remove(key: string) {
        return this._client.delAsync(key);
    }
}
