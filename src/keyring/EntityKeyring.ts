
// const debug = require('debug')('keyring:alias');

import { IKeyStorage, IPlainObject } from './types';
import { Keyring } from './Keyring';
import { md5, _, Promise } from '../utils';

export class EntityKeyring<T> extends Keyring<T> {
    addEntity(id: string, lang: string, entity: T) {
        const key = EntityKeyring.formatKey(id, lang);
        return this.addEntityByKey(key, entity);
    }

    addEntityByKey(key: string, entity: T) {
        return this.set(key, entity);
    }

    static formatKey(id: string, lang: string): string {
        return [lang.trim().toUpperCase(), id].join('-');
    }
}
