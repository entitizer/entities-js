
// const debug = require('debug')('models-builder');
import { WikiEntity, WikidataPropertyValue } from 'wiki-entity';
import { Entity } from 'entitizer.models';
import { getEntityType } from './getEntityType';
import { getEntityType as getEntityInstanceType } from './getEntityInstanceType';
import * as _ from 'lodash';
import { getEntityData } from './getEntityData';
import { getEntityCC2 } from './getEntityCountry';
const atonic = require('atonic');

export function wikiEntityToEntity(wikiEntity: WikiEntity, lang: string): Entity {
    // debug('wikiEntityToEntity:', lang, wikiEntity);
    const entity: Entity = {};
    entity.lang = lang.toLowerCase();
    entity.wikiId = wikiEntity.id;
    entity.type = getEntityType(wikiEntity);
    if (!entity.type) {
        entity.type = getEntityInstanceType(wikiEntity);
    }
    if (wikiEntity.types) {
        entity.types = _.uniq(wikiEntity.types.filter(item => !/:(Thing|Agent)$/.test(item)));
    }
    entity.name = wikiEntity.label;
    entity.description = wikiEntity.description;
    entity.wikiPageId = wikiEntity.pageid;
    entity.extract = wikiEntity.extract;
    entity.rank = 1;
    if (wikiEntity.sitelinks) {
        entity.wikiTitle = wikiEntity.sitelinks[lang];
        if (lang !== 'en') {
            entity.enWikiTitle = wikiEntity.sitelinks.en;
        }
        entity.rank += Object.keys(wikiEntity.sitelinks).length;
    }

    entity.aliases = wikiEntity.aliases || [];
    entity.aliases = entity.aliases.concat(wikiEntity.redirects || []);
    if (entity.aliases.length) {
        entity.aliases = _.uniqBy(entity.aliases, al => atonic(al.toLowerCase()));
        entity.rank += entity.aliases.length / 2;
    }

    if (wikiEntity.claims) {
        const ids = Object.keys(wikiEntity.claims);
        if (ids.length) {
            // detect wikiImage
            for (var i = 0; i < ids.length; i++) {
                const img: WikidataPropertyValue = _.find(wikiEntity.claims[ids[i]].values, { datatype: 'commonsMedia' });
                if (img) {
                    entity.wikiImage = img.value;
                    break;
                }
            }
            entity.data = getEntityData(wikiEntity, entity.type);
        }

        if (entity.type) {
            entity.cc2 = getEntityCC2(wikiEntity, entity.type);
        }

        entity.rank += ids.length;
    }

    entity.rank = parseInt(entity.rank.toString());

    return entity;
}
