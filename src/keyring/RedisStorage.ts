
import { IKeyStorage, IPlainObject } from './types';
import { Promise, _ } from '../utils';
import { RedisClient } from 'redis';

/**
 * MemoryStorage class. For tests.
 */
export class RedisStorage implements IKeyStorage<string> {
    private _client: any;
    private client: RedisClient;
    constructor(client: RedisClient) {
        this._client = Promise.promisifyAll(client);
    }

    get(key: string): Promise<string[]> {
        return this._client.getAsync(key).then(value => {
            if (value) {
                return value.split('|');
            }
            return [];
        });
    }

    mget(keys: string[]): Promise<IPlainObject<string[]>> {
        const data: IPlainObject<string[]> = {};
        return this._client.mgetAsync(keys).then(result => {
            result.forEach((item, i) => {
                if (item) {
                    data[keys[i]] = item.split('|');
                }
            });
            return data;
        });
        // return Promise.map(keys, key => {
        //     return this.get(key).then(values => { data[key] = values; });
        // }).then(() => data);
    }

    add(key: string, items: string[]): Promise<number> {
        return this.get(key).then(values => {
            values = values.concat(items);
            values = _.uniq(values);
            return this._client.setAsync(key, values.join('|')).then(() => values.length);
        });
        // return this.remove(key).then(() => {
        //     return this._client.saddAsync(key, items);
        // });
    }

    set(key: string, items: string[]): Promise<number> {
        return this.remove(key).then(() => {
            return this.add(key, items);
        });
    }

    remove(key: string): Promise<number> {
        return this._client.delAsync(key);
    }

    removeItems(key: string, items: string[]): Promise<number> {
        return this.get(key).then(values => {
            items.forEach(item => {
                const index = values.indexOf(item);
                if (index > -1) {
                    values.splice(index, 1);
                }
            });
            return this._client.setAsync(key, values.join('|')).then(() => values.length);
        });
        // return this._client.sremAsync(key, items);
    }
}
