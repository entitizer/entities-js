
import { Observable } from '../utils';
import { BaseUseCase } from './usecase';
import { Validator, OneEntityType } from '../entities';
import { RootRepository } from '../repository';

export class CreateUseCase<T extends OneEntityType, ID> extends BaseUseCase<T, T> {
    constructor(name: string, private validator: Validator<T, ID>, protected repository: RootRepository<T>) {
        super(name);
    }

    protected onExecuting(data: T) {
        data = this.validator.create(data);
        return super.onExecuting(data);
    }

    protected innerExecute(data: T): Observable<T> {
        return this.repository.create(data);
    }
}
