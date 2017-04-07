'use strict';

const debug = require('debug')('script');
const request = require('request');
const Promise = require('bluebird');
const fs = require('fs');
const path = require('path');

const DATA_MAP = {
    // Events: Event
    E: { list: ['Q1656682'], deep: 3 },
    // Persons: Human
    H: { list: ['Q5'], deep: 2 },
    // Locations: Location (Q17334923)
    L: { list: ['Q17334923'], deep: 3 },
    // Organizations: Organization (Q43229)
    O: { list: ['Q43229'], deep: 3 },
    // Works: work (Q386724), intellectual work (Q15621286), creative work (Q17537576), fictitious entity (Q14897293), fictional character (Q95074), mythical character (Q4271324), publication (Q732577)
    // Products: product (Q2424752), brand (Q431289), model (Q17444171)
    P: { list: ['Q2424752', 'Q431289', 'Q17444171'], deep: 3 }
};

function unique(list) {
    return list.filter(function (item, pos, self) {
        return self.indexOf(item) === pos;
    });
}

function exploreIds(ids, deep, mainList, loopCount) {
    debug('eploring ids:', ids);
    mainList = mainList || [];
    loopCount = loopCount || 0;

    if (ids.length === 0 || loopCount === deep) {
        return mainList.filter(function (item, pos, self) {
            return self.indexOf(item) === pos;
        });
    }

    return Promise.map(ids, query, { concurrency: 5 })
        .then(function (lists) {
            for (var i = 1; i < lists.length; i++) {
                lists[0] = lists[0].concat(lists[i]);
            }
            return unique(lists[0]);
        })
        .delay(1000 * 1)
        .then(function (list) {
            mainList = mainList.concat(list);
            return exploreIds(list, deep, mainList, 1 + loopCount);
        });
}

function buildResult() {
    const props = {};

    Object.keys(DATA_MAP).forEach(function (key) {
        props[key] = exploreIds(DATA_MAP[key].list, DATA_MAP[key].deep)
            .then(list => list.concat(DATA_MAP[key].list))
            .then(unique);
    });

    return Promise.props(props);
}

function saveResult(result) {
    try {
        fs.writeFileSync(path.join(__dirname, '../data/entity_types.json'), JSON.stringify(result), { encoding: 'utf8' });
    } catch (e) {
        return Promise.reject(e);
    }
    return Promise.resolve();
}

function run() {
    return buildResult().then(saveResult);
}

function query(id) {
    return new Promise(function (resolve, reject) {
        request({
            url: 'https://query.wikidata.org/bigdata/namespace/wdq/sparql',
            method: 'GET',
            qs: {
                query: `SELECT DISTINCT ?item ?itemLabel
WHERE
{
	?item wdt:P279 wd:${id} .
    SERVICE wikibase:label {
		bd:serviceParam wikibase:language "en,de,fr,ru,es" 
	}
}
ORDER BY ?item
limit 1000`
            },
            json: true
        }, function (error, response, json) {
            if (error) {
                return reject(error);
            }
            if (!json.results || !json.results.bindings || !json.results.bindings.length) {
                // console.log('result is null', json);
                return resolve([]);
            }

            const ids = json.results.bindings.filter(it => it.itemLabel && it.itemLabel['xml:lang'] && it.itemLabel.value)
                .map(it => it.item.value.substr(it.item.value.indexOf('/entity/') + 8));
            // ids.unshift(id);
            resolve(ids);
        });
    });
}

run()
    .then(function () {
        console.log('OK');
    })
    .catch(function (error) {
        console.error(error);
    });


