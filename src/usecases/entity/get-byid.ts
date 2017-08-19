
import { Observable } from '../../utils';
import { GetByIdUseCase } from '../get-byid-usecase';
import { EntityID, Entity } from '../../entities';
import { EntityRepository } from '../../repository';

export class EntityGetById extends GetByIdUseCase<Entity, EntityID> {
    constructor(repository: EntityRepository) {
        super('EntityGetById', repository);
    }
}
