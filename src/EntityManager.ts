
const debug = require('debug')('entity-manager');
import { _, Promise } from './utils';
import { Entity, PlainObject } from 'entitizer.models';
import { NameKeyring } from './keyring/NameKeyring';
import { RedisStorage } from './keyring/RedisStorage';
import { EntityService, ENTITY_FIELDS, EntityNamesService, ENTITY_NAMES_FIELDS, Config } from './storage';
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
    private entityService: EntityService;
    private entityNamesService: EntityNamesService;

    constructor(nameKeyring: NameKeyring, entityService: EntityService, entityNamesService: EntityNamesService) {
        this.nameKeyring = nameKeyring;
        this.entityService = entityService;
        this.entityNamesService = entityNamesService;
    }

    static create(client: RedisClient, dynamoConfig?: DynamoDBConfig): EntityManager {
        if (dynamoConfig) {
            Config.config(dynamoConfig);
        }
        const name = new NameKeyring(new RedisStorage(client));
        return new EntityManager(name, new EntityService(), new EntityNamesService());
    }

    getEntity(id: string, params?: PlainObject): Promise<Entity> {
        return this.entityService.getEntityById(id, params);
    }

    getEntities(ids: string[], params?: PlainObject): Promise<Entity[]> {
        return this.entityService.getEntitiesByIds(ids, params);
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
        return this.entityNamesService.getEntityNames(entityId, params)
            .then(result => {
                if (result && result.names) {
                    return result.names.split('|');
                }

                return [];
            });
    }

    createEntity(data: Entity): Promise<Entity> {
        // const data = entity.toJSON();

        return this.entityService.createEntity(data)
            .then(newEntity => {
                const names = EntityNamesBuilder.formatNames(newEntity);

                return this.setEntityNames(newEntity.id, names).then(() => newEntity);
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

                return this.entityService.updateEntity(data).then(newEntity => {
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

                return this.entityNamesService.updateEntityNames(data)
                    .then(() => {
                        return this.nameKeyring.addName(entityId, name, lang).then(() => newNames);
                    });
            });
    }

    setEntityNames(entityId: string, names: string[]): Promise<string[]> {
        const lang = entityId.substr(0, 2);
        const data = {};
        data[ENTITY_NAMES_FIELDS.entityId] = entityId;
        data[ENTITY_NAMES_FIELDS.names] = names.join('|');
        return this.entityNamesService.putEntityNames(data)
            .then((result) => {
                return this.nameKeyring.addNames(entityId, names, lang).then(() => result.names.split('|'));
            });
    }

    deleteEntityNames(entityId: string): Promise<string[]> {
        const lang = entityId.substr(0, 2);
        return this.getEntityNames(entityId)
            .then(names => {
                return Promise.props({
                    p1: this.nameKeyring.deleteNames(entityId, names, lang),
                    p2: this.entityNamesService.deleteEntityNames(entityId)
                }).then(() => names);
            });
    }

    deleteEntity(entityId: string, params?: PlainObject): Promise<Entity> {
        return this.entityService.deleteEntity(entityId, params)
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
