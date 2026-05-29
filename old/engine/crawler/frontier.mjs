"use strict";
import normalizeUrl from "normalize-url";
import { SeenStore } from "./seenStore.mjs";

export class Frontier {
    constructor(seenStore) {
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

            if(!isNew) return;

            await this.seenStore.addNewFrontier(normalized, search_depth);
        
        } catch {
            console.error(`Could not add ${url} to seen`);
        }
    }
}