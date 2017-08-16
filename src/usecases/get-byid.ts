
import { Observable } from '../utils';
import { BaseUseCase } from './usecase';
import { OneEntityType } from '../entities';
import { Repository } from '../repository';

export class GetByIdUseCase<T extends OneEntityType, ID> extends BaseUseCase<T, ID> {
    constructor(name: string, protected repository: Repository<T, ID>) {
        super(name);
    }

    protected innerExecute(id: ID): Observable<T> {
        return this.repository.getById(id);
    }
}
