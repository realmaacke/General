"use strict";
import fs from "fs";
import YAML from "yaml";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { LRUCache } from "lru-cache/raw";
import * as robotsParserModule from "robots-parser";
const robotsParser = typeof robotsParserModule === "function"
    ? robotsParserModule
    : typeof robotsParserModule.default === "function"
        ? robotsParserModule.default
        : null;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const SETTINGSPATH = join(__dirname, "../../settings/settings.json");
const FILTERSPATH = join(__dirname, "../../settings/crawlerFilter.yaml");
// Singleton variables
let settingsInstance = null;
let filtersInstance = null;
export function loadSettings() {
    if (settingsInstance) {
        return settingsInstance;
    }
    try {
        const rawData = fs.readFileSync(SETTINGSPATH, 'utf-8');
        settingsInstance = JSON.parse(rawData);
    }
    catch (error) {
        console.error("Error loading settings: ", error);
        settingsInstance = null;
    }
    return settingsInstance;
}
export function loadFilters() {
    if (filtersInstance) {
        return filtersInstance;
    }
    try {
        filtersInstance = YAML.parse(fs.readFileSync(FILTERSPATH, 'utf-8'));
    }
    catch (error) {
        console.error("Could not load Filters: ", error);
        filtersInstance = null;
    }
    return filtersInstance;
}
const cache = new LRUCache({
    max: 1000
});
export async function canCrawl(url, userAgent = "Crawler") {
    const { origin } = new URL(url);
    if (cache.has(origin)) {
        return cache.get(origin)?.isAllowed(url, userAgent);
    }
    try {
        const res = await fetch(`${origin}/robots.txt`, {
            headers: { "User-Agent": userAgent }
        });
        const text = res.ok ? await res.text() : "";
        const robots = robotsParser(`${origin}/robots.txt`, text);
        cache.set(origin, robots);
        return robots.isAllowed(url, userAgent);
    }
    catch (error) {
        console.error("[class]: Utils, could not execute method: canCrawl, error: ", error);
        throw error;
    }
}
