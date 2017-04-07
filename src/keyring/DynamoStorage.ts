
import { IKeyStorage } from './types';
import { Promise } from '../utils';

const vogels = require('vogels');
const Joi = require('joi');

/**
 * DynamoStorage class.
 */
export class DynamoStorage<T> implements IKeyStorage<T> {
    private _model: any;

    constructor(tablename: string, config?: any) {
        this._model = createDataModel(tablename, tablename);
        this._model = Promise.promisifyAll(this._model);
        if (config) {
            this._model.config(config);
        }
    }

    get(key: string) {
        return this._model.getAsync(key)
            .then(item => item && fromJson<T>(item.get('data')));
    }

    mget(keys: string[]) {
        return this._model.getItemsAsync(keys)
            .then(items => {
                const data = {};

                if (items && items.length) {
                    items.forEach(item => {
                        data[item.get('key')] = fromJson<T>(item.get('data'));
                    });
                }

                return data;
            });
    }

    set(key: string, value: T) {
        return this._model.createAsync({ key: key, data: toJson(value) }, { overwrite: true })
            .then(() => true);
    }

    remove(key: string) {
        return this._model.destroyAsync(key)
            .then(() => true);
    }

    createTable() {
        return this._model.createTableAsync();
    }

    deleteTable() {
        return this._model.deleteTableAsync();
    }
}

function createDataModel(name: string, tableName: string) {
    return vogels.define(name, {
        tableName: tableName,
        hashKey: 'key',
        timestamps: false,
        schema: {
            key: Joi.string().trim().max(40).required(),
            data: Joi.string().trim().max(1000).required()
        }
    });
}

function toJson(value: any): string {
    return JSON.stringify(value);
}

function fromJson<T>(value: string): T {
    return JSON.parse(value);
}
