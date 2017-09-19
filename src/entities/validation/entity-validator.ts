
import { DataValidationError } from '../../errors';
import { ValidationOptions } from 'joi';
import { Entity } from '../entities';
import { RepUpdateData } from '../../repository';
import { createEntity, updateEntity } from './validation-schemas';
import { EntityHelper } from '../helpers';
import { uniq } from '../../utils';
import { BaseValidator } from './validator';
import { filterEntityData } from './filter-entity-data';
import { filterEntityCategories } from './filter-entity-categories';

export class EntityValidator extends BaseValidator<Entity, string> {
    constructor() {
        super(createEntity, updateEntity);
    }

    private static _instance: EntityValidator;

    static get instance() {
        if (!EntityValidator._instance) {
            EntityValidator._instance = new EntityValidator();
        }

        return EntityValidator._instance;
    }

    create(data: Entity, options?: ValidationOptions): Entity {
        if (data && data.id !== EntityHelper.createId({ lang: data.lang, wikiId: data.wikiId })) {
            throw new DataValidationError({ message: `id is invalid!` });
        }
        this.validateLanguage(data.lang);
        filterEntityData(data);
        if (data.categories) {
            data.categories = filterEntityCategories(data);
        }

        if (data.aliases) {
            data.aliases = uniq(data.aliases);
        }

        return super.create(data, options);
    }

    update(data: RepUpdateData<Entity, string>, options?: ValidationOptions): RepUpdateData<Entity, string> {

        filterEntityData(data.set);

        if (data.set.aliases) {
            data.set.aliases = uniq(data.set.aliases);
        }

        if (data.set.categories) {
            data.set.categories = filterEntityCategories(data.set);
        }

        return super.update(data, options);
    }
}
