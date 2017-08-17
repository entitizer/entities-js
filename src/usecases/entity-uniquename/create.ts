
import { CreateUseCase } from '../create-usecase';
import { EntityUniqueName, EntityUniqueNameID, EntityUniqueNameValidator, EntityUniqueNameHelper } from '../../entities';
import { EntityUniqueNameRepository } from '../../repository';
import { Observable } from '../../utils';
import { DataValidationError } from '../../errors';

export class EntityUniqueNameCreate extends CreateUseCase<EntityUniqueName, EntityUniqueNameID> {
    constructor(repository: EntityUniqueNameRepository) {
        super('EntityUniqueNameCreate', EntityUniqueNameValidator.instance, repository);
    }

    protected onExecuting(data: EntityUniqueName): EntityUniqueName {
        const createdAt = Math.trunc(Date.now() / 1000);

        data = Object.assign({ createdAt }, data);

        data.uniqueName = EntityUniqueNameHelper.formatUniqueName(data.name);

        if (!EntityUniqueNameHelper.isValidUniqueName(data.uniqueName)) {
            throw new DataValidationError({ message: 'Invalid unique name:' + data.uniqueName });
        }

        data.key = EntityUniqueNameHelper.formatKey({ uniqueName: data.uniqueName, lang: data.lang });

        return super.onExecuting(data);
    }
}
