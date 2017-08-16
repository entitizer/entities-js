
import { Observable } from '../../utils';
import { BaseUseCase } from '../usecase';
import { Validator, EntityUniqueName, EntityUniqueNameID } from '../../entities';
import { EntityUniqueNameRepository } from '../../repository';

export class EntityUniqueNameDelete extends BaseUseCase<EntityUniqueName, EntityUniqueNameID> {
    constructor(protected repository: EntityUniqueNameRepository) {
        super('EntityUniqueNameDelete');
    }

    protected innerExecute(id: EntityUniqueNameID): Observable<EntityUniqueName> {
        return this.repository.delete(id);
    }
}
