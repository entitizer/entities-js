
import { Observable } from '../../utils';
import { BaseUseCase } from '../usecase';
import { Validator, EntityUniqueName } from '../../entities';
import { EntityUniqueNameRepository } from '../../repository';

export class EntityUniqueNameDeleteEntity extends BaseUseCase<EntityUniqueName, string> {
    constructor(protected repository: EntityUniqueNameRepository) {
        super('EntityUniqueNameDeleteEntity');
    }

    protected innerExecute(entityId: string): Observable<EntityUniqueName> {
        return this.repository.getItemsByEntityId(entityId)
            .mergeMap(un => this.repository.delete({ entityId: un.entityId, key: un.key }));
    }
}
