
import { Observable } from '@reactivex/rxjs';
import { UniqueName, DataConflictError, DataNotFoundError } from '../../src';

export class UniqueNameRepository {
    private STORE = {};

    create(data: UniqueName): Observable<UniqueName> {
        const id = formatId(data.entityId, data.key);
        if (this.STORE[id]) {
            return Observable.throw(new DataConflictError({ message: `UniqueName id=${id} already exists!` }));
        }
        this.STORE[id] = data;

        return Observable.of(data);
    }

    getById(data: { entityId: string, key: string }): Observable<UniqueName> {
        const id = formatId(data.entityId, data.key);
        return Observable.of(this.STORE[id]);
    }
}

function formatId(entityId: string, key: string) {
    return [entityId, key].join('-');
}
