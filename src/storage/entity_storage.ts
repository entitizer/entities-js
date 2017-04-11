
import { PlainObject, Entity } from 'entitizer.models';
import { dynamoGet } from '../utils';
import { Entity as EntityModel } from './db/models';
import { ENTITY_FIELDS } from './db/schemas';

/**
 * EntityStorage class
 * @class
 */
export class EntityStorage {

	get(id: string, params?: PlainObject): Promise<Entity> {
		return EntityModel.getAsync(id, params).then(dynamoGet);
	}

	getItems(ids: string[], params?: PlainObject): Promise<Entity[]> {
		return EntityModel.getItemsAsync(ids, params).then(dynamoGet);
	}

	create(data: Entity, params?: PlainObject): Promise<Entity> {
		params = params || {};
		params.overwrite = false;
		return EntityModel.createAsync(data, params).then(dynamoGet);
	}

	put(data: Entity, params?: PlainObject): Promise<Entity> {
		return EntityModel.createAsync(data, params).then(dynamoGet);
	}

	update(data: Entity, params?: PlainObject): Promise<Entity> {
		params = params || {};
		params.expected = params.expected || {};
		params.expected[ENTITY_FIELDS.id] = data[ENTITY_FIELDS.id];
		return EntityModel.updateAsync(data, params).then(dynamoGet);
	}

	deleteEntity(id: string, params?: PlainObject): Promise<Entity> {
		return EntityModel.destroyAsync(id, params).then(dynamoGet);
	}
}
