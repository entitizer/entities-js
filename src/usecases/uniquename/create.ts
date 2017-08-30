
import { CreateUseCase } from '../create-usecase';
import { UniqueName, UniqueNameID, UniqueNameValidator, UniqueNameHelper } from '../../entities';
import { UniqueNameRepository } from '../../repository';
import { DataValidationError } from '../../errors';

export class UniqueNameCreate extends CreateUseCase<UniqueName, UniqueNameID> {
    constructor(repository: UniqueNameRepository) {
        super('UniqueNameCreate', UniqueNameValidator.instance, repository);
    }

    protected onExecuting(data: UniqueName): UniqueName {
        const createdAt = Math.trunc(Date.now() / 1000);

        data = Object.assign({ createdAt }, data);

        data.uniqueName = UniqueNameHelper.formatUniqueName(data.name);

        if (!UniqueNameHelper.isValidUniqueName(data.uniqueName)) {
            throw new DataValidationError({ message: 'Invalid unique name:' + data.uniqueName });
        }

        data.key = UniqueNameHelper.formatKey({ uniqueName: data.uniqueName, lang: data.lang });

        return super.onExecuting(data);
    }
}
