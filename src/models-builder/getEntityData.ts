
import { WikiEntity } from 'wiki-entity';
import { Entity, EntityTypeValue, EntityData, IPlainObject } from 'entitizer.models';

export function getEntityData(wikiEntity: WikiEntity, type: EntityTypeValue): EntityData {
    if (!wikiEntity.claims || !type) {
        return null;
    }
    const types = ENTITY_DATA_PROPS[type];
    if (!types) {
        return null;
    }
    const data: EntityData = {};

    for (var key in wikiEntity.claims) {
        const vlength = wikiEntity.claims[key].values.length;
        if (~types.indexOf(key) && vlength) {
            data[key] = [];
            const values = (!!PROP_LIMITS[key]) ? wikiEntity.claims[key].values.slice(0, PROP_LIMITS[key]) : wikiEntity.claims[key].values;

            values.forEach(value => {
                const v: { value: string, label?: string } = { value: value.value_string || value.value.toString() };
                if (PROP_PARSERS[key]) {
                    v.value = PROP_PARSERS[key](v.value);
                }
                if (value.label && v.value !== value.label) {
                    v.label = value.label;
                }
                data[key].push(v);
            });
        }
    }

    return data;
}

const ENTITY_DATA_PROPS: IPlainObject<string[]> = {
    // Person
    H: [
        // instance of
        'P31',
        // sex or gender
        'P21',
        // date of birth
        'P569',
        // occupation
        'P106',
        // country of citizenship
        'P27',
        // family name
        'P734',
        // father
        'P22',
        // mother
        'P25',
        // spouse
        'P26',
        // native language
        'P103',
        // position held
        'P39',
        // nickname
        'P1449',
        // IMDb ID
        'P345',
        // ISNI
        'P213',
        // Twitter username
        'P2002',
        // Instagram username
        'P2003',
        // Facebook ID
        'P2013',
        // YouTube channel ID
        'P2397',
        // date of death
        'P570',
        // place of birth
        'P19',
        // place of death
        'P20',
        // official website
        'P856',
        // Quora topic ID
        'P3417'
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
        'P1082',
        // elevation above sea level
        'P2044',
        // located in time zone
        'P421',
        // flag image
        'P41',
        // GeoNames ID
        'P1566',
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
    ]
};

const PROP_PARSERS = {
    // P570: dateParser,
    // P569: dateParser
};

const PROP_LIMITS = {
    P17: 1,
    P18: 1,
    P1376: 1,
    P131: 1,
    P1566: 1,
    P1128: 1,
    P2124: 1,
    P276: 1,
    P27: 1,
    // occupation:
    P106: 5
};

// function dateParser(date: string): string {
//     if (date[0] === '+') {
//         date = date.substr(1);
//     }

//     const i = date.indexOf('T');
//     if (i > 0) {
//         date = date.substr(0, i);
//     }

//     return date;
// }
