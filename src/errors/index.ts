
const debug = require('debug')('entitizer-entities');

export * from './errors';
export * from './convert-error';

export function catchError(type) {
    const typename = type.name || type.constructor && type.constructor.name;
    return function (error): Bluebird<void> {
        if (error instanceof type) {
            debug('catched error of type: ' + typename);
            return Bluebird.resolve();
        } else {
            return Bluebird.reject(error);
        }
    }
}
