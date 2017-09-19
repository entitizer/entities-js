
import { DataValidationError } from '../../errors';
import { ValidationOptions, ObjectSchema } from 'joi';
import { RepUpdateData } from '../../repository';
import { Constants } from '../../constants';

export interface Validator<T, ID> {
    create(data: T, options?: ValidationOptions): T
    update(data: RepUpdateData<T, ID>, options?: ValidationOptions): RepUpdateData<T, ID>
}

export class BaseValidator<T, ID> implements Validator<T, ID> {

    constructor(private createSchema: ObjectSchema, private updateSchema?: ObjectSchema) { }

    create(data: T, options?: ValidationOptions): T {
        return validateSchema(this.createSchema, data, options);
    }

    update(data: RepUpdateData<T, ID>, options?: ValidationOptions): RepUpdateData<T, ID> {
        if (this.updateSchema) {
            return validateSchema(this.updateSchema, data, options);
        }
        return data;
    }

    validateLanguage(lang: string) {
        if (!isSupportedLanguage(lang)) {
            throw new DataValidationError({ message: `Unsupported language :'${lang}'` });
        }
    }
}

function validateSchema<T>(schema: ObjectSchema, data: T, options?: ValidationOptions): T {
    options = Object.assign({ abortEarly: true, convert: true, allowUnknown: false, stripUnknown: false }, options || {});

    const result = schema.validate(data, options);
    if (result.error) {
        throw new DataValidationError({ error: result.error });
    }

    return result.value;
}

function isSupportedLanguage(lang: string) {
    return Constants.languages.indexOf(lang) > -1;
}
