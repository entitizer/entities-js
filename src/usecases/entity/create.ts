
import { CreateUseCase } from '../create-usecase';
import { Entity, EntityValidator, EntityHelper } from '../../entities';
import { EntityRepository } from '../../repository';
import { Observable } from '../../utils';

export class EntityCreate extends CreateUseCase<Entity> {
    constructor(repository: EntityRepository) {
        super('EntityCreate', EntityValidator.instance, repository);
    }

    protected onExecuting(data: Entity): Entity {
        data.id = EntityHelper.createId({ lang: data.lang, wikiId: data.wikiId });
        return super.onExecuting(data);
    }
}
