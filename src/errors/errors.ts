
import { AnyPlainObject } from '../utils';

export interface ErrorDefaultData {
    statusCode?: number
    message?: string
}

export interface ErrorData extends ErrorDefaultData {
    error?: Error
    data?: AnyPlainObject
    details?: string
}

export class EntitizerError extends Error {
    constructor(data: ErrorData, defaultData?: ErrorDefaultData) {
        data.message = data.message || data.error && data.error.message || defaultData && defaultData.message;
        super(data.message);

        if (!data.statusCode && defaultData.statusCode) {
            data.statusCode = defaultData.statusCode;
        }

        // extending Error is weird and does not propagate `message`
        Object.defineProperty(this, 'message', {
            configurable: true,
            enumerable: false,
            value: data.message,
            writable: true
        });

        Object.defineProperty(this, 'name', {
            configurable: true,
            enumerable: false,
            value: this.constructor['name'],
            writable: true
        });

        Object.defineProperty(this, 'data', {
            configurable: true,
            enumerable: false,
            value: data,
            writable: true
        });

        if (Error.hasOwnProperty('captureStackTrace')) {
            Error.captureStackTrace(this, this.constructor);
            return;
        }

        Object.defineProperty(this, 'stack', {
            configurable: true,
            enumerable: false,
            value: (new Error(data.message)).stack,
            writable: true
        });
    }
}

export class CodeError extends EntitizerError {
    constructor(data: ErrorData) {
        super(data, { message: 'Code error', statusCode: 500 });
    }
}

export class DataError extends EntitizerError { }

export class DataConflictError extends DataError {
    constructor(data: ErrorData) {
        super(data, { message: 'Data conflict', statusCode: 409 });
    }
}

export class DataValidationError extends DataError {
    constructor(data: ErrorData, defaults?: ErrorDefaultData) {
        super(data, Object.assign({ message: 'Validation error', statusCode: 400 }, defaults));
    }
}

export class DataNotFoundError extends DataValidationError {
    constructor(data: ErrorData) {
        super(data, { message: 'Data not found', statusCode: 404 });
    }
}
