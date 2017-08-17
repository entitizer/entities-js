
import { Observable } from '@reactivex/rxjs';
import { EntityUniqueName, DataConflictError, DataNotFoundError } from '../../src';

export class EntityUniqueNameRepository {
    private STORE = {};

    create(data: EntityUniqueName): Observable<EntityUniqueName> {
        const id = formatId(data.entityId, data.key);
        if (this.STORE[id]) {
            return Observable.throw(new DataConflictError({ message: `EntityUniqueName id=${id} already exists!` }));
        }
        this.STORE[id] = data;

        return Observable.of(data);
    }

    getById(data: { entityId: string, key: string }): Observable<EntityUniqueName> {
        const id = formatId(data.entityId, data.key);
        return Observable.of(this.STORE[id]);
    }
}

function formatId(entityId: string, key: string) {
    return [entityId, key].join('-');
}
