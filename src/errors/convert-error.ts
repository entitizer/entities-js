
const debug = require('debug')('quizar-domain');
import { DataConflictError } from './errors';

export function convertMongoError(error: any): Error {
    switch (error.code) {
        case 11000:
            debug('convert error to DataConflict Error');
            return new DataConflictError({ error: error });
        default:
            debug('not convert error');
            return error;
    }
}
