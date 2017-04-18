
const debug = require('debug')('entity-extractor');
import { _, Promise } from '../utils';
import { Entity, PlainObject } from 'entitizer.models';
import { NameKeyring } from '../keyring/NameKeyring';
import { EntityStorage, ENTITY_FIELDS, EntityNamesStorage, ENTITY_NAMES_FIELDS, Config } from '../storage';
import { Context, parse as parseConcepts } from 'concepts-parser';
import { Concept } from './Concept';
import { Container } from './Container';

class EntityExtractor {
    private nameKeyring: NameKeyring;
    private entityStorage: EntityStorage;
    private entityNamesStorage: EntityNamesStorage;

    constructor(nameKeyring: NameKeyring, entityStorage: EntityStorage, entityNamesStorage: EntityNamesStorage) {
        this.nameKeyring = nameKeyring;
        this.entityStorage = entityStorage;
        this.entityNamesStorage = entityNamesStorage;
    }

    extract(context: Context) {
        const container = new Container();
        const concepts = parseConcepts(context) || [];

        concepts.forEach(item => {
            const concept = new Concept(item.toJSON());
            concept.key = NameKeyring.formatKey(item.value, context.lang);

            if (concept.countWords > 1) {
                const childs = concept.split(context.lang);
                childs.forEach(item => {
                    const c = new Concept(item.toJSON());
                    c.key = NameKeyring.formatKey(item.value, context.lang);
                    container.addConcept(c, concept);
                });
            } else {
                container.addConcept(concept);
            }
        });

        const keys = container.getKeys();

        return this.nameKeyring.getManyIds(keys).then(keyIds => {
            // all entity id

        });
    }
}
