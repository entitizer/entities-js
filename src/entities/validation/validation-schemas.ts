
import * as Joi from 'joi';
import { Constants } from '../../constants';

const wikiIdRegex = /^Q\d+$/;
const entityIdRegex = /^[A-Z]{2}Q\d+$/;
const langRegex = /^[a-z]{2}$/;
const entityNameMaxLength = 200;
const entityNameMinLength = 2;
const entityAbbrMaxLength = 20;
const entityAbbrMinLength = 1;
const entityDescriptionMaxLength = 400;
const entityDescriptionMinLength = 2;
const entityMaxAliases = 50;
const entityMaxTypes = 16;
const entityExtractMaxLength = 400;
const entityExtractMinLength = 2;
// const entityWikiImageMaxLength = 200;
// const entityWikiImageMinLength = 5;
const entityTypeMaxLength = 50;
const entityTypeMinLength = 2;

const categoryNameMaxLength = 200;
const categoryNameMinLength = 2;
const entityMaxCategories = 10;

export const createEntity = Joi.object().keys({
    id: Joi.string().regex(entityIdRegex).required(),
    lang: Joi.string().trim().lowercase().regex(langRegex).valid(Constants.languages).required(),
    wikiId: Joi.string().regex(wikiIdRegex).required(),
    name: Joi.string().min(entityNameMinLength).max(entityNameMaxLength).required(),
    abbr: Joi.string().min(entityAbbrMinLength).max(entityAbbrMaxLength),
    description: Joi.string().min(entityDescriptionMinLength).max(entityDescriptionMaxLength),
    wikiPageId: Joi.number().integer().positive(),
    aliases: Joi.array().items(Joi.string().min(entityNameMinLength).max(entityNameMaxLength)).max(entityMaxAliases).unique(),
    extract: Joi.string().min(entityExtractMinLength).max(entityExtractMaxLength),
    wikiTitle: Joi.string().min(entityNameMinLength).max(entityNameMaxLength),
    type: Joi.string().valid('E', 'L', 'O', 'H', 'P', 'C').required(),
    types: Joi.array().items(Joi.string().min(entityTypeMinLength).max(entityTypeMaxLength)).unique().max(entityMaxTypes),
    cc2: Joi.string().lowercase().regex(langRegex),
    rank: Joi.number().integer().positive(),
    data: Joi.object({}).pattern(/^P\d+$/, Joi.array().items(Joi.string().trim().min(1).max(200)).unique().required()),
    categories: Joi.array().items(Joi.string().min(categoryNameMinLength).max(categoryNameMaxLength)).max(entityMaxCategories).unique(),
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

export const updateEntity = Joi.object().keys({
    id: Joi.string().regex(entityIdRegex).required(),
    set: Joi.object().keys({
        name: Joi.string().min(entityNameMinLength).max(entityNameMaxLength),
        abbr: Joi.string().min(entityAbbrMinLength).max(entityAbbrMaxLength),
        description: Joi.string().min(entityDescriptionMinLength).max(entityDescriptionMaxLength),
        wikiPageId: Joi.number().integer().positive(),
        aliases: Joi.array().items(Joi.string().min(entityNameMinLength).max(entityNameMaxLength)).max(entityMaxAliases).unique(),
        extract: Joi.string().min(entityExtractMinLength).max(entityExtractMaxLength),
        wikiTitle: Joi.string().min(entityNameMinLength).max(entityNameMaxLength),
        type: Joi.string().valid('E', 'L', 'O', 'H', 'P', 'C'),
        types: Joi.array().items(Joi.string().min(entityTypeMinLength).max(entityTypeMaxLength)).unique().max(entityMaxTypes),
        cc2: Joi.string().lowercase().regex(langRegex),
        rank: Joi.number().integer().positive(),
        data: Joi.object({}).pattern(/^P\d+$/, Joi.array().items(Joi.string().trim().min(1).max(200)).unique().required()),
        categories: Joi.array().items(Joi.string().min(categoryNameMinLength).max(categoryNameMaxLength)).max(entityMaxCategories).unique(),
        /**
         * updated at timestamp
         */
        updatedAt: Joi.number().integer().positive().required(),

        redirectId: Joi.string().regex(entityIdRegex)
    }),
    delete: Joi.array().items(Joi.string().valid(['abbr', 'description', 'wikiPageId', 'extract', 'wikiTitle', 'cc2', 'data', 'redirectId']))
}).or('set', 'delete').required();

export const createUniqueName = Joi.object().keys({
    entityId: Joi.string().regex(entityIdRegex).required(),
    lang: Joi.string().trim().lowercase().regex(langRegex).valid(Constants.languages).required(),
    name: Joi.string().trim().min(entityNameMinLength).max(entityNameMaxLength).required(),
    uniqueName: Joi.string().trim().min(entityNameMinLength).max(entityNameMaxLength).required(),
    key: Joi.string().trim().min(16).max(50).required(),
    /**
     * created at timestamp
     */
    createdAt: Joi.number().integer().positive().required()
}).required();

export const updateUniqueName = Joi.object().required();
