
import { DataValidationError, CodeError } from '../../errors';
import { ValidationOptions } from 'joi';
import { UniqueName, UniqueNameID } from '../entities';
import { RepUpdateData } from '../../repository';
import { createUniqueName, updateUniqueName } from './validation-schemas';
import { UniqueNameHelper } from '../helpers';
import { BaseValidator } from './validator';
const standardText = require('standard-text');

export class UniqueNameValidator extends BaseValidator<UniqueName, UniqueNameID> {
    constructor() {
        super(createUniqueName, updateUniqueName);
    }

    private static _instance: UniqueNameValidator;

    static get instance() {
        if (!UniqueNameValidator._instance) {
            UniqueNameValidator._instance = new UniqueNameValidator();
        }

        return UniqueNameValidator._instance;
    }

    create(data: UniqueName, options?: ValidationOptions): UniqueName {
        if (data && data.entityId && data.lang !== data.entityId.substr(0, 2).toLowerCase()) {
            throw new DataValidationError({ message: `lang or entityId are invalid!` });
        }
        this.validateLanguage(data.lang);

        data.name = standardText(data.name, data.lang);
        data.uniqueName = UniqueNameHelper.formatUniqueName(data.name, data.lang);

        if (!UniqueNameHelper.isValidUniqueName(data.uniqueName)) {
            throw new DataValidationError({ message: 'Invalid unique name:' + data.uniqueName });
        }

        data.key = UniqueNameHelper.formatKey({ uniqueName: data.uniqueName, lang: data.lang });

        return super.create(data, options);
    }

    update(data: RepUpdateData<UniqueName, UniqueNameID>, options?: ValidationOptions): RepUpdateData<UniqueName, UniqueNameID> {
        throw new CodeError({ message: 'UniqueName cannot be updated' });
    }
}
