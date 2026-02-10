"use strict";
import fs from "fs";
import readline from "readline";
import { tokenize } from "../indexer/tokenizer.mjs";
import { loadSettings } from "./settings.mjs";

import { loadData } from "./loader.mjs";

const settings = loadSettings();

const INDEX_FILE = settings["INDEXER_FILE"];
const DOC_FILE   = settings["INDEXER_FILE_DOC"];

const k1 = 1.5;
const b  = 0.75;

let index;
let docLengths;
let avgdl;
let totalDocs;
let idfCache;

function initData() {
    const data  = loadData(INDEX_FILE, DOC_FILE, 'utf-8');
    index = data.index;
    docLengths = data.docLengths;
    
    const lengths = Object.values(docLengths);
    
    totalDocs = lengths.length;
    idfCache = buildIdfCache(index, totalDocs);

    avgdl = lengths.reduce((a,b)=>a+b,0) / totalDocs;

    console.log("Loaded index. Docs:", totalDocs, "AvgDL:", avgdl.toFixed(2));
}

function buildIdfCache(index, totalDocs) {
    const idf = {};

    for (const term in index) {
        const df = index[term].df;
        idf[term] = Math.log(1 + (totalDocs - df + 0.5) / (df + 0.5));
    } 

    return idf;
}

function bm25(query) {
    const tokens = tokenize(query);
    const scores = {};

    for (const token of tokens) {

        const entry = index[token];
        if (!entry) continue;

        const df = entry.df;
        const idf = Math.log(1 + (totalDocs - df + 0.5) / (df + 0.5));

        for (const [url, fields] of Object.entries(entry.postings)) {

            const tf =
                (fields.bodyWeight || 0) +
                (fields.titleWeight || 0) * 4 +
                (fields.anchorWeight || 0) * 2;
            
            if (!tf) {
                continue;
            }
            
            const dl = docLengths[url] || 1;

            const denom = tf + k1 * (1 - b + b * (dl / avgdl));
            const score = idfCache[token] * ((tf * (k1 + 1)) / denom); 

            scores[url] = (scores[url] || 0) + score;
        }
    }

    return Object.entries(scores)
        .sort((a,b)=>b[1]-a[1])
        .slice(0,10);
}

async function main() {
    initData();

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    console.log("Search ready. Type a query:");

    rl.on("line", (line)=>{
        const results = bm25(line);

        console.log("\nResults:");
        for (const [url, score] of results) {
            console.log(score.toFixed(3), url);
        }
        console.log("");
    });
}

main();
