
import { Observable, Observer } from '../../utils';
import { BaseUseCase } from '../usecase';
import { EntityUniqueNameDeleteEntity } from '../entity-uniquename/delete-entity';
import { Validator, Entity } from '../../entities';
import { EntityRepository } from '../../repository';

export class EntityDelete extends BaseUseCase<Entity, string> {
    constructor(protected repository: EntityRepository, private entityUniqueNameDeleteEntity: EntityUniqueNameDeleteEntity) {
        super('EntityDelete');
    }

    protected innerExecute(id: string): Observable<Entity> {
        return this.entityUniqueNameDeleteEntity.execute(id)
            .reduce((acc, value) => {
                acc.push(value);
                return acc;
            }, [])
            .mergeMap(result => this.repository.delete(id));
    }
}
