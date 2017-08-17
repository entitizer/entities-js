
import { EntityUniqueNameHelper, Entity, EntityCreate, EntityDelete, DataValidationError } from '../src';
import { MemoryEntityRepository } from './utils/EntityRepository';
import * as assert from 'assert';
import { describe, it } from 'mocha';
import { expect } from 'chai';

describe('Entity UseCases', function () {
    describe('EntityCreate', function () {
        const createEntity = new EntityCreate(new MemoryEntityRepository());
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
                    name: 'Greece'
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
});
