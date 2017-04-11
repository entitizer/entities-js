
import { PlainObject } from 'entitizer.models';
import { dynamoGet } from '../utils';
import { EntityNames } from './db/models';
import { ENTITY_NAMES_FIELDS } from './db/schemas';
const vogels = require('vogels');

/**
 * EntityNamesStorage class
 * @class
 */
export class EntityNamesStorage {

    get(id: string, params?: PlainObject): Promise<EntityNames> {
        return EntityNames.getAsync(id, params).then(dynamoGet);
    }

    getItems(ids: string[], params?: PlainObject): Promise<EntityNames[]> {
        return EntityNames.getItemsAsync(ids, params).then(dynamoGet);
    }

    create(data: PlainObject, params?: PlainObject): Promise<EntityNames> {
        params = params || {};
        params.overwrite = false;
        return EntityNames.createAsync(data, params).then(dynamoGet);
    }

    put(data: EntityNames, params?: PlainObject): Promise<EntityNames> {
        return EntityNames.createAsync(data, params).then(dynamoGet);
    }

    update(data: PlainObject, params?: PlainObject): Promise<EntityNames> {
        params = params || {};
        params.expected = params.expected || {};
        params.expected.entityId = data.entityId;
        return EntityNames.updateAsync(data, params).then(dynamoGet);
    }

    addNames(entityId: string, names: string[], params?: PlainObject): Promise<EntityNames> {
        params = params || {};
        params.UpdateExpression = 'ADD #names :names';
        params.ExpressionAttributeNames = {
            '#names': 'names'
        };

        params.ExpressionAttributeValues = {
            ':names': vogels.Set(names, 'S')
        };
        params.expected = params.expected || {};
        params.expected.entityId = entityId;
        return EntityNames.updateAsync({entityId: entityId}, params).then(dynamoGet);
    }

    deleteNames(entityId: string, names: string[], params?: PlainObject): Promise<EntityNames> {
        params = params || {};
        params.UpdateExpression = 'DELETE #names :names';
        params.ExpressionAttributeNames = {
            '#names': 'names'
        };

        params.ExpressionAttributeValues = {
            ':names': vogels.Set(names, 'S')
        };
        params.expected = params.expected || {};
        params.expected.entityId = entityId;
        return EntityNames.updateAsync({entityId: entityId}, params).then(dynamoGet);
    }

    deleteEntity(entityId: string, params?: PlainObject): Promise<EntityNames> {
        return EntityNames.destroyAsync(entityId, params).then(dynamoGet);
    }
}

export type EntityNames = {
    entityId: string
    names: string[]
}
