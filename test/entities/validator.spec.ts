
import { UniqueNameValidator, EntityValidator, Entity } from '../../src';
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
                noId: { lang: 'ro', name: 'name', wikiId: 'Q21', createdAt: 1213232, type: 'C' },
                noName: { lang: 'ro', id: 'ROQ21', wikiId: 'Q21', createdAt: 1213232, type: 'C' },
                noLang: { name: 'ro', id: 'ROQ21', wikiId: 'Q21', createdAt: 1213232, type: 'C' },
                invalidLangWikiId: { lang: 'ro', name: 'name', id: 'RUQ21', wikiId: 'Q21', createdAt: 1213232, type: 'C' },
                invalidIdWikiId: { lang: 'ro', name: 'name', id: 'RUQ21', wikiId: 'Q22', createdAt: 1213232, type: 'C' }
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
                ROQ21: { id: 'ROQ21', lang: 'ro', name: 'name', wikiId: 'Q21', createdAt: 1213232, type: 'C' }
            };
            Object.keys(data).forEach(name => {
                it('success create ' + name, function () {
                    const ndata = EntityValidator.instance.create(data[name]);
                    assert.equal(ndata.id, data[name].id);
                });
            });
        });
    });
    describe('#update', function () {
        describe('invalid data', function () {
            const data = {
                empty: { id: 'id', message: 'just id' },
                null: { id: 'id', set: null, message: 'null data' },
                undefined: { id: 'id', set: undefined, message: 'undefined data' },
                noUpdateAt: { id: 'ROQ21', set: { name: 'name', wikiId: 'Q21' } },
                invalidDeleteField: { id: 'id', delete: ['name'] }
            };
            Object.keys(data).forEach(name => {
                it('fail update ' + name, function () {
                    assert.throws(function () {
                        EntityValidator.instance.update({ id: data[name].id, set: data[name].set });
                    });
                });
            });
        });

        describe('valid data', function () {
            const data = {
                ROQ21: { id: 'ROQ21', set: { name: 'name', updatedAt: 1213232, type: 'C' } },
                ROQ22: { id: 'ROQ22', set: { name: 'name', updatedAt: 1213232, type: 'C' }, delete: ['abbr'] }
            };
            Object.keys(data).forEach(name => {
                it('success update ' + name, function () {
                    const ndata = EntityValidator.instance.update(data[name]);
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