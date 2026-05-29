"use strict";
import { loadSettings } from "./settings.mjs";
const settings = loadSettings();

const STOPWORDS = new Set(settings['excludeStopWords'] || []);
export function tokenize(text) {
    if (!text) return [];

    text = text
        .normalize("NFKC")
        .toLowerCase();

    const tokens = text.match(/\p{L}[\p{L}\p{N}_-]{2,}/gu) || [];
    const out = [];

    for (const t of tokens) {
        if (t.length < 3) continue;

        if (STOPWORDS.has(t)) continue;

        out.push(t);
    }

    return out;
}

export function filterTokens(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9åäö\s]/gi, " ")
        .split(/\s+/)
        .filter(t => t.length > 2)
        .filter(t => !STOPWORDS.has(t))
        .filter(t => !/^\d+$/.test(t));
}

/**
 * Plan to do these :)
 * @param {*} index 
 * @param {*} url 
 * @param {*} bodyText 
 * @param {*} titleText 
 * @param {*} anchors 
 * @param {*} docLength 
 */
export function addDocument(index, url, bodyText, titleText, anchors, docLength) {
    const bodyTokens = tokenize(bodyText).slice(0, 8000);
    const titleTokens = tokenize(titleText);

    docLength.set(url, bodyTokens.length);

    const localFreq = new Map();

    function addToken(token, field) {
        if (!localFreq.has(token)) {
            localFreq.set(token, { bodyWeight: 0, titleWeight: 0, anchorWeight: 0 });
        }
        const entry = localFreq.get(token);

        if (entry[field] !== undefined) {
            localFreq.get(token)[field] += 1;
        }
    }

    for (const token of bodyTokens) {
        addToken(token, "bodyWeight");
    }

    const uniqueTitleTokens = new Set(titleTokens);
    for (const token of uniqueTitleTokens) {
        addToken(token, "titleWeight");
    }

    const urlTokens = tokenize(
        url
            .replace(/^https?:\/\//, "")
            .replace(/[\/._-]/g, " ")
    );

    const uniqueUrlTokens = new Set(urlTokens);
    for (const token of uniqueUrlTokens) {
        addToken(token, "titleWeight"); // treat like title
    }


    if (anchors?.length) {
        const anchorTokenSet = new Set();
        for (const a of anchors) {
            const tokens = tokenize(a.text || "");
            for (const t of tokens) {
                anchorTokenSet.add(t);
            }
        }

        for (const token of anchorTokenSet) {
            addToken(token, "anchorWeight");
        }
    }

    for (const [token, freq] of localFreq.entries()) {
        if (!index.has(token)) {
            index.set(token, {
                df: 0,
                postings: new Map()
            });
        }
        const entry = index.get(token);

        if (!entry.postings.has(url)) {
            entry.df += 1;
        }
        entry.postings.set(url, freq);
    }
}