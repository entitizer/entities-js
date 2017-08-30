
import { Observable } from '../../utils';
import { BaseUseCase } from '../usecase';
import { UniqueName, UniqueNameID } from '../../entities';
import { UniqueNameRepository } from '../../repository';

export class UniqueNameDelete extends BaseUseCase<UniqueName, UniqueNameID> {
    constructor(protected repository: UniqueNameRepository) {
        super('UniqueNameDelete');
    }

    protected innerExecute(id: UniqueNameID): Observable<UniqueName> {
        return this.repository.delete(id);
    }
}
