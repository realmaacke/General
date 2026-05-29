"use strict";
import robotsParser from "robots-parser";
import { LRUCache } from "lru-cache";

const cache = new LRUCache({
    max: 1000
});
/**
 * Function that checks if site contains robots.txt for crawling
 * @param {String} url - Url to crawl
 * @param {String} userAgent - Name for userAgent
 * @returns {Boolean} 
 */
export async function canCrawl(url, userAgent = "Crawler") {
    const { origin } = new URL(url);

    if (cache.has(origin)) {
        return cache.get(origin).isAllowed(url, userAgent);
    }

    try {
        const res = await fetch(`${origin}/robots.txt`, {
            headers: { "User-Agent": userAgent }
        });

        const text = res.ok ? await res.text() : "";
        const robots = robotsParser(`${origin}/robots.txt`, text);

        cache.set(origin, robots);
        return robots.isAllowed(url, userAgent);
    } catch {
        return true; // fail open, not closed
    }
}
