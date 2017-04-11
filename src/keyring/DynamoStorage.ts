
import { IKeyStorage, IPlainObject } from './types';
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

    get(key: string): Promise<T[]> {
        return this._model.getAsync(key)
            .then(item => item && item.get('data'));
    }

    mget(keys: string[]): Promise<IPlainObject<T[]>> {
        return this._model.getItemsAsync(keys)
            .then(items => {
                const data: IPlainObject<T[]> = {};

                if (items && items.length) {
                    items.forEach(item => {
                        data[item.get('key')] = item.get('data');
                    });
                }

                return data;
            });
    }

    set(key: string, value: T[]): Promise<number> {
        return this._model.createAsync({ key: key, data: value }, { overwrite: true })
            .then(result => result.data.length);
    }

    add(key: string, items: T[]): Promise<number> {
        const params: any = { };
        params.UpdateExpression = 'ADD #data :value';
        // params.ConditionExpression = '#year = :current';
        params.ExpressionAttributeNames = {
            '#data': 'data'
        };

        params.ExpressionAttributeValues = {
            ':value': vogels.Set(items, 'S')
        };
        return this._model.updateAsync({ key: key }, params)
            .then(() => items.length);
    }

    del(key: string, values: T[]): Promise<number> {
        const params: any = { overwrite: false };
        params.UpdateExpression = 'DELETE #data :value';
        // params.ConditionExpression = '#year = :current';
        params.ExpressionAttributeNames = {
            '#data': 'data'
        };

        params.ExpressionAttributeValues = {
            ':value': vogels.Set(values, 'S')
        };
        return this._model.updateAsync({ key: key }, params)
            .then(() => values.length);
    }

    remove(key: string): Promise<number> {
        return this._model.destroyAsync(key)
            .then(() => 1);
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
            data: vogels.types.stringSet().required()
        }
    });
}
