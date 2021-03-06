
import { createEnum, PlainObject } from '../utils';

export const EntityType = createEnum(['E', 'L', 'O', 'H', 'P', 'C']);
export type EntityType = keyof typeof EntityType;
export type EntityData = PlainObject<string[]>;

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
    data?: EntityData
    categories?: string[]
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
    'categories',
    'createdAt',
    'updatedAt',
    'redirectId'
]);

export type EntityFields = keyof typeof EntityFields;

export type UniqueNameID = {
    entityId: string
    key: string
}

export type EntityID = string;

export type UniqueName = {
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

export const UniqueNameFields = createEnum(['entityId', 'lang', 'name', 'uniqueName', 'key', 'createdAt']);
export type UniqueNameFields = keyof typeof UniqueNameFields;
export type OneEntityType = Entity | UniqueName;
export type OneEntityName = 'Entity' | 'UniqueName';
