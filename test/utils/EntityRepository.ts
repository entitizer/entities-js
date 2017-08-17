
import { Observable } from '@reactivex/rxjs';
import { Entity, DataConflictError, DataNotFoundError, EntityRepository, RepUpdateData } from '../../src';

export class MemoryEntityRepository implements EntityRepository {
    private STORE = {};

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
    update(data: RepUpdateData<Entity>, options?: any): Observable<Entity> {
        throw new Error("Method not implemented.");
    }
}
