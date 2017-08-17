
import * as Joi from 'joi';

const wikiIdRegex = /^Q\d+$/;
const entityIdRegex = /^[A-Z]{2}Q\d+$/;
const langRegex = /^[a-z]{2}$/;
const entityNameMaxLength = 200;
const entityNameMinLength = 2;
const entityAbbrMaxLength = 20;
const entityAbbrMinLength = 1;
const entityDescriptionMaxLength = 400;
const entityDescriptionMinLength = 10;
const entityMaxAliases = 50;
const entityMaxTypes = 16;
const entityExtractMaxLength = 500;
const entityExtractMinLength = 50;
const entityWikiImageMaxLength = 200;
const entityWikiImageMinLength = 5;
const entityTypeMaxLength = 20;
const entityTypeMinLength = 2;

export const createEntity = Joi.object().keys({
    id: Joi.string().regex(entityIdRegex).required(),
    lang: Joi.string().trim().lowercase().regex(langRegex).required(),
    wikiId: Joi.string().regex(wikiIdRegex).required(),
    name: Joi.string().min(entityNameMinLength).max(entityNameMaxLength).required(),
    abbr: Joi.string().min(entityAbbrMinLength).max(entityAbbrMaxLength),
    description: Joi.string().min(entityDescriptionMinLength).max(entityDescriptionMaxLength),
    wikiPageId: Joi.number().integer().positive(),
    aliases: Joi.array().items(Joi.string().min(entityNameMinLength).max(entityNameMaxLength).required()).max(entityMaxAliases),
    extract: Joi.string().min(entityExtractMinLength).max(entityExtractMaxLength),
    wikiTitle: Joi.string().min(entityNameMinLength).max(entityNameMaxLength),
    wikiImage: Joi.string().min(entityWikiImageMinLength).max(entityWikiImageMaxLength),
    type: Joi.valid('EVENT', 'LOCATION', 'ORG', 'PERSON', 'PRODUCT', 'CONCEPT'),
    types: Joi.array().items(Joi.string().min(entityTypeMinLength).max(entityTypeMaxLength).required()).max(entityMaxTypes),
    cc2: Joi.string().regex(langRegex),
    rank: Joi.number().integer().positive(),
    data: Joi.object().pattern(/^[a-zA-Z][a-zA-Z0-9_]$/, Joi.string().min(1).max(200).required()),
    /**
     * created at timestamp
     */
    createdAt: Joi.number().integer().positive().required(),
    /**
     * updated at timestamp
     */
    updatedAt: Joi.number().integer().positive(),

    redirectId: Joi.string().regex(entityIdRegex)
}).required();

export const updateEntity = Joi.object().required();

export const createEntityUniqueName = Joi.object().required();
export const updateEntityUniqueName = Joi.object().required();
