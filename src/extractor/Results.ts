
const debug = require('debug')('entity-extractor:results');

import { _ } from '../utils';
import { Concept } from './Concept';
import { Entity, IPlainObject, EntityTypeValue } from 'entitizer.models';
import { Context } from 'concepts-parser';

export type ConceptKey = {
    concepts: Concept[]
}

export class Results {
    private conceptsKeys: IPlainObject<ConceptKey> = {};
    private rootConceptsKeys: string[] = [];
    private keyIds: IPlainObject<string[]> = {};
    private uniqueKeyIds: IPlainObject<string> = {};
    private multipleKeyIds: IPlainObject<string[]> = {};
    private entities: IPlainObject<Entity> = {};
    private entitiesByWikiId: IPlainObject<Entity> = {};
    private results: ResultsType;
    private createdResults = false;
    private countryCode: string;
    private foundKeys: IPlainObject<boolean> = {};

    constructor(context: Context) {
        this.results = { entities: {}, context: context };
    }

    getResults(): ResultsType {
        return this.results;
    }

    getConceptsKeys(): string[] {
        return Object.keys(this.conceptsKeys);
    }

    addConcept(concept: Concept, parent?: Concept) {
        const key = concept.key;

        if (!this.conceptsKeys[key]) {
            this.conceptsKeys[key] = { concepts: [] };
        }
        this.conceptsKeys[key].concepts.push(concept);
        if (parent) {
            concept.parent = parent;
            parent.childs = parent.childs || [];
            parent.childs.push(concept);
        } else {
            this.rootConceptsKeys.push(key);
        }
    }

    setKeyIds(keyIds: IPlainObject<string[]>) {
        this.keyIds = keyIds;
        Object.keys(keyIds).forEach(key => {
            const ids = keyIds[key];
            if (ids.length === 1) {
                this.uniqueKeyIds[key] = ids[0];
            } else if (ids.length > 1) {
                this.multipleKeyIds[key] = ids;
            } else {
                debug('keyIds ids.length===0');
            }
        });
    }

    setEntities(entities: Entity[]) {
        entities.forEach(item => {
            this.entities[item.id] = item;
            this.entitiesByWikiId[item.wikiId] = item;
        });
    }

    createResults(): ResultsType {
        if (this.createdResults) {
            throw new Error('Results already created');
        }

        this.exploreRootConcepts();
        this.exploreUniqueEntities();
        this.exploreCountryCode();
        this.exploreMultipleEntities();
        this.formatResults();

        return this.getResults();
    }

    private deleteKey(key: string) {
        debug('deleteKey', key);
        this.conceptsKeys[key].concepts.forEach(concept => {
            if (concept.childs && concept.childs.length) {
                concept.childs.forEach(item => {
                    if (this.conceptsKeys[item.key]) {
                        this.conceptsKeys[item.key].concepts.forEach((c, index) => {
                            if (c.entityId || (c.parent && c.parent.entityId)) {
                                this.conceptsKeys[item.key].concepts.splice(index, 1);
                            }
                        });
                        if (this.conceptsKeys[item.key].concepts.length === 0) {
                            debug('recursive delete key', item.key, item.value, item.parent && item.parent.value);
                            delete this.conceptsKeys[item.key];
                            delete this.uniqueKeyIds[item.key];
                            delete this.multipleKeyIds[item.key];
                            delete this.keyIds[item.key];
                        }
                    }
                });
            }
        });
        delete this.conceptsKeys[key];
        delete this.uniqueKeyIds[key];
        delete this.multipleKeyIds[key];
        delete this.keyIds[key];
    }

    private addResultEntity(entity: Entity, key: string) {
        debug('addResultEntity', key, entity.id);
        if (this.foundKeys[key]) {
            throw new Error('key has been explored: ' + key);
        }

        if (!entity) {
            return;
        }

        this.foundKeys[key] = true;
        if (!this.results.entities[entity.id]) {
            this.results.entities[entity.id] = { info: this.formatEntityInfo(entity), texts: [] };
        }
        this.conceptsKeys[key].concepts.forEach(concept => {
            if (!(concept.entityId || (concept.parent && concept.parent.entityId))) {
                concept.entityId = entity.id;
                this.results.entities[entity.id].texts.push({
                    index: concept.index,
                    text: concept.value
                });
            }
        });
        if (!this.results.entities[entity.id].texts.length) {
            debug('delete entity without texts');
            delete this.results.entities[entity.id];
        }

        this.deleteKey(key);
    }

    private exploreUniqueEntities() {
        const keys = Object.keys(this.uniqueKeyIds);
        debug('exploreUniqueEntities', keys);
        if (!keys.length) {
            return;
        }
        keys.forEach(key => {
            if (!this.foundKeys[key]) {
                const id = this.uniqueKeyIds[key];
                const entity = this.entities[id];
                this.addResultEntity(entity, key);
            }
        });
    }

    private exploreMultipleEntities(keys?: string[]) {
        keys = keys || Object.keys(this.multipleKeyIds);
        debug('exploreMultipleEntities', keys);
        if (!keys.length) {
            return;
        }
        keys.forEach(key => {
            if (!this.foundKeys[key]) {
                const ids = this.multipleKeyIds[key];
                const entities = ids.map(id => this.entities[id]);
                let entity = null;
                if (this.countryCode) {
                    entity = _.find(entities, { cc2: this.countryCode.toUpperCase() });
                }
                if (!entity) {
                    entity = _.orderBy(entities, 'rank')[entities.length - 1];
                }

                this.addResultEntity(entity, key);
            }
        });
    }

    private exploreRootConcepts() {
        debug('exploreRootConcepts', this.rootConceptsKeys);
        if (!this.rootConceptsKeys.length) {
            return;
        }
        const multipleKeys = [];
        this.rootConceptsKeys.forEach(key => {
            if (this.multipleKeyIds[key]) {
                multipleKeys.push(key);
            } else {
                const id = this.uniqueKeyIds[key];
                const entity = this.entities[id];
                this.addResultEntity(entity, key);
            }
        });

        if (multipleKeys.length) {
            this.exploreCountryCode();
            this.exploreMultipleEntities(multipleKeys);
        }
    }

    private exploreCountryCode() {
        const countriesPopularity: IPlainObject<number> = {};
        let countryCode;
        let maxCountryCode = 0;
        Object.keys(this.results.entities).forEach(id => {
            const entity = this.entities[id];
            if (entity.cc2) {
                const cc2 = entity.cc2.toLowerCase();
                countriesPopularity[cc2] = countriesPopularity[cc2] || 0;
                countriesPopularity[cc2]++;
                if (countriesPopularity[cc2] > maxCountryCode) {
                    maxCountryCode = countriesPopularity[cc2];
                    countryCode = cc2;
                }
            }
        });

        this.countryCode = countryCode || this.results.context.country;
    }

    private formatResults() {

    }

    private formatEntityInfo(entity: Entity) {
        return _.pick(entity, ['id', 'name', 'wikiId', 'type', 'cc2']);
    }
}

export type ResultsType = {
    entities: IPlainObject<EntityResult>
    context?: Context
}

export type EntityResult = {
    info: EntityResultInfo
    texts: EntityText[]
}

export type EntityResultInfo = {
    id: string
    name: string
    wikiId: string
    type: EntityTypeValue
    types?: string[]
    wikiTitle?: string
    description?: string
    extract?: string
}

export type EntityText = {
    index: number
    text: string
}
