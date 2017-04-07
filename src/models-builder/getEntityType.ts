
import { EntityTypeValue, IPlainObject, EntityTypes } from 'entitizer.models'
import { WikiEntity } from 'wiki-entity'

const TYPES_MAP = {
    'dbo:PopulatedPlace': EntityTypes.LOCATION,
    'dbo:Place': EntityTypes.LOCATION,
    'schema:Place': EntityTypes.LOCATION,
    'schema:City': EntityTypes.LOCATION,
    'dbo:Location': EntityTypes.LOCATION,
    'wikidata:Q515': EntityTypes.LOCATION,
    'wikidata:Q486972': EntityTypes.LOCATION,

    'schema:Person': EntityTypes.PERSON,
    'wikidata:Q215627': EntityTypes.PERSON,
    'dul:NaturalPerson': EntityTypes.PERSON,
    'wikidata:Q5': EntityTypes.PERSON,
    'foaf:Person': EntityTypes.PERSON,
    'dbo:Person': EntityTypes.PERSON,

    'schema:Organization': EntityTypes.ORGANIZATION,
    'dbo:Organisation': EntityTypes.ORGANIZATION,
    'wikidata:Q43229': EntityTypes.ORGANIZATION,

    'wikidata:Q1656682': EntityTypes.EVENT,
    'dul:Event': EntityTypes.EVENT,
    'schema:Event': EntityTypes.EVENT,
    'dbo:Event': EntityTypes.EVENT
};

// const TypesKeys = Object.keys(TYPES_MAP);

export function getEntityType(wikiEntity: WikiEntity): EntityTypeValue {
    if (!wikiEntity.types) {
        return null;
    }

    for (var i = 0; i < wikiEntity.types.length; i++) {
        if (TYPES_MAP[wikiEntity.types[i]]) {
            return TYPES_MAP[wikiEntity.types[i]];
        }
    }

}
