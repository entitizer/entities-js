
import { Observable } from '@reactivex/rxjs';
import { Entity, DataConflictError, DataNotFoundError, EntityRepository, RepUpdateData, RepAccessOptions } from '../../src';

export class MemoryEntityRepository implements EntityRepository {
    private STORE = {};

    getByIds(ids: string[], options?: RepAccessOptions): Observable<Entity[]> {
        throw new Error("Method not implemented.");
    }

    create(data: Entity): Observable<Entity> {
        if (this.STORE[data.id]) {
            return Observable.throw(new DataConflictError({ message: `Entity id=${data.id} already exists!` }));
        }
        this.STORE[data.id] = data;

        return Observable.of(data);
    }

    getById(id: string): Observable<Entity> {
        return Observable.of(this.STORE[id]);
    }

    delete(id: string): Observable<Entity> {
        const entity = this.STORE[id];

        return Observable.of(entity);
    }
    update(data: RepUpdateData<Entity, string>, options?: any): Observable<Entity> {
        throw new Error("Method not implemented.");
    }
}
