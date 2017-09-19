
import { Observable } from '../../utils';
import { BaseUseCase } from '../usecase';
import { UniqueNameDeleteEntity } from '../uniquename/delete-entity';
import { Entity } from '../../entities';
import { EntityRepository } from '../../repository';

export class EntityDelete extends BaseUseCase<Entity, string> {
    constructor(protected repository: EntityRepository, private entityUniqueNameDeleteEntity: UniqueNameDeleteEntity) {
        super('EntityDelete');
    }

    protected innerExecute(id: string): Observable<Entity> {
        return this.entityUniqueNameDeleteEntity.execute(id)
            .mergeMap(result => this.repository.delete(id));
    }
}
