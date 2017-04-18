'use strict';

require('dotenv').config();

const EntityExtractor = require('../lib/extractor/EntityExtractor').EntityExtractor;
const EntityManager = require('../lib/EntityManager').EntityManager;
const RedisStorage = require('../lib/keyring/RedisStorage').RedisStorage;
const Keyring = require('../lib/keyring/NameKeyring').NameKeyring;
const storage = require('../lib/storage');
const EntityStorage = storage.EntityStorage;
const EntityNamesStorage = storage.EntityNamesStorage;
const assert = require('assert');
const redis = require('redis');
const Promise = require('../lib/utils').Promise;

const client = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASS
});
const keyring = new Keyring(new RedisStorage(client));

const entityService = new EntityStorage();
const entityNamesStorage = new EntityNamesStorage();
const manager = new EntityManager(keyring, entityService, entityNamesStorage);
const extractor = new EntityExtractor(keyring, entityService);

describe('EntityExtractor', function () {

    before(function () {
        this.timeout(30 * 1000);
        return Promise.props({
            t1: storage.createTables().catch(() => null)
        }).delay(2 * 1000);
    });

    after(function (done) {
        this.timeout(30 * 1000);
        Promise.props({
            t1: storage.deleteTables('iam-sure').catch(() => null)
        }).then(() => {
            client.flushall(done);
        });
    });

    it('should create initial data', function () {
        this.timeout(30 * 1000);
        return createData();
    });

    it('should extract entities', function () {
        return extractor.extract({ lang: 'ro', text: 'ceva Name One apoi Name 2 acum Name 3' })
            .then(results => {
                console.log(JSON.stringify(results));
                assert.ok(results);
                assert.ok(results.entities);
                assert.ok(results.context);
                assert.ok(results.context.text);
                assert.equal('ro', results.context.lang);

                assert.equal('ROQ2', results.entities.ROQ2.info.id);
                assert.equal('Q2', results.entities.ROQ2.info.wikiId);
                assert.equal('Name 2', results.entities.ROQ2.info.name);

                assert.equal('ROQ3', results.entities.ROQ3.info.id);
            });
    });
});


function createData() {
    const data = [
        {
            wikiId: 'Q1',
            lang: 'ro',
            name: 'Name 1',
            aliases: ['name 1', 'name one'],
            rank: 1
        },
        {
            wikiId: 'Q2',
            lang: 'ro',
            name: 'Name 2',
            aliases: ['name 2', 'name two'],
            rank: 2
        },
        {
            wikiId: 'Q3',
            lang: 'ro',
            name: 'Name 3',
            aliases: ['name 3', 'name one', 'name three'],
            rank: 3
        },
        {
            wikiId: 'Q01',
            lang: 'ro',
            name: 'Name',
            aliases: ['name'],
            rank: 4,
            cc2: 'RO'
        }
    ];

    return Promise.each(data, item => {
        return manager.createEntity(item);
    });
}
