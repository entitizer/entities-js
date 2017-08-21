
import { UniqueNameValidator, EntityValidator } from '../../src';
import * as assert from 'assert';
import { describe, it } from 'mocha';

describe('EntityValidator', function () {
    describe('#create', function () {
        describe('invalid data', function () {
            const data = {
                empty: {},
                null: null,
                undefined: undefined,
                noType: { id: 'ROQ21', lang: 'ro', name: 'name', wikiId: 'Q21', createdAt: 1213232 },
                noId: { lang: 'ro', name: 'name', wikiId: 'Q21', createdAt: 1213232, type: 'CONCEPT' },
                noName: { lang: 'ro', id: 'ROQ21', wikiId: 'Q21', createdAt: 1213232, type: 'CONCEPT' },
                noLang: { name: 'ro', id: 'ROQ21', wikiId: 'Q21', createdAt: 1213232, type: 'CONCEPT' },
                invalidLangWikiId: { lang: 'ro', name: 'name', id: 'RUQ21', wikiId: 'Q21', createdAt: 1213232, type: 'CONCEPT' },
                invalidIdWikiId: { lang: 'ro', name: 'name', id: 'RUQ21', wikiId: 'Q22', createdAt: 1213232, type: 'CONCEPT' }
            };
            Object.keys(data).forEach(name => {
                it('fail create ' + name, function () {
                    assert.throws(function () {
                        EntityValidator.instance.create(data[name]);
                    });
                });
            });
        });

        describe('valid data', function () {
            const data = {
                ROQ21: { id: 'ROQ21', lang: 'ro', name: 'name', wikiId: 'Q21', createdAt: 1213232, type: 'CONCEPT' }
            };
            Object.keys(data).forEach(name => {
                it('success create ' + name, function () {
                    const ndata = EntityValidator.instance.create(data[name]);
                    assert.equal(ndata.id, data[name].id);
                });
            });
        });
    });
});

describe('UniqueNameValidator', function () {
    describe('#create', function () {
        describe('invalid data', function () {
            const data = {
                empty: {},
                null: null,
                undefined: undefined,
                noEntityId: { lang: 'ro', name: 'name', uniqueName: 'name', key: 'namehgdsfjhdsgbcfers7f', createdAt: 1213232 },
                noLang: { entityId: 'ROQ21', name: 'name', uniqueName: 'name', key: 'namehgdsfjhdsgbcfers7f', createdAt: 1213232 },
                invalidLangEntityId: { entityId: 'ROQ21', lang: 'en', name: 'name', uniqueName: 'name', key: 'namehgdsfjhdsgbcfers7f', createdAt: 1213232 },
                noCreatedAt: { entityId: 'ROQ21', lang: 'ro', name: 'name', uniqueName: 'name', key: 'namehgdsfjhdsgbcfers7f' },
                noKey: { entityId: 'ROQ21', lang: 'en', name: 'name', uniqueName: 'name', createdAt: 1213232 },
                invalidKey: { entityId: 'ROQ21', lang: 'en', name: 'name', uniqueName: 'name', key: 'name', createdAt: 1213232 }
            };
            Object.keys(data).forEach(name => {
                it('fail create ' + name, function () {
                    assert.throws(function () {
                        UniqueNameValidator.instance.create(data[name]);
                    });
                });
            });
        });

        describe('valid data', function () {
            const data = {
                ROQ21: { entityId: 'ROQ21', lang: 'ro', name: 'name', uniqueName: 'name', key: 'namehgdsfjhdsgbcfers7f', createdAt: 1213232 },
            };
            Object.keys(data).forEach(name => {
                it('success create ' + name, function () {
                    const ndata = UniqueNameValidator.instance.create(data[name]);
                    assert.equal(ndata.entityId, data[name].entityId);
                });
            });
        });
    });
});