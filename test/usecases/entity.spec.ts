
import { Entity, EntityCreate, EntityDelete, DataValidationError, EntityGetById } from '../../src';
import { MemoryEntityRepository } from './EntityRepository';
import * as assert from 'assert';
import { describe, it } from 'mocha';
import { expect } from 'chai';

describe('Entity UseCases', function () {
    const entityRepository = new MemoryEntityRepository();
    describe('EntityCreate', function () {
        const createEntity = new EntityCreate(entityRepository);
        const entities = {
            noLang: {
                entity: {
                    wikiId: 'Q41',
                    name: 'Greece'
                },
                error: {
                    type: DataValidationError,
                    message: `'lang'`
                }
            },
            noWikiId: {
                entity: {
                    lang: 'en',
                    name: 'Greece'
                },
                error: {
                    type: DataValidationError,
                    message: `'wikiId'`
                }
            },
            Q41: {
                entity: {
                    wikiId: 'Q41',
                    lang: 'en',
                    name: 'Greece',
                    type: 'L'
                }
            }
        };

        Object.keys(entities).forEach(name => {
            const data = entities[name];
            it('should ' + (data.error ? 'fail' : 'success') + ' create ' + name, function (done) {
                createEntity.execute(data.entity).subscribe(
                    result => {
                        if (data.error) {
                            return done(new Error('Should not pass'));
                        }
                        done();
                    },
                    error => {
                        if (!data.error) {
                            return done(error);
                        }

                        data.error.type && assert.ok(error instanceof data.error.type);
                        assert.ok(error.message.indexOf(data.error.message) > 0, error.message);
                        done();
                    }
                );
            });
        });
    });
    describe('EntityGetById', function () {
        const getEntityById = new EntityGetById(entityRepository);
        const entities = {
            ENQ41: {
                entity: {
                    wikiId: 'Q41',
                    lang: 'en',
                    name: 'Greece'
                }
            },
            Q41: {
                entity: undefined
            }
        };

        Object.keys(entities).forEach(id => {
            const data = entities[id];
            it('should ' + (data.error ? 'fail' : 'success') + ' get entity by id == ' + id, function (done) {
                getEntityById.execute(id).subscribe(
                    entity => {
                        if (data.error) {
                            return done(new Error('Should not pass'));
                        }
                        if (data.entity === entity) {
                            return done();
                        }

                        for (let key in data.entity) {
                            assert.equal(entity[key], data.entity[key]);
                        }
                        done();
                    },
                    error => {
                        if (!data.error) {
                            return done(error);
                        }

                        data.error.type && assert.ok(error instanceof data.error.type);
                        assert.ok(error.message.indexOf(data.error.message) > 0, error.message);
                        done();
                    }
                );
            });
        });
    });
});
