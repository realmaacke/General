"use strict";
import fs from "fs";
import readline from "readline";

import { addDocument } from "./tokenizer.mjs";

export async function buildIndex(
    index,
    PAGES_FILE,
    OUTPUT_FILE,
    OUTPUT_FILE_DOC,
    MIN_DOCS,
    MAX_RATIO
) {
    
    if (!fs.existsSync(PAGES_FILE)) {
        console.error("pages.jsonl not found:", PAGES_FILE);
        return;
    }
    
    const stream = fs.createReadStream(PAGES_FILE);
    
    const rl = readline.createInterface({
        input: stream,
        crlfDelay: Infinity
    });
    
    let count = 0;
    let totalDocs = 0;
    const docLength = new Map();

    for await (const line of rl) {
        if (!line.trim()) continue;

        try {
            const doc = JSON.parse(line);

            if (!doc.url || !doc.text) continue;

            addDocument(index, doc.url, doc.text, doc.title || "", doc.anchors || [],  docLength);
            totalDocs++;
            count++;

            if (count % 100 === 0) {
                console.log("Indexed:", count);
            }

        } catch (err) {
            console.error("Failed to parse line:", err.message);
        }
    }

    console.log("Documents processed:", count);

    const avgdl = [...docLength.values()].reduce((a, b) => a+b, 0) / docLength.size;

    console.log("Average doc length:", avgdl);


    filterIndex(index, totalDocs, MIN_DOCS, MAX_RATIO);
    saveIndex(index, OUTPUT_FILE);
    saveDocLengths(docLength, OUTPUT_FILE_DOC);
}


export function saveIndex(index, OUTPUT_FILE) {
    const obj = {};

    for (const [term, data] of index.entries()) {
        obj[term] = {
            df: data.df,
            postings: Object.fromEntries(data.postings)
        };
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(obj));

    console.log("Index saved:", OUTPUT_FILE);
}

export function filterIndex(index, totalDocs, MIN_DOCS, MAX_RATIO) {
    for (const [term, data] of index.entries()) {
        const docFreq = data.df;
        const ratio = docFreq / totalDocs;

        if (docFreq < MIN_DOCS || ratio > MAX_RATIO) {
            index.delete(term);
        }
    }

    console.log("Index filtered. Reamining terms: ", index.size);
}

export function saveDocLengths(docLength, OUTPUT_FILE) {
    const obj = Object.fromEntries(docLength);

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(obj));

    console.log("Doc length has been saved: ", OUTPUT_FILE);
}