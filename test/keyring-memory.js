'use strict';

const MemoryStorage = require('../lib/keyring/MemoryStorage').MemoryStorage;
const Keyring = require('../lib/keyring/NameKeyring').NameKeyring;
const assert = require('assert');

const storage = new MemoryStorage();
const keyring = new Keyring(storage);
const lang = 'ro';

const stefan = 'Ștefan cel Mare';
const nato = 'NATO';

const stefanId = '1';
const natoId = '2';

describe('NameKeyring memory', function () {
    it('error on no storage', function () {
        assert.throws(function () {
            new Keyring();
        });
    });
    it('getIds: no ids', function () {
        return keyring.getIds(stefan, lang).then(ids => assert.equal(0, ids.length));
    });

    it('addName: diacritics', function () {
        return keyring.addName(stefanId, stefan, lang).then(ids => assert.equal(1, ids));
    });
    it('addName: atonic', function () {
        return keyring.addName(stefanId, 'Stefan cel mare', lang).then(ids => assert.equal(1, ids));
    });
    it('addName: multiple', function () {
        return keyring.addName(stefanId, 'Ștefan cel Mare și Sfânt', lang).then(ids => assert.equal(1, ids));
    });

    it('addName: abbreviasion', function () {
        return keyring.addName(natoId, nato, lang).then(ids => assert.equal(1, ids));
    });

    it('addName: C++', function () {
        return keyring.addName('cpp', 'C++', lang).then(ids => assert.equal(1, ids));
    });

    it('addName: Ministerul Culturii 1', function () {
        return keyring.addName('10', 'Ministerul Culturii', lang).then(ids => assert.equal(1, ids));
    });
    it('addName: Ministerul Culturii 2', function () {
        return keyring.addName('11', 'Ministerul Culturii', lang).then(ids => assert.equal(1, ids));
    });
});
