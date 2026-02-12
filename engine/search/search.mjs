"use strict";

import fs from "fs";
import readline from "readline";
import { tokenize } from "../indexer/tokenizer.mjs";

import { loadSettings, loadData, loadFile } from "./loader.mjs";

export class Search {
    constructor(k1, b) {
        this.k1 = k1;
        this.b = b;

        this.loadConfig();
        this.initializeData();
    }

    scoreDocument(token, fields, url, dl) {
        const idf = this.idfCache[token];

        const bodyTf = fields.bodyWeight || 0;
        const titleTf = fields.titleWeight || 0;
        const anchorTf = fields.anchorWeight || 0;

        let score = 0;

        const norm = (tf) =>
            (tf * (this.k1 + 1)) /
            (tf + this.k1 * (1 - this.b + this.b * (dl / this.avgdl)));


        if (bodyTf) score += idf * norm(bodyTf) * 0.4;
        if (titleTf) score += idf * norm(titleTf) * 12;
        if (anchorTf) score += idf * norm(anchorTf) * 3;

        if (url.includes(token)) score += idf * 2.5;

        return score;
    }



    bm25(query) {
        try {
            const tokens = tokenize(query);
            const scores = {};

            for (const token of tokens) {
                const entry = this.index[token];
                if (!entry) continue;

                for (const [url, fields] of Object.entries(entry.postings)) {
                    const dl = this.docLength[url] || 1;
                    const score = this.scoreDocument(token, fields, url, dl);

                    if (!score) continue;

                    scores[url] = (scores[url] || 0) + score;
                }
            }

            // 2) Structure + Navigational Signals
            const isNavigational = tokens.length === 1;

            for (const url of Object.keys(scores)) {
                const parsed = new URL(url);

                const pathDepth = parsed.pathname
                    .split("/")
                    .filter(Boolean).length;

                // shallow URL boost
                scores[url] += Math.max(0, 8 - pathDepth);

                // navigational intent
                if (isNavigational) {
                    if (url.includes(query)) {
                        scores[url] += 50;
                    }

                    // homepage bias
                    if (pathDepth === 0) {
                        scores[url] += 20;
                    }

                    // root-domain boost
                    const host = parsed.hostname;
                    if (host.split(".").length <= 2) {
                        scores[url] += 15;
                    }
                }
            }

            // 3) Coverage Boost (multi-term quality)
            for (const url of Object.keys(scores)) {
                const matchCount = tokens.filter(t =>
                    this.index[t]?.postings[url]
                ).length;

                const coverage = matchCount / tokens.length;
                scores[url] *= (1 + coverage);
            }

            // 4) Final ranking
            return Object.entries(scores)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10);

        } catch {
            console.error("BM25 Failed");
            return [];
        }
    }

    processQuery(query) {
        const results = this.bm25(query);

        return results.map(([url, score]) => {
            const meta = this.pageMeta[url] || {};

            return {
                url,
                score,
                title: meta.title || url,
                snippet: meta.snippet || ""
            };
        });
    }

    loadConfig() {
        this.settings = loadSettings();
        this.INDEX_FILE = this.settings['INDEXER_FILE']
        this.DOC_FILE = this.settings['INDEXER_FILE_DOC'];
    }

    initializeData() {
        const data = loadData(this.INDEX_FILE, this.DOC_FILE, 'utf-8');
        this.pageMeta = JSON.parse(
            fs.readFileSync(this.settings["INDEXER_FILE"].replace(".json", "_meta.json"), "utf-8")
        );

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