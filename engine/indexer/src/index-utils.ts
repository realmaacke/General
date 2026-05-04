"use strict";

export function tokenize(text: string, stopWords: Set<string>) {
    if (!text) return [];

    text = text.normalize("NFKC").toLowerCase();

    const tokens = text.match(/\p{L}[\p{L}\p{N}_-]{2,}/gu);
    if (!tokens) return [];

    const out: string[] = [];

    for (const t of tokens) {
        if (stopWords.has(t)) continue;
        out.push(t);
    }

    return out;
}

export function addDocumentDB(
    postingsBatch: any[],
    docLengths: any[],
    metaBatch: any[],
    url: string,
    bodyText: string,
    titleText: string,
    anchors: any[],
    stopWords: Set<string>
) {
    const bodyTokens = tokenize(bodyText, stopWords).slice(0, 8000);
    const titleTokens = tokenize(titleText, stopWords);

    docLengths.push([url, bodyTokens.length]);

    metaBatch.push([
        url,
        titleText || url,
        bodyText.slice(0, 200)
    ]);

    const freq = new Map<string, number>();

    for (const t of bodyTokens) {
        freq.set(t, (freq.get(t) || 0) + 1);
    }

    for (const t of new Set(titleTokens)) {
        freq.set(t, (freq.get(t) || 0) + 2);
    }

    if (anchors?.length) {
        const anchorTokens = new Set<string>();

        for (const a of anchors) {
            for (const t of tokenize(a.text || "", stopWords)) {
                anchorTokens.add(t);
            }
        }

        for (const t of anchorTokens) {
            freq.set(t, (freq.get(t) || 0) + 3);
        }
    }

    for (const [term, tf] of freq.entries()) {
        postingsBatch.push([term, url, tf]);
    }
}