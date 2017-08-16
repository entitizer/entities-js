
const { EntityUniqueNameHelper } = require('../lib/entities');
const assert = require('assert');

describe('format entity unique name', function () {
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
                const uname = EntityUniqueNameHelper.formatUniqueName(name);
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
                const uname = EntityUniqueNameHelper.formatUniqueName(name);
                assert.equal(data[name], uname);
                done();
            });
        });
    });
});
