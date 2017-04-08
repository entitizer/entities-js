
import { PlainObject, Entity } from 'entitizer.models';
import { dynamoGet } from '../utils';
import { Entity as EntityModel } from './db/models';
import { ENTITY_FIELDS } from './db/schemas';

/**
 * EntityService class
 * @class
 */
export class EntityService {

	getEntityById(id: string, params?: PlainObject): Promise<Entity> {
		return EntityModel.getAsync(id, params).then(dynamoGet);
	}

	getEntitiesByIds(ids: string[], params?: PlainObject): Promise<Entity[]> {
		return EntityModel.getItemsAsync(ids, params).then(dynamoGet);
	}

	createEntity(data: Entity, params?: PlainObject): Promise<Entity> {
		params = params || {};
		params.overwrite = false;
		return EntityModel.createAsync(data, params).then(dynamoGet);
	}

	putEntity(data: Entity, params?: PlainObject): Promise<Entity> {
		return EntityModel.createAsync(data, params).then(dynamoGet);
	}

	updateEntity(data: Entity, params?: PlainObject): Promise<Entity> {
		params = params || {};
		params.expected = params.expected || {};
		params.expected[ENTITY_FIELDS.id] = data[ENTITY_FIELDS.id];
		return EntityModel.updateAsync(data, params).then(dynamoGet);
	}

	deleteEntity(id: string, params?: PlainObject): Promise<Entity> {
		return EntityModel.destroyAsync(id, params).then(dynamoGet);
	}
}
