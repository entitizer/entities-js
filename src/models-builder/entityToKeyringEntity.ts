
// import { ENTITY_PROPS } from './types';
// import { Entity } from 'entitizer.models';
// const _ = require('lodash');
// const atonic = require('atonic');

// const VALID_PROPS = [
//     ENTITY_PROPS.CEO,
//     ENTITY_PROPS.COO,
//     ENTITY_PROPS.capital,
//     ENTITY_PROPS.capitalOf,
//     ENTITY_PROPS.chairperson,
//     ENTITY_PROPS.country,
//     ENTITY_PROPS.countryOfCitizenship,
//     ENTITY_PROPS.designedBy,
//     ENTITY_PROPS.developer,
//     ENTITY_PROPS.father,
//     ENTITY_PROPS.foundedBy,
//     ENTITY_PROPS.headquartersLocation,
//     ENTITY_PROPS.locatedInAdmEntity,
//     ENTITY_PROPS.location,
//     ENTITY_PROPS.manufacturer,
//     ENTITY_PROPS.mather,
//     ENTITY_PROPS.organizer,
//     ENTITY_PROPS.ownedBy,
//     ENTITY_PROPS.placeOfBirth,
//     ENTITY_PROPS.placeOfDeath,
//     ENTITY_PROPS.spouse,
//     ENTITY_PROPS.winner
// ];

// export function entityToKeyringEntity(entity: Entity): KeyringEntity {
//     const crEntity: KeyringEntity = {
//         n: entity.name,
//         tp: entity.type,
//         p: entity.rank,
//         ls: {}
//     };

//     crEntity.n = _.uniqBy([crEntity.n].concat(entity.aliases).slice(0, 3), el => atonic(el.toLowerCase())).join('|');

//     if (entity.cc2) {
//         crEntity.cc = entity.cc2;
//     }

//     if (entity.data) {
//         Object.keys(entity.data).forEach(prop => {
//             if (~VALID_PROPS.indexOf(prop)) {
//                 entity.data[prop].forEach(value => {
//                     const qid = value.value;
//                     if (isWikidataId(qid)) {
//                         if (crEntity.ls[qid]) {
//                             if (crEntity.ls[qid].t.indexOf(prop) < 0) {
//                                 crEntity.ls[qid].t.push(prop);
//                             }
//                         } else {
//                             crEntity.ls[qid] = { t: [prop] };
//                             if (value.label) {
//                                 crEntity.ls[qid].n = value.label;
//                             }
//                         }
//                     }
//                 });
//             }
//         });
//     }

//     if (Object.keys(crEntity.ls).length === 0) {
//         delete crEntity.ls;
//     }

//     return crEntity;
// }

// function isWikidataId(value: string): boolean {
//     return /^Q\d+$/.test(value);
// }
