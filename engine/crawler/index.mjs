"use strict";
// Third party
import PQueue from "p-queue";

// Built in modules
import { Frontier } from "./frontier.mjs";
import { acquireDomain, releaseDomain } from "./scheduler.mjs";
import { fetchPage } from "./fetcher.mjs";
import { parse } from "./parser.mjs";
import { savePage, saveFrontier, loadFrontier, saveContentHash } from "./store.mjs";
import { canCrawl } from "./robots.mjs";
import { skipTypes, sanitizeText, isDuplicate, seenContent } from "./filter.mjs";

import { loadSettings } from "./settings.mjs";

const settings = loadSettings();
const frontier = new Frontier();

loadFrontier(frontier);

setInterval(() => {
    saveFrontier(frontier);
    saveContentHash(seenContent);
    console.log("Frontier saved");
}, settings['SAVE_TIME_INTERVALL']);


const SEED_DOMAINS = settings['SEED_DOMAINS'] || [];
const MAX_DEPTH = settings['MAX_DEPTH'];
const MAX_PAGES = settings['MAX_PAGES'];
const CONCURRENCY = settings['CONCURRENCY'];

let crawled_sites = 0;

for (let i = 0; i < SEED_DOMAINS.length; i++) {
    frontier.add(`https://${SEED_DOMAINS[i]}`, 0);
}


const queue = new PQueue({ concurrency: CONCURRENCY });

async function handleUrl({ url,  search_depth }) {

    if (search_depth > MAX_DEPTH) return;
    // if (new URL(url).hostname !== SEED_DOMAINS) return;
    if (crawled_sites >= MAX_PAGES) return;
    if (!(await canCrawl(url))) return;
    if (skipTypes(url)) return;
    
    console.log("Begining to crawl site: ", url);

    await acquireDomain(url, settings['AQUIRE_DOMAIN_MS']);

    try {
        const html = await fetchPage(url, settings['FETCH_PAGE_ABORT_TIME']);
    
        if (!html) {
            return;
        }
    
        const {links, anchors, title, text} = parse(html, url);

        const sanitized = sanitizeText(text);

        if (isDuplicate(sanitized)) {
            return;
        }
    
        savePage({
            url,
            title,
            text: sanitized,
            anchors,
            timeStamp: Date.now()
        });
    
        crawled_sites += 1;
    
        for (const link of links) {
            frontier.add(link, search_depth + 1);
        }
    } finally {
        releaseDomain(url);
    }
}

async function main() {
    while (true) {
        const item = frontier.next();

        if (!item) {
            if (queue.size === 0 && queue.pending === 0) break;
            await new Promise(r => setTimeout(r, 200));
            continue;
        }

        console.log("FRONTIER ITEM:", item, typeof item.url);

        queue.add(() => handleUrl(item));
    }

    await queue.onIdle();
    console.log("Done.");
}

main();