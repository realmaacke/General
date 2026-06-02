"use strict";
import normalizeUrl from "normalize-url";
export class Frontier {
    store = null;
    constructor(store) {
        this.store = store;
    }
    /**
     *
     * @param url {String} - Url path to be added.
     * @param search_depth {Number} - Number of searches in.
     * @param new_params {RegEp[]|null} - if new apply those.
     * @param stripHashOn {boolean} - toggle for stipHash.
     * @returns {void} - Fix this
     */
    async add(url, search_depth = 0, new_params = null, stripHashOn = true) {
        let params = [/^utm_\w+/i];
        if (new_params) {
            params = new_params;
        }
        try {
            const normalized = normalizeUrl(url, {
                stripHash: stripHashOn,
                keepQueryParameters: params
            });
            const isNew = await this.store?.populateIfNew(Buffer.from(normalized));
            if (!isNew)
                return;
            await this.store?.populateFrontier(Buffer.from(normalized), search_depth);
        }
        catch (error) {
            console.error("[class] Frontier failed method: Add, error: ", error);
            throw error;
        }
    }
}
