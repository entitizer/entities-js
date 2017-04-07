
// import { IPlainObject } from 'entitizer.models';

// export type KeyringEntityLink = {
//     /**
//      * relation types. Wikidata property: P31, etc.
//      */
//     t: string[];
//     n?: string;
// }

// export type KeyringEntity = {
//     /**
//      * Names joined by a |
//      */
//     n: string;
//     /**
//      * Entity type: "H" | "P" | "O" | "E" | "L"
//      */
//     tp: string;
//     /**
//      * Entity popularity
//      */
//     p: number;
//     /**
//      * Country code 2 chars
//      */
//     cc?: string;
//     /**
//      * Entity links
//      */
//     ls?: IPlainObject<KeyringEntityLink>;
// }

export const ENTITY_PROPS = {
    instanceOf: 'P31',
    sexOrGender: 'P21',
    dateOfBirth: 'P569',
    occupation: 'P106',
    countryOfCitizenship: 'P27',
    familyName: 'P734',
    father: 'P22',
    mather: 'P25',
    spouse: 'P26',
    nativeLanguage: 'P103',
    positionHeld: 'P39',
    nickname: 'P1449',
    dateOfDeath: 'P570',
    placeOfDeath: 'P20',
    placeOfBirth: 'p19',
    country: 'P17',
    capitalOf: 'P1376',
    locatedInAdmEntity: 'P131',
    coordinateLocation: 'P625',
    population: 'P1082',
    locatedInTimezone: 'P421',
    flagImage: 'P41',
    capital: 'P36',
    image: 'P18',
    logoImage: 'P154',
    foundedBy: 'P112',
    chairperson: 'P488',
    headquartersLocation: 'P159',
    CEO: 'P169',
    COO: 'P1789',
    ownedBy: 'P127',
    organizer: 'P664',
    location: 'P276',
    winner: 'P1346',
    manufacturer: 'P176',
    designedBy: 'P287',
    developer: 'P178'
}
