"use strict";
import fs from "fs";
import YAML from "yaml";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { LRUCache } from "lru-cache/raw";

import robotsParser, { Robot } from "robots-parser";



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SETTINGSPATH = join(__dirname, "../../settings/settings.json");
const FILTERSPATH = join(__dirname, "../../settings/crawlerFilter.yaml");

export interface SettingsType {
    DATABASE_POOL: {
        host: string;
        user: string;
        password: string;
        database: string;
        connectionLimit: number;
    };
    PRIMARY_CHARSET: string;
    ALLOWED_DOMAINS: string;
    MAX_DEPTH: number;
    MAX_PAGES: number;
    CONCURRENCY: number;
    SEED_DOMAINS: string[];
    AQUIRE_DOMAIN_MS: number;
    FETCH_PAGE_ABORT_TIME: number;
    SAVE_TIME_INTERVALL: number;
    MIN_DOCS: number;
    MAX_RATIO: number;
    FRONTIER_FILE: string;
    PAGES_FILE: string;
    CONTENT_HASH_FILE: string;
    INDEXER_FILE: string;
    INDEXER_FILE_DOC: string;
    BODY_TITLE_WEIGHT_MULTIPLIER: number;
    TITLE_WEIGHT_MULTIPLIER: number;
    ANCHOR_WEIGHT_MULTIPLIER: number;
}

export interface FiltersType {
    url: {
        excludeAttributes: string[],
        excludeStopWords: string[],
        excludePathContains: string[],
        excludeExtensions: string[],
        excludeQueryParams: string[]
    },
    anchors: {
        minAnchorTextLength: number,
        excludeEmpty: boolean,
        excludeFragments: boolean
    }
}

// Singleton variables
let settingsInstance: SettingsType | null = null;
let filtersInstance: FiltersType | null = null;


export function loadSettings(): SettingsType | null {

    if (settingsInstance) {
        return settingsInstance;
    }

    try {
        const rawData = fs.readFileSync(SETTINGSPATH, 'utf-8');
        settingsInstance = JSON.parse(rawData) as SettingsType;
    } catch (error) {
        console.error("Error loading settings: ", error);
        settingsInstance = null;
    }

    return settingsInstance;
}

export function loadFilters(): FiltersType | null {
    if (filtersInstance) {
        return filtersInstance;
    }

    try {
        filtersInstance = YAML.parse(fs.readFileSync(FILTERSPATH, 'utf-8')) as FiltersType;
    } catch (error) {
        console.error("Could not load Filters: ", error);
        filtersInstance = null;
    }

    return filtersInstance;

}


const cache = new LRUCache<string, Robot>({
    max: 1000
});

export async function canCrawl(url: string, userAgent: string = "Crawler") {
    const { origin } = new URL(url);

    if (cache.has(origin)) {
        return cache.get(origin)?.isAllowed(url, userAgent);
    }

    try {
        const res = await fetch(`${origin}/robots.txt`, {
            headers: { "User-Agent": userAgent }
        });

        const text = res.ok ? await res.text() : "";
        const robots = robotsParser.default(`${origin}/robots.txt`, text);

        cache.set(origin, robots);
        return robots.isAllowed(url, userAgent);
    } catch (error) {
        console.error("[class]: Utils, could not execute method: canCrawl, error: ", error);
        throw error;
    }
}