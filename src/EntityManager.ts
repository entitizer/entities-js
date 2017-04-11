
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
        return this.entityStorage.get(id, params);
    }

    getEntities(ids: string[], params?: PlainObject): Promise<Entity[]> {
        return this.entityStorage.getItems(ids, params);
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

    createEntity(data: Entity): Promise<Entity> {
        // const data = entity.toJSON();

        return this.entityStorage.create(data)
            .then(newEntity => {
                const names = EntityNamesBuilder.formatNames(newEntity);

                return this.setEntityNames(newEntity.id, names).then(() => newEntity);
            });
    }

    updateEntity(data: Entity, params?: PlainObject): Promise<Entity> {
        return this.entityStorage.update(data, params);
    }

    deleteEntity(entityId: string, params?: PlainObject): Promise<Entity> {
        return this.entityStorage.deleteEntity(entityId, params)
            .then(result => {
                return this.removeEntityNames(entityId).then(() => result);
            });
    }

    getEntityNames(entityId: string, params?: PlainObject): Promise<string[]> {
        return this.entityNamesStorage.get(entityId, params)
            .then(result => {
                if (result) {
                    return result.names || [];
                }

                return [];
            });
    }

    addEntityNames(entityId: string, names: string[]): Promise<number> {
        const lang = entityId.substr(0, 2);

        if (names && names.length) {
            return Promise.props({
                p1: this.nameKeyring.addNames(entityId, names, lang),
                p2: this.entityNamesStorage.addNames(entityId, names)
            }).then(result => result && result.p2 && result.p2.names.length || 0);
        }

        return Promise.resolve(0);
    }

    setEntityNames(entityId: string, names: string[]): Promise<number> {
        return this.removeEntityNames(entityId).then(() => {
            const lang = entityId.substr(0, 2);

            if (names && names.length) {
                return Promise.props({
                    p1: this.nameKeyring.addNames(entityId, names, lang),
                    p2: this.entityNamesStorage.put({ entityId: entityId, names: names })
                }).then(result => result && result.p2 && result.p2.names.length || 0);
            }

            return Promise.resolve(0);
        });
    }

    removeEntityNames(entityId: string): Promise<boolean> {
        const lang = entityId.substr(0, 2);

        return this.getEntityNames(entityId)
            .then(names => {
                return Promise.props({
                    p1: this.nameKeyring.deleteNames(entityId, names, lang),
                    p2: this.entityNamesStorage.deleteEntity(entityId)
                }).then(() => names.length > 0);
            });
    }

    deleteEntityNames(entityId: string, names: string[]): Promise<number> {
        const lang = entityId.substr(0, 2);

        if (names && names.length) {
            return Promise.props({
                p1: this.nameKeyring.deleteNames(entityId, names, lang),
                p2: this.entityNamesStorage.deleteNames(entityId, names)
            }).then(result => result && result.p2 && result.p2.names.length || 0);
        }

        return Promise.resolve(0);
    }
}
