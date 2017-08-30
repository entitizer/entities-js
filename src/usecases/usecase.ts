
import { Observable } from '../utils';

export interface UseCase<T, DATA> {
    execute(data: DATA): Observable<T>
}

export abstract class BaseUseCase<T, DATA> implements UseCase<T, DATA> {
    constructor(protected name: string) { }

    execute(data: DATA): Observable<T> {
        try {
            data = this.onExecuting(data);
            return this.innerExecute(data).mergeMap(result => this.onExecuted(result));
        } catch (e) {
            return Observable.throw(e);
        }
    }

    protected abstract innerExecute(data: DATA): Observable<T>

    protected onExecuting(data: DATA): DATA {
        return data;
    }

    protected onExecuted(result: T): Observable<T> {
        return Observable.of(result);
    }
}
