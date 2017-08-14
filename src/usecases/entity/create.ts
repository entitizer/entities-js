
import { CreateUseCase } from '../create-usecase';
import { Entity, EntityValidator, EntityHelper, EntityNamesHelper } from '../../entities';
import { EntityRepository } from '../../repository';
import { Observable } from '../../utils';
import { EntityNamesPut } from '../entity-names/put';

export class EntityCreate extends CreateUseCase<Entity> {
    constructor(repository: EntityRepository, private entityNamesPut: EntityNamesPut) {
        super('EntityCreate', EntityValidator.instance, repository);
    }

    protected onExecuting(data: Entity): Entity {
        data.id = EntityHelper.createId({ lang: data.lang, wikiId: data.wikiId });
        return super.onExecuting(data);
    }
    protected onExecuted(entity: Entity): Observable<Entity> {
        const data = { entityId: entity.id, names: EntityNamesHelper.formatNames(entity) };
        return this.entityNamesPut.execute(data).mergeMap(names => super.onExecuted(entity));
    }
}
