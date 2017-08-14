
import { PlainObject, Observable } from './utils';
import { OneEntityType, Entity, EntityNames } from './entities';

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

export interface RootRepository {
    delete(id: string): Observable<boolean>
    // exists(id: string): Bluebird<boolean>
    // count(data?: RepGetData): Observable<number>
}

export interface Repository<T extends OneEntityType> extends RootRepository {
    create(data: T, options?: RepAccessOptions): Observable<T>
    update(data: RepUpdateData<T>, options?: RepUpdateOptions): Observable<T>
    getById(id: string, options?: RepAccessOptions): Observable<T>
}

export interface EntityRepository extends Repository<Entity> {
}

export interface EntityNamesRepository extends Repository<EntityNames> {
}
