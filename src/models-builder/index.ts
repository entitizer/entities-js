
import { WikiEntity } from 'wiki-entity';
// import { Entity } from 'entitizer.models';
import { wikiEntityToEntity } from './wikiEntityToEntity';
// import { entityToKeyringEntity } from './entityToKeyringEntity';
import * as EntityNamesBuilder from './EntityNamesBuilder';

export * from './types';

const EntityBuilder = {
    fromWikiEntity: wikiEntityToEntity
    // toKeyringEntity: entityToKeyringEntity
}

export { EntityBuilder, EntityNamesBuilder }
