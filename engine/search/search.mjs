"use strict";

import fs from "fs";
import readline from "readline";
import { tokenize } from "../indexer/tokenizer.mjs";

import { loadSettings, loadData } from "./loader.mjs";

export class Search {
    constructor(k1, b) {
        this.k1 = k1;
        this.b = b;

        this.loadConfig();
        this.initializeData();
    }

    bm25(query) {
        const tokens = tokenize(query);
        const scores = {};

        for (const token of tokens) {
            const entry = this.index[token];
            if (!entry) continue;

            const df = entry.df;
            const idf = Math.log(1 + (this.totalDocs - df + 0.5) / (df + 0.5));

            for (const [url, fields] of Object.entries(entry.postings)) {
                const tf =
                    (fields.bodyWeight || 0) +
                    (fields.titleWeight || 0) * 4 +
                    (fields.anchorWeight || 0) * 2;

                if (!tf) continue;

                const dl = this.docLength[url] || 1;

                const denom = tf + this.k1 * (1 - this.b + this.b * (dl / this.avgdl));
                const score = this.idfCache[token] * ((tf * (this.k1 + 1)) / denom);

                scores[url] = (scores[url] || 0) + score;
            }
        }

        return Object.entries(scores)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);
    }

    processQuery(query) {
        const results = this.bm25(query);

        console.log(results);

        return results;
    }

    loadConfig() {
        this.settings = loadSettings();
        this.INDEX_FILE = this.settings['INDEXER_FILE']
        this.DOC_FILE = this.settings['INDEXER_FILE_DOC'];
    }

    initializeData() {
        const data = loadData(this.INDEX_FILE, this.DOC_FILE, 'utf-8');
        this.index = data.index;
        this.docLength = data.docLengths;

        const lengths = Object.values(this.docLength);

        this.totalDocs = lengths.length;
        this.idfCache = this.buildIdfCache();

        this.avgdl = lengths.reduce((a, b) => a + b, 0) / this.totalDocs;

        console.log("Loaded index. Docs:", this.totalDocs, "AvgDL:", this.avgdl.toFixed(2));
    }

    buildIdfCache() {
        const idf = {};

        for (const term in this.index) {
            const df = this.index[term].df;
            idf[term] = Math.log(1 + (this.totalDocs - df + 0.5) / (df + 0.5));
        }
        return idf;
    }
}