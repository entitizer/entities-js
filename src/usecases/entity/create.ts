
import { CreateUseCase } from '../create-usecase';
import { Entity, EntityValidator, EntityHelper } from '../../entities';
import { EntityRepository } from '../../repository';
import { Observable } from '../../utils';

export class EntityCreate extends CreateUseCase<Entity, string> {
    constructor(repository: EntityRepository) {
        super('EntityCreate', EntityValidator.instance, repository);
    }

    protected onExecuting(data: Entity): Entity {
        const id = EntityHelper.createId({ lang: data.lang, wikiId: data.wikiId });
        const createdAt = Math.trunc(Date.now() / 1000);
        data = Object.assign({}, data, { id, createdAt });
        return super.onExecuting(data);
    }
}
