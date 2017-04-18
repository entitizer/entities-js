
const debug = require('debug')('entity-extractor');
import { _, Promise } from '../utils';
import { Entity, PlainObject } from 'entitizer.models';
import { NameKeyring } from '../keyring/NameKeyring';
import { EntityStorage, ENTITY_FIELDS, EntityNamesStorage, ENTITY_NAMES_FIELDS, Config } from '../storage';
import { Context, parse as parseConcepts } from 'concepts-parser';
import { Concept } from './Concept';
import { Results } from './Results';

export type EntityExtractOptions = {
    info?: 'base' | ''
}

const ENTITY_INFO_MAP = {
    base: ['id', 'name', 'wikiId', 'wikiTitle', 'wikiImage', 'data', 'type', 'types', 'cc2', 'rank']
}

export class EntityExtractor {
    private nameKeyring: NameKeyring;
    private entityStorage: EntityStorage;

    constructor(nameKeyring: NameKeyring, entityStorage: EntityStorage) {
        this.nameKeyring = nameKeyring;
        this.entityStorage = entityStorage;
    }

    extract(context: Context, options?: EntityExtractOptions) {
        const results = new Results(context);
        debug('#extract', Date.now());

        const concepts = parseConcepts(context) || [];
        if (concepts.length === 0) {
            debug('no concepts parsed');
            return Promise.resolve(results.getResults());
        }
        debug('got concepts', Date.now());

        concepts.forEach(item => {
            const concept = new Concept(item.toJSON());
            concept.key = NameKeyring.formatKey(item.value, context.lang);

            results.addConcept(concept);

            if (concept.countWords > 1) {
                const childs = concept.split(context.lang);
                childs.forEach(item => {
                    const c = new Concept(item.toJSON());
                    c.key = NameKeyring.formatKey(item.value, context.lang);
                    results.addConcept(c, concept);
                });
            }
        });

        const conceptsKeys = results.getConceptsKeys();
        if (conceptsKeys.length === 0) {
            debug('no conceptsKeys');
            return Promise.resolve(results.getResults());
        }

        debug('getting keys', Date.now());

        return this.nameKeyring.getManyIds(conceptsKeys).then(keyIds => {
            // all entity id
            debug('got keys', Date.now());

            const keys = Object.keys(keyIds);
            if (keys.length === 0) {
                debug('no keyids', conceptsKeys);
                return results.getResults();
            }

            results.setKeyIds(keyIds);

            let allEntityIds = [];
            keys.forEach(key => {
                allEntityIds = allEntityIds.concat(keyIds[key]);
            });
            allEntityIds = _.uniq(allEntityIds);

            if (allEntityIds.length === 0) {
                debug('no allEntityIds');
                return results.getResults();
            }

            const AttributesToGet = options && options.info && ENTITY_INFO_MAP[options.info] || ENTITY_INFO_MAP.base;

            debug('getting entities', Date.now());

            return this.entityStorage.getItems(allEntityIds, { AttributesToGet })
                .then(entities => {
                    if (entities.length === 0) {
                        debug('no entities');
                        return results.getResults();
                    }
                    debug('got entities', Date.now());
                    results.setEntities(entities);

                    return results.createResults();
                });
        });
    }
}
