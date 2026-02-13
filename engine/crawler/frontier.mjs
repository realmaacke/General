"use strict";
import normalizeUrl from "normalize-url";
import { SeenStore } from "./seenStore.mjs";

export class Frontier {
    constructor(seenStore) {
        this.domains = new Map();
        this.seenStore = seenStore;
    }

    async add(url, search_depth = 0, new_params = null, stripHashOn = true) {
        let params = [/^utm_\w+/i]

        if (new_params) {
            params = new_params;
        }

        try {
            const normalized = normalizeUrl(url, {
                stripHash: stripHashOn,
                queryParams: params
            });

            const isNew = await this.seenStore.addIfNew(normalized);
            console.log("ADD RESULT :", normalized, isNew);

            if(!isNew) return;

            const domain = new URL(normalized).hostname;

            if (!this.domains.has(domain)) {
                this.domains.set(domain, []);
            }

            this.domains.get(domain).push({ url: normalized, search_depth});
        } catch {
            console.error(`Could not add ${url} to seen`);
        }
    }

    next() {
        for (const [domain, queue] of this.domains) {
            if (queue.length > 0) {
                return queue.shift();
            }
        }
        return null;
    }

    size() {
        let total = 0;
        for (const value of this.domains.values()) {
            total += value.length;
        }
        return total;
    }
}