
import { DataValidationError, CodeError } from '../errors';
import { ValidationOptions, ObjectSchema } from 'joi';
import { Entity, UniqueName, UniqueNameID } from './entities';
import { RepUpdateData } from '../repository';
import { createEntity, createUniqueName, updateEntity, updateUniqueName } from './validation-schemas';
import { EntityHelper } from './helpers';
import { PlainObject, uniq } from '../utils';

export interface Validator<T, ID> {
    create(data: T, options?: ValidationOptions): T
    update(data: RepUpdateData<T, ID>, options?: ValidationOptions): RepUpdateData<T, ID>
}

export class BaseValidator<T, ID> implements Validator<T, ID> {

    constructor(private name: string, private createSchema: ObjectSchema, private updateSchema?: ObjectSchema) { }

    create(data: T, options?: ValidationOptions): T {
        return validateSchema(this.createSchema, data, options);
    }

    update(data: RepUpdateData<T, ID>, options?: ValidationOptions): RepUpdateData<T, ID> {
        if (this.updateSchema) {
            return validateSchema(this.updateSchema, data, options);
        }
        return data;
    }
}

export function validateSchema<T>(schema: ObjectSchema, data: T, options?: ValidationOptions): T {
    options = Object.assign({ abortEarly: true, convert: true, allowUnknown: false, stripUnknown: false }, options || {});

    const result = schema.validate(data, options);
    if (result.error) {
        throw new DataValidationError({ error: result.error });
    }

    return result.value;
}

export class EntityValidator extends BaseValidator<Entity, string> {
    constructor() {
        super('Entity', createEntity, updateEntity);
    }

    private static _instance: EntityValidator;

    static get instance() {
        if (!EntityValidator._instance) {
            EntityValidator._instance = new EntityValidator();
        }

        return EntityValidator._instance;
    }

    create(data: Entity, options?: ValidationOptions): Entity {
        if (data && data.id !== EntityHelper.createId({ lang: data.lang, wikiId: data.wikiId })) {
            throw new DataValidationError({ message: `id is invalid!` });
        }
        filterEntityData(data);

        return super.create(data, options);
    }

    update(data: RepUpdateData<Entity, string>, options?: ValidationOptions): RepUpdateData<Entity, string> {

        filterEntityData(data.set);

        return super.update(data, options);
    }
}

export class UniqueNameValidator extends BaseValidator<UniqueName, UniqueNameID> {
    constructor() {
        super('UniqueName', createUniqueName, updateUniqueName);
    }

    private static _instance: UniqueNameValidator;

    static get instance() {
        if (!UniqueNameValidator._instance) {
            UniqueNameValidator._instance = new UniqueNameValidator();
        }

        return UniqueNameValidator._instance;
    }

    create(data: UniqueName, options?: ValidationOptions): UniqueName {
        if (data && data.entityId && data.lang !== data.entityId.substr(0, 2).toLowerCase()) {
            throw new DataValidationError({ message: `lang or entityId are invalid!` });
        }
        return super.create(data, options);
    }

    update(data: RepUpdateData<UniqueName, UniqueNameID>, options?: ValidationOptions): RepUpdateData<UniqueName, UniqueNameID> {
        throw new CodeError({ message: 'UniqueName cannot be updated' });
    }
}

function filterEntityData(entity: Entity) {
    if (entity && entity.data) {
        const data = entity.data;
        for (let prop in data) {
            if (ENTITY_DATA_PROPS.indexOf(prop) < 0) {
                delete data[prop];
            } else {
                data[prop] = uniq(data[prop]).slice(0, 5);
            }
        }
    }
}

