
import { CreateUseCase } from '../create-usecase';
import { EntityNames, EntityNamesValidator, EntityNamesHelper } from '../../entities';
import { EntityNamesRepository } from '../../repository';
import { Observable } from '../../utils';

export class EntityNamesPut extends CreateUseCase<EntityNames> {
    constructor(repository: EntityNamesRepository) {
        super('EntityNamesPut', EntityNamesValidator.instance, repository);
    }

    protected onExecuting(data: EntityNames): EntityNames {
        const ndata = {
            entityId: data.entityId,
            names: EntityNamesHelper.filterNames(data.names)
        };
        return super.onExecuting(ndata);
    }
}
