'use strict';

require('dotenv').config();

const EntityManager = require('../lib/EntityManager').EntityManager;
const keyring = require('../lib/keyring');
const DynamoStorage = keyring.DynamoStorage;
const NameKeyring = keyring.NameKeyring;
const storage = require('../lib/storage');
const EntityStorage = storage.EntityStorage;
const EntityNamesStorage = storage.EntityNamesStorage;
const assert = require('assert');
// const Entity = require('entitizer.models').Entity;
const Promise = require('../lib/utils').Promise;

describe('EntityManager', function () {
    const dynamoStorage = new DynamoStorage('test_Entitizer_v1_NamesKeyring');
    const namekeyring = new NameKeyring(dynamoStorage);
    const entityService = new EntityStorage();
    const entityNamesStorage = new EntityNamesStorage();
    const manager = new EntityManager(namekeyring, entityService, entityNamesStorage);

    before(function () {
        this.timeout(30 * 1000);
        return Promise.props({
            t1: storage.createTables().catch(() => null),
            t2: dynamoStorage.createTable().catch(() => null)
        }).delay(2 * 1000);
    });

    after(function () {
        this.timeout(30 * 1000);
        return Promise.props({
            t1: storage.deleteTables('iam-sure').catch(() => null),
            t2: dynamoStorage.deleteTable()
        }).delay(5 * 1000);
    });

    it('should throws error on creating invalid entity', function () {
        return manager.createEntity({ id: 'ROQ100', name: 'name' })
            .then(() => assert.ok(null))
            .catch(e => assert.ok(e));
    });

    // it('should throws error on updating un unexisting entity', function () {
    //     return manager.addEntityAliase('ROQ1', 'name', 'RO')
    //         .then(() => assert.ok(null))
    //         .catch(e => assert.ok(e));
    // });

    it('should create an entity', function () {
        return manager.createEntity({ id: 'ROQ100', name: 'name', wikiId: 'Q100', lang: 'ro', rank: 1 }).delay(1000 * 3);
    });

    it('should get entity ids by name', function () {
        return manager.getEntityIdsByName('name', 'ro')
            .then(ids => assert.equal(1, ids.length));
    });

    it('should get entity names', function () {
        return manager.getEntityNames('ROQ100').then(names => assert.equal(1, names.length));
    });

    it('should delete entity', function () {
        return manager.deleteEntity('ROQ100').then(result => console.log(result));
    });

    // it('should not add an existing entity alias', function () {
    //     return manager.addEntityAliase('ROQ100', 'name', 'RO')
    //         .then(r => assert.equal(r, false));
    // });

    // it('should add en entity alias', function () {
    //     return manager.addEntityAliase('ROQ100', 'name2', 'RO')
    //         .then(r => assert.equal(r, true));
    // });
});
