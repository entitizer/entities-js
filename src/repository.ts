
import { PlainObject, Observable } from './utils';
import { OneEntityType, Entity, UniqueName, UniqueNameID } from './entities';

export interface RepAccessOptions {
    /**
     * Fields to return separated by spaces
     */
    fields?: string[]
}

export interface RepUpdateOptions extends RepAccessOptions {

}

export interface RepUpdateData<T, ID> {
    id: ID
    set?: T
    delete?: (keyof T)[]
    // inc?: { [index: (keyof T)]: number }
}

export interface RootRepository<T extends OneEntityType> {
    create(data: T, options?: RepAccessOptions): Observable<T>
}

export interface Repository<T extends OneEntityType, ID> extends RootRepository<T> {
    update(data: RepUpdateData<T, ID>, options?: RepUpdateOptions): Observable<T>
    getById(id: ID, options?: RepAccessOptions): Observable<T>
    getByIds(ids: ID[], options?: RepAccessOptions): Observable<T[]>
    delete(id: ID): Observable<T>
}

export interface EntityRepository extends Repository<Entity, string> {
}



export interface UniqueNameRepository extends Repository<UniqueName, UniqueNameID> {
    getByEntityId(entityId: string): Observable<UniqueName[]>
    getEntityIdsByKeys(keys: string[]): Observable<PlainObject<string[]>>
}
