
import { createEnum, StringPlainObject, PlainObject } from '../utils';

export const EntityType = createEnum(['EVENT', 'LOCATION', 'ORG', 'PERSON', 'PRODUCT']);
export type EntityType = keyof typeof EntityType;

export type Entity = {
    id: string,
    lang?: string,
    wikiId?: string,
    name?: string,
    abbr?: string,
    description?: string,
    wikiPageId?: number,
    aliases?: string[],
    extract?: string,
    wikiTitle?: string,
    type?: EntityType,
    types?: string[],
    cc2?: string,
    rank?: number,
    data?: StringPlainObject,
    /**
     * created at timestamp
     */
    createdAt?: number,
    /**
     * updated at timestamp
     */
    updatedAt?: number
}

export const EntityFields = createEnum([
    'id',
    'lang',
    'wikiId',
    'name',
    'abbr',
    'description',
    'wikiPageId',
    'aliases',
    'extract',
    'wikiTitle',
    'type',
    'types',
    'cc2',
    'rank',
    'data',
    'createdAt',
    'updatedAt'
]);
export type EntityFields = keyof typeof EntityFields;

export type EntityNames = {
    entityId: string
    names: string[]
}

export const EntityNamesFields = createEnum(['entityId', 'names']);
export type EntityNamesFields = keyof typeof EntityNamesFields;

export type OneEntityType = Entity | EntityNames;
