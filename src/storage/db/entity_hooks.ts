
const Joi = require('joi');
import { _, Promise } from '../../utils';
import { UpdateEntitySchema, EntitySchema } from './schemas';

function notEmptyString(entity, field) {
	if (typeof entity[field] === 'string') {
		entity[field] = entity[field].trim();
		if (entity[field].length < 1) {
			delete entity[field];
		}
	}
}

function normalizeCreate(entity) {
	entity = _.clone(entity);

	Object.keys(entity).forEach(key => {
		if (entity[key] === null || (Array.isArray(entity[key]) && entity[key].length === 0)) {
			delete entity[key];
		}
	});

	if (entity.data && Object.keys(entity.data).length === 0) {
		delete entity.data;
	}

	notEmptyString(entity, 'description');
	notEmptyString(entity, 'extract');

	if (entity.lang) {
		entity.lang = entity.lang.toUpperCase();
	}

	entity.id = formatId(entity.lang, entity.wikiId);

	if (_.isString(entity.createdAt)) {
		entity.createdAt = new Date(entity.createdAt);
	}
	if (_.isDate(entity.createdAt)) {
		entity.createdAt = entity.createdAt.getTime() / 1000;
	}

	entity.createdAt = entity.createdAt || Date.now() / 1000;

	entity.createdAt = parseInt(entity.createdAt);

	return entity;
}

function normalizeUpdate(entity) {

	notEmptyString(entity, 'description');
	notEmptyString(entity, 'extract');

	entity.updatedAt = Date.now() / 1000;

	entity.updatedAt = parseInt(entity.updatedAt);

	return entity;
}

function validateCreate(data) {
	// if (data.englishWikiName && !data.englishWikiId || !data.englishWikiName && data.englishWikiId) {
	// 	throw new Error('An entity must have englishWikiId AND englishWikiName');
	// }
	// if (data.wikiName && !data.wikiId || !data.wikiName && data.wikiId) {
	// 	throw new Error('An entity must have wikiId AND wikiName');
	// }
	// if (data.englishWikiId && !data.wikiId) {
	// 	throw new Error('`englishWikiId` cannot be without `wikiId`');
	// }
	if (data.id !== formatId(data.lang, data.wikiId)) {
		throw new Error('invalid id or wikiId: ' + data.id);
	}
}

function validateUpdate(data) {
	if (data.lang) {
		throw new Error('lang` cannot be changed');
	}
	// if (data.englishWikiName && !data.englishWikiId) {
	// 	throw new Error('You cannot update englishWikiName without englishWikiId');
	// }
	// if (data.wikiName && !data.wikiId) {
	// 	throw new Error('You cannot update wikiName without wikiId');
	// }
}

function formatId(lang: string, wikiId: string): string {
	return lang.toUpperCase() + wikiId.toUpperCase();
}

export function beforeCreate(data, next) {
	try {
		data = normalizeCreate(data);
		validateCreate(data);
		data = _.pick(data, Object.keys(EntitySchema));
		// const result = Joi.validate(data, EntitySchema, { convert: true, allowUnknown: false, stripUnknown: true });
		// if (result.error) {
		// 	return next(result.error);
		// }
		// data = result.value;
	} catch (e) {
		return next(e);
	}
	next(null, data);
}

export function beforeUpdate(data, next) {
	try {
		data = normalizeUpdate(data);
		validateUpdate(data);
		data = _.pick(data, Object.keys(UpdateEntitySchema));
		const result = Joi.validate(data, UpdateEntitySchema, { convert: true, allowUnknown: false, stripUnknown: true });
		if (result.error) {
			return next(result.error);
		}
		data = result.value;
	} catch (e) {
		return next(e);
	}
	next(null, data);
}
