
import { Entity } from '../entities';
import { uniq } from '../../utils';

export function filterEntityCategories(entity: Entity): string[] {
    if (!entity.categories || entity.categories.length === 0) {
        return entity.categories;
    }

    let categories = uniq(entity.categories.map(c => c.indexOf(':') > 0 ? c.split(/:/)[1] : c));

    return categories;
}