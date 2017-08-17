
import { createEnum, StringPlainObject, PlainObject } from '../utils';

export const EntityType = createEnum(['EVENT', 'LOCATION', 'ORG', 'PERSON', 'PRODUCT', 'CONCEPT']);
export type EntityType = keyof typeof EntityType;

export type Entity = {
    id?: string
    lang?: string
    wikiId?: string
    name?: string
    abbr?: string
    description?: string
    wikiPageId?: number
    aliases?: string[]
    extract?: string
    wikiTitle?: string
    type?: EntityType
    types?: string[]
    cc2?: string
    rank?: number
    data?: StringPlainObject
    /**
     * created at timestamp
     */
    createdAt?: number
    /**
     * updated at timestamp
     */
    updatedAt?: number

    /**
     * Permanent redirect to entity id
     */
    redirectId?: string
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
    'updatedAt',
    'redirectId'
]);

export type EntityFields = keyof typeof EntityFields;

export type EntityUniqueNameID = {
    entityId: string
    key: string
}

export type EntityUniqueName = {
    entityId: string
    lang: string
    name: string
    uniqueName?: string
    /**
     * Lang & Unique name hash
     */
    key?: string
    /**
     * created at timestamp
     */
    createdAt?: number
}

export const EntityUniqueNameFields = createEnum(['entityId', 'lang', 'name', 'uniqueName', 'key', 'createdAt']);
export type EntityUniqueNameFields = keyof typeof EntityUniqueNameFields;
export type OneEntityType = Entity | EntityUniqueName;
