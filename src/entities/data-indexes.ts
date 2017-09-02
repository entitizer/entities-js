
import { createEnum, AnyPlainObject, PlainObject, StringPlainObject } from '../utils';
import { EntityFields, OneEntityName } from './entities';

export interface DataIndex<NAME extends string> {
    readonly name: NAME
    readonly key: StringPlainObject
}

export const DataSortDirection = createEnum(['ASC', 'DESC']);
export type DataSortDirection = keyof typeof DataSortDirection;

export interface DataSortIndex<NAME extends string> extends DataIndex<NAME> {
    readonly direction?: DataSortDirection
    readonly sortKey?: StringPlainObject
    readonly startKey?: StringPlainObject
}

export const EntitySortIndexes = createEnum(['redirectId', 'createdAt', 'updatedAt']);
export type EntitySortIndexes = keyof typeof EntitySortIndexes;

export interface EntityDataSortIndex extends DataSortIndex<EntitySortIndexes> { }

export function validateSortIndex(entity: OneEntityName, index: DataSortIndex<string>) {
    const indexes = SortIndexesMap[entity];
    if (!indexes) {
        throw new Error(`No sort indexes for entity '${entity}'`);
    }
    const idx = indexes[index.name];
    if (!idx) {
        throw new Error(`No sort index '${index.name}'`);
    }
    if (!index.key) {
        throw new Error(`field 'key' is required`);
    }
    validateSortIndexItem(index.name, index.key, idx.key);
    validateSortIndexItem(index.name, index.sortKey, idx.sortKey);
    validateSortIndexItem(index.name, index.startKey, idx.sortKey);
}

function validateSortIndexItem(name: string, item: AnyPlainObject, keys: string[]) {
    const itemKeys = Object.keys(item);
    if (keys.length !== itemKeys.length) {
        throw new Error(`Invalid sort index(${name}) item keys: ${itemKeys}`);
    }
    for (let i = 0; i < itemKeys.length; i++) {
        if (itemKeys.indexOf(keys[i]) < 0) {
            throw new Error(`Invalid sort index(${name}) item key: ${itemKeys[i]}`);
        }
    }
}

const SortIndexesMap: AnyPlainObject = {
    Entity: {
        redirectId: {
            key: ['lang'],
            sortKey: ['redirectId']
        },
        createdAt: {
            key: ['lang'],
            sortKey: ['createdAt']
        },
        updatedAt: {
            key: ['lang'],
            sortKey: ['updatedAt']
        }
    }
};