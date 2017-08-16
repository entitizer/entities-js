
import { DataValidationError } from '../errors';
import { ValidationOptions, ObjectSchema } from 'joi';
import { Entity, EntityUniqueName } from './entities';
import { RepUpdateData } from '../repository';
import { createEntity, createEntityUniqueName, updateEntity, updateEntityUniqueName } from './validation-schemas';

export interface Validator<T> {
    create(data: T, options?: ValidationOptions): T
    update(data: RepUpdateData<T>, options?: ValidationOptions): RepUpdateData<T>
}

export class BaseValidator<T> implements Validator<T> {

    constructor(private name: string, private createSchema: ObjectSchema, private updateSchema?: ObjectSchema) { }

    create(data: T, options?: ValidationOptions): T {
        return validateSchema(this.createSchema, data, options);
    }

    update(data: RepUpdateData<T>, options?: ValidationOptions): RepUpdateData<T> {
        if (this.updateSchema) {
            return validateSchema(this.updateSchema, data, options);
        }
        return data;
    }
}

export function validateSchema<T>(schema: ObjectSchema, data: T, options?: ValidationOptions): T {
    options = Object.assign({ abortEarly: true, convert: true, allowUnknown: false, stripUnknown: false }, options || {});

    const result = schema.validate(data, options);
    if (result.error) {
        throw new DataValidationError({ error: result.error });
    }

    return result.value;
}

export class EntityValidator extends BaseValidator<Entity> {
    constructor() {
        super('Entity', createEntity, updateEntity);
    }

    private static _instance: EntityValidator;

    static get instance() {
        if (!EntityValidator._instance) {
            EntityValidator._instance = new EntityValidator();
        }

        return EntityValidator._instance;
    }
}

export class EntityUniqueNameValidator extends BaseValidator<EntityUniqueName> {
    constructor() {
        super('EntityUniqueName', createEntityUniqueName, updateEntityUniqueName);
    }

    private static _instance: EntityUniqueNameValidator;

    static get instance() {
        if (!EntityUniqueNameValidator._instance) {
            EntityUniqueNameValidator._instance = new EntityUniqueNameValidator();
        }

        return EntityUniqueNameValidator._instance;
    }
}
