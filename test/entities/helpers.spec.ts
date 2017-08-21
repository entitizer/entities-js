
import { UniqueNameHelper, EntityHelper } from '../../src';
import * as assert from 'assert';
import { describe, it } from 'mocha';

describe('UniqueNameHelper', function () {
    describe('#formatUniqueName', function () {
        describe('programming languages', function () {
            const data = {
                // `#` is not supported
                'C#': 'c',
                'Nodejs': 'nodejs',
                // `.` is not supported
                'Node.js': 'node js',
                'C++': 'c++',
                'C-': 'c-',
                'OpenCL': 'OpenCL',
                'A-0 System': 'a-0 system',
                // `/` is not supported
                'PL/I': 'PL I',
                'ASP.NET': 'ASP NET'
            };
            Object.keys(data).forEach(name => {
                it('format ' + name + '=' + data[name], function (done) {
                    const uname = UniqueNameHelper.formatUniqueName(name);
                    assert.equal(data[name], uname);
                    done();
                });
            });
        });

        describe('persons', function () {
            const data = {
                'B. Obama': 'b obama',
                'Barack Obama': 'barack obama',
                'B Obama': 'b obama'
            };
            Object.keys(data).forEach(name => {
                it('format ' + name + '=' + data[name], function (done) {
                    const uname = UniqueNameHelper.formatUniqueName(name);
                    assert.equal(data[name], uname);
                    done();
                });
            });
        });
    });

    describe('#formatKey', function () {
        it('should not pass: invalid params', function () {
            assert.throws(function () {
                UniqueNameHelper.formatKey(null);
            });
            assert.throws(function () {
                UniqueNameHelper.formatKey({ lang: undefined, uniqueName: "text" });
            });
            assert.throws(function () {
                UniqueNameHelper.formatKey({ lang: null, uniqueName: "text" });
            });
            assert.throws(function () {
                UniqueNameHelper.formatKey({ lang: null, uniqueName: null });
            });
            assert.throws(function () {
                UniqueNameHelper.formatKey({ lang: 'en', uniqueName: '1' });
            });
        });
        it('should start with language code', function () {
            const lang = 'RU';
            let key = UniqueNameHelper.formatKey({ lang: lang, uniqueName: 'some name' });
            assert.equal(lang.toLowerCase(), key.substr(0, 2));
        });
    });

    describe('#isValidUniqueName', function () {
        it('should pass: false', function () {
            assert.equal(false, UniqueNameHelper.isValidUniqueName(null));
            assert.equal(false, UniqueNameHelper.isValidUniqueName('1'));
            assert.equal(false, UniqueNameHelper.isValidUniqueName(''));
            assert.equal(false, UniqueNameHelper.isValidUniqueName(' 1 '));
            assert.equal(false, UniqueNameHelper.isValidUniqueName('One     2'));
        });
        it('should pass: true', function () {
            assert.equal(true, UniqueNameHelper.isValidUniqueName('Q1'));
            assert.equal(true, UniqueNameHelper.isValidUniqueName('Ion'));
            assert.equal(true, UniqueNameHelper.isValidUniqueName('5vft43vt235vy235 y yds hgfd h gfhd'));
        });
    });
});

describe('EntityHelper', function () {
    describe('#createId', function () {
        it('should not pass: invalid params', function () {
            assert.throws(function () {
                EntityHelper.createId(null);
            });
            assert.throws(function () {
                EntityHelper.createId({ lang: undefined, wikiId: "text" });
            });
            assert.throws(function () {
                EntityHelper.createId({ lang: null, wikiId: "text" });
            });
            assert.throws(function () {
                EntityHelper.createId({ lang: null, wikiId: null });
            });
        });
        it('should start with language code', function () {
            const lang = 'RU';
            let id = EntityHelper.createId({ lang: lang, wikiId: 'Q14' });
            assert.equal(lang.toUpperCase(), id.substr(0, 2));
        });
    });
});
