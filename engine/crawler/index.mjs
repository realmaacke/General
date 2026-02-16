"use strict";
// Third party
import PQueue from "p-queue";

import { loadSettings } from "./settings.mjs";
import { SeenStore } from "./seenStore.mjs";
import { Frontier } from "./frontier.mjs";
import { canCrawl } from "./robots.mjs";
import { sanitizeText, skipTypes } from "./filter.mjs";
import { Scheduler } from "./scheduler.mjs";
import { fetchPage } from "./fetcher.mjs";
import { parse } from "./parser.mjs";
import { savePage } from "./store.mjs";

class Main {
    constructor() {
        this.loadConfig();

        this.seenStore = new SeenStore(this.settings);
        this.frontier = new Frontier(this.seenStore);
        this.scheduler = new Scheduler();
    }

    async freshStart() {
        await this.seenStore.removeOld();
    }
    
    loadConfig() {
        this.crawled_sites = 0;

        this.settings = loadSettings();
        this.SEED_DOMAINS = this.settings['SEED_DOMAINS'] || [];
        this.MAX_DEPTH = this.settings['MAX_DEPTH'];
        this.MAX_PAGES = this.settings['MAX_PAGES'];
        this.CONCURRENCY = this.settings['CONCURRENCY'];

        this.queue = new PQueue({ concurrency: this.CONCURRENCY });
    }

    async setStatus(id) {
        await this.seenStore.setStatus(id, 'done');
    }

    async handleUrl({ id, url, search_depth }) {
        try {

            if (search_depth > this.MAX_DEPTH ){
                console.log("Search depth reached: url: ", url);
                return await this.setStatus(id);
            }
            if (this.crawled_sites >= this.MAX_PAGES) return await this.setStatus(id);
            if (!(await canCrawl(url))) return;
            if (skipTypes(url)) return await this.setStatus(id);
            if (!(await this.seenStore.isNewHash(url))) return await this.setStatus(id);

            console.log("Starting Crawl: [site] :", url);

            await this.scheduler.acquireDomain(url, this.settings['AQUIRE_DOMAIN_MS']);

            const rawHtml = await fetchPage(url, this.settings['FETCH_PAGE_ABORT_TIME']);
            if (!rawHtml) return;

            const { links, anchors, title, text } = parse(rawHtml, url);
            const sanitized = sanitizeText(text);

            savePage({
                url,
                title,
                text: sanitized,
                anchors,
                timeStamp: Date.now()
            });

            this.crawled_sites += 1;

            for (const link of links) {
                await this.frontier.add(link, search_depth + 1);
            }
        } catch (err) {
            await this.seenStore.setStatus(id, 'failed')
            console.error("Could not handle site : " + url + "| error: ", err);
        } finally {
            await this.seenStore.setStatus(id, 'done')
        }
    }
    
    async init() {
        // Warm up mariadb
        await this.seenStore.pool.query("SELECT 1");

        // Remove if you want to keep data
        await this.freshStart();

        // Init with the seed domains
        for (let i = 0; i < this.SEED_DOMAINS.length; i++) {
            await this.frontier.add(`https://${this.SEED_DOMAINS[i]}`, 0);
        }

        while (true) {
            const batch = await this.seenStore.nextbatch(50);

            if (batch.length === 0) {
                if (this.queue.size === 0 && this.queue.pending === 0) break;
                await new Promise(resolve => setTimeout(resolve, 200));
                continue;
            }

            for (const target of batch) {
                this.queue.add(() => this.handleUrl(target));
            }
        }
        await this.queue.onIdle();
    }
}

async function main() {
    const main = new Main();
    await main.init();
}

main();