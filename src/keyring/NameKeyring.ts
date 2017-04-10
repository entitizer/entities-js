
const debug = require('debug')('keyring:name');

import { IKeyStorage, IPlainObject } from './types';
import { Keyring } from './Keyring';
import { md5, _, Promise } from '../utils';
import { EntityNamesBuilder } from 'entitizer.models-builder';
const atonic = require('atonic');

export class NameKeyring extends Keyring<string> {

    /**
     * Gets entities ids with the same name
     * @param name An entity name
     * @param lang Name language
     */
    getIds(name: string, lang: string): Promise<string[]> {
        const key = NameKeyring.formatKey(name, lang);

        return this.get(key).then(value => value && value.split('|') || []);
    }

    /**
     * Gets entities ids with the same name key
     * @param key Name key
     */
    getIdsByKey(key: string): Promise<string[]> {
        return this.get(key).then(value => value && value.split('|') || []);
    }

    addNames(entityId: string, names: string[], lang: string): Promise<string[]> {
        return Promise.each(names, name => this.addName(entityId, name, lang));
    }

    addName(entityId: string, name: string, lang: string): Promise<string[]> {
        const key = NameKeyring.formatKey(name, lang);

        return this.addNameByKey(entityId, key);
    }

    addNameByKey(entityId: string, key: string): Promise<string[]> {
        return this.getIdsByKey(key)
            .then(ids => {
                if (~ids.indexOf(entityId)) {
                    return ids;
                }
                ids.push(entityId);
                if (ids.length > 1) {
                    ids = _.uniq(ids);
                }

                return this.set(key, ids.join('|')).then(() => ids);
            });
    }

    deleteNames(entityId: string, names: string[], lang: string): Promise<string[]> {
        return Promise.each(names, name => this.deleteName(entityId, name, lang));
    }

    deleteName(entityId: string, name: string, lang: string): Promise<string[]> {
        const key = NameKeyring.formatKey(name, lang);

        return this.deleteNameByKey(entityId, key);
    }

    deleteNameByKey(entityId: string, key: string): Promise<string[]> {
        return this.getIdsByKey(key)
            .then(ids => {
                const index = ids.indexOf(entityId);
                // entityId not prezent in this key
                if (index < 0) {
                    return [];
                }
                ids.splice(index, 1);

                if (ids.length === 0) {
                    return this.remove(key).then(() => []);
                }

                return this.set(key, ids.join('|')).then(() => ids);
            });
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
