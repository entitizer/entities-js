
const debug = require('debug')('keyring:name');

import { IKeyStorage, IPlainObject } from './types';
import { md5, _, Promise } from '../utils';
import { EntityNamesBuilder } from 'entitizer.models-builder';
const atonic = require('atonic');

export class NameKeyring {
    private _storage: IKeyStorage<string>;

    constructor(storage: IKeyStorage<string>) {
        if (!storage) {
            throw new Error('`storage` param is required');
        }
        this._storage = storage;
    }

    getManyIds(keys: string[]): Promise<IPlainObject<string[]>> {
        return this._storage.mget(keys);
    }

    getIds(name: string, lang: string): Promise<string[]> {
        const key = NameKeyring.formatKey(name, lang);

        return this.getIdsByKey(key);
    }

    getIdsByKey(key: string): Promise<string[]> {
        return this._storage.get(key).then(value => value || []);
    }

    addName(entityId: string, name: string, lang: string) {
        return this.addNames(entityId, [name], lang);
    }

    addNames(entityId: string, names: string[], lang: string): Promise<number> {
        let count = 0;
        const keys = {};
        return Promise.each(names, name => {
            const key = NameKeyring.formatKey(name, lang);
            if (keys[key]) {
                return;
            }
            keys[key] = true;
            return this._storage.add(key, [entityId]).then(r => {
                count += r;
            });
        }).then(() => count);
    }

    deleteName(entityId: string, name: string, lang: string) {
        return this.deleteNames(entityId, [name], lang);
    }

    deleteNames(entityId: string, names: string[], lang: string): Promise<string[]> {
        let count = 0;
        const keys = {};
        return Promise.each(names, name => {
            const key = NameKeyring.formatKey(name, lang);
            if (keys[key]) {
                return;
            }
            keys[key] = true;
            return this._storage.removeItems(key, [entityId]).then(r => {
                count += r;
            });
        }).then(() => count);
    }

    static formatKey(name: string, lang: string): string {
        debug('format key for', name, lang);
        const uname = EntityNamesBuilder.formatUniqueName(name);
        debug('uname=', uname);
        const key = [lang.toUpperCase(), md5(uname)].join('-');
        debug('key=', key);

        return key;
    }
}
