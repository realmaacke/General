"use strict";
import { loadSettings, SettingsType, loadFilters, FiltersType, canCrawl } from "./util.js";

import { Store } from "./handler/store.js";
import { Frontier } from "./handler/frontier.js";
import { Scheduler } from "./handler/scheduler.js";
import { Parser, ParsedObject } from "./handler/parser.js";
import { Fetcher } from "./handler/fetcher.js";

import PQueue from "p-queue";

interface urlProcessObject {
    id: any,
    url: string,
    search_depth: number
}

class Main {
    settings: SettingsType | null;
    filters: FiltersType | null;

    store: Store | null = null;
    queue: PQueue | null = null;
    frontier: Frontier | null = null;
    scheduler: Scheduler | null = null;

    parser: Parser | null = null;
    fetcher: Fetcher | null = null;

    crawled_sites: number = 0;

    private assertInitialized(): asserts this is {
        settings: SettingsType;
        filters: FiltersType,

        store: Store;
        queue: PQueue,
        frontier: Frontier;
        scheduler: Scheduler,

        parser: Parser,
        fetcher: Fetcher,
    } {
        if (!this.settings) throw new Error("Settings isn't initialized");
        if (!this.filters) throw new Error("Filters isn't initialized");

        if (!this.store) throw new Error("Store isn't initialized");
        if (!this.queue) throw new Error("Queue isn't initialized");
        if (!this.frontier) throw new Error("Frontier isn't initialized");
        if (!this.scheduler) throw new Error("Scheduler isn't initialized");

        if (!this.parser) throw new Error("Parser not initialized");
        if (!this.fetcher) throw new Error("Fetcher isn't initialized");
    }

    constructor(settings: SettingsType | null, filters: FiltersType | null) {
        this.settings = settings;
        this.filters = filters;

        if (!this.settings || !this.filters) {
            return;
        }

        this.store = new Store(this.settings);
        this.frontier = new Frontier(this.store);
        this.scheduler = new Scheduler();
        this.parser = new Parser();
        this.fetcher = new Fetcher(this.settings, "General Crawler/0.1");

        this.queue = new PQueue({ concurrency: this.settings.CONCURRENCY });
    }

    async processUrl(urlObject: urlProcessObject) {
        this.assertInitialized();

        try {
            if (urlObject.search_depth > this.settings?.MAX_DEPTH) {
                console.log("Search depth reached url: ", urlObject.url);
                return await this.store.setStatus(urlObject.id, 'done');
            }
            if (this.crawled_sites >= this.settings.MAX_PAGES) {
                return await this.store.setStatus(urlObject.id, 'done');
            }

            if (!(await canCrawl(urlObject.url)))
                return;
            if (this.parser.skipTypes(urlObject.url))
                return await this.store.setStatus(urlObject.id, 'done');

            if (!(await this.store.isNotExistingHash(Buffer.from(urlObject.url)))) {
                return await this.store.setStatus(urlObject.id, 'done');
            }

            console.log("Crawling: ", urlObject.url);

            await this.scheduler.acquireDomain(urlObject.url, this.settings.AQUIRE_DOMAIN_MS);

            const rawHtml = await this.fetcher.fetchPage(urlObject.url, this.settings.FETCH_PAGE_ABORT_TIME);

            if (!rawHtml) return;

            const parseRes: ParsedObject = this.parser.parse(rawHtml, urlObject.url);
            const sanitized = this.parser.sanitizeText(parseRes.text);

            /**
             * Save page here, do it in db
             * 
             * savePage({
             *  url,
             *  title,
             *  text: sanitized,
             *  anchors,
             *  timeStamp: Date.now()
             * })
             */

            this.crawled_sites++;

            for (const link of parseRes.links) {
                await this.frontier.add(link, urlObject.search_depth + 1);
            }
        } catch (error) {
            await this.store.setStatus(urlObject.id, 'failed');
            console.error("[Class]: Main, could not handle site: ", urlObject.url)
        } finally {
            this.store.setStatus(urlObject.id, 'done');
        }
    }

    async init() {
        this.assertInitialized();

        // Used to warmup the db, after idle.
        await this.store?.pool.query("SELECT 1");

        for (let i = 0; i < this.settings.SEED_DOMAINS.length; i++) {
            await this.frontier.add(`https://${this.settings.SEED_DOMAINS[i]}`, 0);
        }

        while (true) {
            const batch: Object = await this.store?.nextBatch(50);

            if ((batch as any).length === 0) {
                if (this.queue.size === 0 && this.queue.pending === 0) break;
                await new Promise(resolve => setTimeout(resolve, 200));
                continue;
            }
            for (const target of (batch as any)) {
                this.queue.add(() => this.processUrl(target));
            }
        }
        await this.queue.onIdle();
    }
}

const settings: SettingsType | null = loadSettings();
const filters: FiltersType | null = loadFilters();

const main: Main = new Main(
    settings,
    filters
);

main.init();
