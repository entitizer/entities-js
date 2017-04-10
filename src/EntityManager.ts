
const debug = require('debug')('entity-manager');
import { _, Promise } from './utils';
import { Entity, PlainObject } from 'entitizer.models';
import { NameKeyring } from './keyring/NameKeyring';
import { RedisStorage } from './keyring/RedisStorage';
import { EntityStorage, ENTITY_FIELDS, EntityNamesStorage, ENTITY_NAMES_FIELDS, Config } from './storage';
import { EntityBuilder, EntityNamesBuilder } from 'entitizer.models-builder';
import { RedisClient } from 'redis';

export type DynamoDBConfig = {
    accessKeyId?: string;
    secretAccessKey?: string;
    credentials?: string;
    region?: string;
    apiVersion?: string;
}

export class EntityManager {
    private nameKeyring: NameKeyring;
    private entityStorage: EntityStorage;
    private entityNamesStorage: EntityNamesStorage;

    constructor(nameKeyring: NameKeyring, entityStorage: EntityStorage, entityNamesStorage: EntityNamesStorage) {
        this.nameKeyring = nameKeyring;
        this.entityStorage = entityStorage;
        this.entityNamesStorage = entityNamesStorage;
    }

    static create(client: RedisClient, dynamoConfig?: DynamoDBConfig): EntityManager {
        if (dynamoConfig) {
            Config.config(dynamoConfig);
        }
        const name = new NameKeyring(new RedisStorage(client));
        return new EntityManager(name, new EntityStorage(), new EntityNamesStorage());
    }

    getEntity(id: string, params?: PlainObject): Promise<Entity> {
        return this.entityStorage.getEntityById(id, params);
    }

    getEntities(ids: string[], params?: PlainObject): Promise<Entity[]> {
        return this.entityStorage.getEntitiesByIds(ids, params);
    }

    getEntityIdsByName(name: string, lang: string): Promise<string[]> {
        return this.nameKeyring.getIds(name, lang);
    }

    getEntitiesByName(name: string, lang: string, params?: PlainObject): Promise<Entity[]> {
        return this.getEntityIdsByName(name, lang).then(ids => {
            if (ids && ids.length) {
                return this.getEntities(ids, params);
            }
            return [];
        });
    }

    getEntityNames(entityId: string, params?: PlainObject): Promise<string[]> {
        return this.entityNamesStorage.getEntityNames(entityId, params)
            .then(result => {
                if (result && result.names) {
                    return result.names.split('|');
                }

                return [];
            });
    }

    createEntity(data: Entity): Promise<Entity> {
        // const data = entity.toJSON();

        return this.entityStorage.createEntity(data)
            .then(newEntity => {
                const names = EntityNamesBuilder.formatNames(newEntity);

                return this.addEntityNames(newEntity.id, names).then(() => newEntity);
            });
    }

    updateEntity(data: Entity): Promise<Entity> {
        // const data = entity.toJSON();

        return this.getEntity(data.id, { AttributesToGet: [ENTITY_FIELDS.id, ENTITY_FIELDS.abbr, ENTITY_FIELDS.aliases, ENTITY_FIELDS.name, ENTITY_FIELDS.wikiTitle] })
            .then(dbEntity => {
                if (!dbEntity) {
                    return Promise.reject(new Error('Unexisting entity!'));
                }
                const dbNames = EntityNamesBuilder.formatNames(dbEntity);

                return this.entityStorage.updateEntity(data).then(newEntity => {
                    const newNames = EntityNamesBuilder.formatNames(newEntity);

                    const deletedNames = _.difference(dbNames, newNames);
                    const addedNames = _.difference(newNames, dbNames);

                    return Promise.each(deletedNames, dName => this.nameKeyring.deleteName(newEntity.id, dName, newEntity.lang))
                        .then(() => Promise.each(addedNames, aName => this.nameKeyring.addName(newEntity.id, aName, newEntity.lang)))
                        .then(() => newEntity);
                });
            });
    }

    addEntityName(entityId: string, name: string): Promise<string[]> {
        const lang = entityId.substr(0, 2);
        const data = {};
        data[ENTITY_NAMES_FIELDS.entityId] = entityId;

        return this.getEntityNames(entityId)
            .then(names => {
                const newNames = EntityNamesBuilder.filterNames(names.concat([name]));
                if (names.length >= newNames.length) {
                    return names;
                }
                data[ENTITY_NAMES_FIELDS.names] = newNames.join('|');

                return this.entityNamesStorage.putEntityNames(data)
                    .then(() => {
                        return this.nameKeyring.addName(entityId, name, lang).then(() => newNames);
                    });
            });
    }

    addEntityNames(entityId: string, names: string[]): Promise<string[]> {
        return Promise.each(names, name => this.addEntityName(entityId, name));
    }

    setEntityNames(entityId: string, names: string[]): Promise<string[]> {
        return this.deleteEntityNames(entityId).then(() => this.addEntityNames(entityId, names));
    }

    deleteEntityNames(entityId: string): Promise<string[]> {
        const lang = entityId.substr(0, 2);
        return this.getEntityNames(entityId)
            .then(names => {
                return Promise.props({
                    p1: this.nameKeyring.deleteNames(entityId, names, lang),
                    p2: this.entityNamesStorage.deleteEntityNames(entityId)
                }).then(() => names);
            });
    }

    deleteEntity(entityId: string, params?: PlainObject): Promise<Entity> {
        return this.entityStorage.deleteEntity(entityId, params)
            .then(result => {
                return this.deleteEntityNames(entityId).then(() => result);
            });
    }

    // addNameKey(entityId: string, name: string, lang: string): Promise<string[]> {
    //     return this.nameKeyring.addName(entityId, name, lang);
    // }

    // addEntityAlias(entityId: string, alias: string, lang: string): Promise<boolean> {
    //     return this.getEntity(entityId, { AttributesToGet: [ENTITY_FIELDS.id, ENTITY_FIELDS.abbr, ENTITY_FIELDS.aliases, ENTITY_FIELDS.name, ENTITY_FIELDS.wikiTitle] })
    //         .then(dbEntity => {
    //             if (!dbEntity) {
    //                 return Promise.reject(new Error('Unexisting entity!'));
    //             }
    //             const names = formatEntityNames(dbEntity.name, dbEntity.wikiTitle, dbEntity.abbr, dbEntity.aliases);
    //             // alias exists
    //             if (~indexOfNocase(names, alias)) {
    //                 return false;
    //             }

    //             dbEntity.aliases = dbEntity.aliases || [];
    //             dbEntity.aliases.push(alias);

    //             return this.entityService.updateEntity({ id: entityId, aliases: dbEntity.aliases })
    //                 .then(() => {
    //                     return this.nameKeyring.addName(entityId, alias, lang);
    //                 }).then(() => true);
    //         });
    // }

    // deleteNameKey(entityId: string, name: string, lang: string): Promise<string[]> {
    //     return this.nameKeyring.deleteName(entityId, name, lang);
    // }
}
