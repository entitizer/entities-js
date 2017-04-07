
const crypto = require('crypto');
const Promise = require('bluebird');
const _ = require('lodash');

export { _, Promise };

export function md5(value: string): string {
    return crypto.createHash('md5').update(value, 'utf8').digest('hex').toLowerCase();
}
