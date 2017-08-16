
import { Observable } from '../utils';
import { BaseUseCase } from './usecase';
import { Validator, OneEntityType } from '../entities';
import { RepUpdateData, RootRepository } from '../repository';

export abstract class UpdateUseCase<T extends OneEntityType> extends BaseUseCase<T, RepUpdateData<T>> {
    constructor(name: string, private validator: Validator<T>, protected repository: RootRepository<T>) {
        super(name);
    }

    protected onExecuting(data: RepUpdateData<T>) {
        data = this.validator.update(data);
        return super.onExecuting(data);
    }

    protected innerExecute(data: RepUpdateData<T>) {
        return this.repository.update(data);
    }
}
