"use strict";
import mysql from "mysql2/promise";

export type sqlMappingEntryMultiple = {
    query: string | string[],
    params: number | null
}

export type sqlMappingEntry = {
    query: string,
    params: number | null
}

export type sqlMappingType = {
    checkHash: sqlMappingEntry,
    previousEntries: sqlMappingEntryMultiple,
    populateIfNew: sqlMappingEntry,
    populateFrontier: sqlMappingEntry
    getBatch: sqlMappingEntry
}

export const sqlMapping: sqlMappingType = {
    "checkHash": {
        "query": `INSERT IGNORE INTO crawler_content_hash (hash) VALUES (?)`,
        "params": null
    },

    "previousEntries": {
        "query": [
            `DELETE FROM crawler_seen_urls`,
            `DELETE FROM crawler_frontier`,
            `DELETE FROM crawler_content_hash`
        ],
        "params": null
    },

    "populateIfNew": {
        query: `INSERT IGNORE INTO crawler_seen_urls (url_hash, url) VALUES (?, ?)`,
        params: 2
    },

    "populateFrontier": {
        query: `INSERT IGNORE INTO crawler_frontier (url_hash, url, search_depth) VALUES (?, ?, ?)`,
        params: 3
    },

    "getBatch": {
        query:
            `SELECT id, url, search_depth
            FROM crawler_frontier WHERE status = 'pending'
            ORDER BY id LIMIT ? FOR UPDATE SKIP LOCKED`,
        params: 1
    }
}