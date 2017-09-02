
import { PlainObject, AnyPlainObject, Observable } from './utils';
import { OneEntityType, Entity, UniqueName, UniqueNameID, OneEntityName } from './entities';
import { DataValidationError } from './errors';

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

export interface ReadRepository<T extends OneEntityType, ID> {
    getById(id: ID, options?: RepAccessOptions): Observable<T>
    getByIds(ids: ID[], options?: RepAccessOptions): Observable<T[]>
}

export interface Repository<T extends OneEntityType, ID> extends RootRepository<T>, ReadRepository<T, ID> {
    update(data: RepUpdateData<T, ID>, options?: RepUpdateOptions): Observable<T>
    delete(id: ID): Observable<T>
}

export interface ReadEntityRepository extends ReadRepository<Entity, string> {
}

export interface EntityRepository extends Repository<Entity, string>, ReadEntityRepository {
}

export interface ReadUniqueNameRepository extends ReadRepository<UniqueName, UniqueNameID> {
    getByEntityId(entityId: string): Observable<UniqueName[]>
    getEntityIdsByKeys(keys: string[]): Observable<PlainObject<string[]>>
}

export interface UniqueNameRepository extends Repository<UniqueName, UniqueNameID>, ReadUniqueNameRepository {
}
