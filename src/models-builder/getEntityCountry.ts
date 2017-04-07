
import { EntityTypeValue, IPlainObject, EntityTypes } from 'entitizer.models'
import { WikiEntity, WikidataProperty } from 'wiki-entity'
const countries = require('../../data/countries.json');

// const TypesKeys = Object.keys(TYPES_MAP);

export function getEntityCC2(wikiEntity: WikiEntity, type: EntityTypeValue): string {
    if (!wikiEntity || !type) {
        return null;
    }

    const countryIds = getEntityCountryIds(wikiEntity, type);

    for (var i = 0; i < countryIds.length; i++) {
        const id = countryIds[i];
        if (countries[id]) {
            return countries[id].cc2;
        }
    }

    return null;
}

function getEntityCountryIds(wikiEntity: WikiEntity, type: EntityTypeValue): string[] {
    let prop: WikidataProperty = wikiEntity.claims.P17;
    switch (type) {
        case EntityTypes.PERSON:
            // P27 - country of citizenship
            prop = prop || wikiEntity.claims.P27;
            break;
        // case EntityTypes.LOCATION:
        //     // P17 - country
        //     prop = wikiEntity.claims.P17;
        //     break;
        // case EntityTypes.ORGANIZATION:
        //     // P17 - country
        //     prop = wikiEntity.claims.P17;
        //     break;
    }

    if (prop) {
        return prop.values.map(item => item.value);
    }
    return [];
}