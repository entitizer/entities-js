
import { PlainObject, Observable } from './utils';
import { OneEntityType, Entity, EntityUniqueName, EntityUniqueNameID } from './entities';

export interface RepAccessOptions {
    /**
     * Fields to return separated by spaces
     */
    fields?: string[]
}

export interface RepUpdateOptions extends RepAccessOptions {

}

export interface RepUpdateData<T> {
    set: T
    delete?: (keyof T)[]
    // inc?: { [index: (keyof T)]: number }
}

export interface RootRepository<T extends OneEntityType> {
    create(data: T, options?: RepAccessOptions): Observable<T>
    update(data: RepUpdateData<T>, options?: RepUpdateOptions): Observable<T>
}

export interface Repository<T extends OneEntityType, ID> extends RootRepository<T> {
    getById(id: ID, options?: RepAccessOptions): Observable<T>
    delete(id: ID): Observable<T>
}

export interface EntityRepository extends Repository<Entity, string> {
}



export interface EntityUniqueNameRepository extends Repository<EntityUniqueName, EntityUniqueNameID> {
    getItemsByEntityId(entityId: string): Observable<EntityUniqueName[]>
}
