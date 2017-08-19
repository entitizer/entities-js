
import { Observable } from '../../utils';
import { BaseUseCase } from '../usecase';
import { Validator, UniqueName } from '../../entities';
import { UniqueNameRepository } from '../../repository';

export class UniqueNameDeleteEntity extends BaseUseCase<UniqueName[], string> {
    constructor(protected repository: UniqueNameRepository) {
        super('UniqueNameDeleteEntity');
    }

    protected innerExecute(entityId: string): Observable<UniqueName[]> {
        return this.repository.getByEntityId(entityId)
            .mergeMap(items => Observable.from(items)
                .mergeMap(item => this.repository.delete({ entityId: item.entityId, key: item.key }))
                .combineAll());
    }
}
