
import { Observable } from '../utils';
import { BaseUseCase } from './usecase';
import { Validator, OneEntityType } from '../entities';
import { RepUpdateData, Repository } from '../repository';

export abstract class UpdateUseCase<T extends OneEntityType, ID> extends BaseUseCase<T, RepUpdateData<T, ID>> {
    constructor(name: string, private validator: Validator<T, ID>, protected repository: Repository<T, ID>) {
        super(name);
    }

    protected onExecuting(data: RepUpdateData<T, ID>) {
        data = this.validator.update(data);
        return super.onExecuting(data);
    }

    protected innerExecute(data: RepUpdateData<T, ID>) {
        return this.repository.update(data);
    }
}