const ENTITY_DATA_PROPS_MAP: PlainObject<string[]> = {
    // Person
    H: [
        // image
        'P18',
        // place of birth
        'P19',

        // place of death
        'P20',
        // sex or gender
        'P21',
        // father
        'P22',
        // mother
        'P25',
        // spouse
        'P26',
        // country of citizenship
        'P27',


        // instance of
        'P31',
        // position held
        // 'P39',

        // child
        'P40',

        // educated at
        'P69',

        // native language
        'P103',
        // occupation
        'P106',
        // award received
        // 'P166',

        // ISNI
        'P213',
        // VIAF ID
        'P214',
        // GND ID
        'P227',

        // IMDb ID
        'P345',

        // date of birth
        'P569',
        // date of death
        'P570',

        // family name
        'P734',
        // given name
        'P735',

        // official website
        'P856',

        // nickname
        'P1449',
        // birth name
        'P1477',
        // name in native language
        'P1559',

        // Twitter username
        'P2002',
        // Instagram username
        'P2003',
        // Facebook ID
        'P2013',
        // YouTube channel ID
        'P2397',

        // sibling
        'P3373',
        // Quora topic ID
        'P3417',
        // stepparent
        'P3448'
    ],
    // Location
    L: [
        // instance of
        'P31',
        // image
        'P18',
        // country
        'P17',
        // capital of
        'P1376',
        // located in the administrative territorial entity
        'P131',
        // coordinate location
        'P625',
        // population
        // 'P1082',
        // elevation above sea level
        'P2044',
        // located in time zone
        'P421',
        // flag image
        'P41',
        // GeoNames ID
        'P1566',
        // ISO 3166-2 code
        'P300',
        // FIPS 10-4 (countries and regions)
        'P901',
        // postal code
        'P281',
        // capital
        'P36',
        // Facebook Places ID
        'P1997',
        // Twitter username
        'P2002',
        // Instagram username
        'P2003',
        // Facebook ID
        'P2013',
        // YouTube channel ID
        'P2397',
        // official website
        'P856',
        // Quora topic ID
        'P3417'
    ],
    // Organisation
    O: [
        // instance of
        'P31',
        // image
        'P18',
        // logo image
        'P154',
        // country
        'P17',
        // inception
        'P571',
        // founded by / founder
        'P112',
        // chairperson
        'P488',
        // membership
        'P2124',
        // headquarters location
        'P159',
        // CEO (chief executive officer)
        'P169',
        // chief operating officer
        'P1789',
        // owned by
        'P127',
        // employees
        'P1128',
        // Twitter username
        'P2002',
        // Instagram username
        'P2003',
        // Facebook ID
        'P2013',
        // YouTube channel ID
        'P2397',
        // official website
        'P856',
        // Quora topic ID
        'P3417'
    ],
    // Event
    E: [
        // instance of
        'P31',
        // genre
        'P136',
        // continent
        'P30',
        // start time
        'P580',
        // end time
        'P582',
        // organizer
        'P664',
        // location
        'P276',
        // point in time
        'P585',
        // winner
        'P1346',


        // image
        'P18',
        // country
        'P17',
        // coordinate location
        'P625',

        // Twitter username
        'P2002',
        // Instagram username
        'P2003',
        // Facebook ID
        'P2013',
        // YouTube channel ID
        'P2397',
        // official website
        'P856',
        // Quora topic ID
        'P3417'
    ],
    // Product
    P: [
        // instance of
        'P31',
        // manufacturer
        'P176',
        // designed by
        'P287',
        // series
        'P179',
        // operating system
        'P306',
        // developer
        'P178',


        // image
        'P18',
        // logo image
        'P154',

        // Twitter username
        'P2002',
        // Instagram username
        'P2003',
        // Facebook ID
        'P2013',
        // YouTube channel ID
        'P2397',
        // official website
        'P856',
        // Quora topic ID
        'P3417'
    ],
    // Concept
    C: [
        // instance of
        'P31',
        // image
        'P18',
        // logo image
        'P154',

        // Twitter username
        'P2002',
        // Instagram username
        'P2003',
        // Facebook ID
        'P2013',
        // YouTube channel ID
        'P2397',
        // official website
        'P856',
        // Quora topic ID
        'P3417'
    ]
};

const ENTITY_DATA_PROPS: string[] = uniq(Object.keys(ENTITY_DATA_PROPS_MAP).reduce<string[]>((list, type) => list.concat(ENTITY_DATA_PROPS_MAP[type]), []));

// const INVALID_DATA_PROPS = [
//     // religion
//     'P140',
//     // member of political party
//     'P102',
//     // position held
//     'P39',
//     // member count
//     'P2124',
//     // located next to body of water
//     'P206',
//     // population
//     'P1082',
//     // area
//     'P2046',
//     // elevation above sea level
//     'P2044',
//     // located in time zone
//     'P421',
//     // sister city
//     'P190',
//     // Commons gallery
//     'P935',
//     // Commons category
//     'P373',
//     // topic's main category
//     'P910',
//     // category of associated people
//     'P1792',
//     // category for people born here
//     'P1464',
//     // category for people who died here
//     'P1465',
//     // Dewey Decimal Classification
//     'P1036',
//     // permanent duplicated item
//     'P2959',
//     // part of
//     'P361',
//     // number of children
//     'P1971',
//     // languages spoken, written or signed
//     'P1412',
//     // native language
//     'P103',
//     // employer
//     'P108',
//     // influenced by
//     'P737',
//     // significant event
//     'P793',
//     // award received
//     //'P166',
//     // nominated for
//     //'P1411',
//     // educated at
//     'P69',
//     // academic degree
//     'P512',
//     // residence
//     'P551',
//     // ethnic group
//     'P172',
//     // signature
//     'P109',
//     // mass
//     'P2067'
// ];
