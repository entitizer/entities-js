
import { CreateUseCase } from '../create-usecase';
import { EntityUniqueName, EntityUniqueNameValidator, EntityUniqueNameHelper } from '../../entities';
import { EntityUniqueNameRepository } from '../../repository';
import { Observable } from '../../utils';
import { DataValidationError } from '../../errors';

export class EntityUniqueNameCreate extends CreateUseCase<EntityUniqueName> {
    constructor(repository: EntityUniqueNameRepository) {
        super('EntityUniqueNameCreate', EntityUniqueNameValidator.instance, repository);
    }

    protected onExecuting(data: EntityUniqueName): EntityUniqueName {
        const ndata = Object.assign({}, data);
        ndata.uniqueName = EntityUniqueNameHelper.formatUniqueName(data.name);
        if (!EntityUniqueNameHelper.isValidUniqueName(ndata.uniqueName)) {
            throw new DataValidationError({ message: 'Invalid unique name:' + ndata.uniqueName });
        }
        ndata.key = EntityUniqueNameHelper.formatKey({ uniqueName: ndata.uniqueName, lang: ndata.lang });

        return super.onExecuting(ndata);
    }
}
