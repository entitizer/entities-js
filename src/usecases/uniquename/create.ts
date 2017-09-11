
import { CreateUseCase } from '../create-usecase';
import { UniqueName, UniqueNameID, UniqueNameValidator } from '../../entities';
import { UniqueNameRepository } from '../../repository';
import { DataValidationError } from '../../errors';

export class UniqueNameCreate extends CreateUseCase<UniqueName, UniqueNameID> {
    constructor(repository: UniqueNameRepository) {
        super('UniqueNameCreate', UniqueNameValidator.instance, repository);
    }

    protected onExecuting(data: UniqueName): UniqueName {
        const createdAt = Math.trunc(Date.now() / 1000);

        data = Object.assign({ createdAt }, data);

        return super.onExecuting(data);
    }
}
