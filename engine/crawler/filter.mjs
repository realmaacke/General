"use strict";
import crypto from "node:crypto";
import { loadContentHash } from "./store.mjs";


export const seenContent = new Set();
loadContentHash(seenContent);


export function isDuplicate(text) {
    if (!text) return true;

    const hash = crypto
        .createHash("sha256")
        .update(text)
        .digest("hex");

    if (seenContent.has(hash)) {
        return true;
    }

    seenContent.add(hash);
    return false;
}

export function grabMainContent(content) {
    let bestNode = null;
    let bestScore = 0;

    content("body *").each((_, element) => {
        const node = content(element);
        const text = node.text().trim();

        if (!text || text.length < 80) return;
    
        const linkText = node.find("a").text().length;
        const textLen = text.length;

        const density = textLen - linkText * 2;

        let bonus = 1;

        const tag = element.tagName?.toLowerCase();

        bonus += addBonus(tag, bonus);

        const score = density * bonus;

        if (score > bestScore) {
            bestScore = score;
            bestNode = node;
        }
    });

    if (bestNode) {
        return bestNode.text();
    }

    return content("body").text();
}

function addBonus(tag) {
    let bonus = 0;

    switch(tag) {
        case "article": bonus += 40;
        case "main": bonus +=  30;
        case "section": bonus += 10;
        case "div": bonus += 5;
    }

    return bonus;
}

export function grabHeadlines(content) {
    const candidates = [
        content("main").text(),
        content("article").text(),
        content("#content").text(),
        content("body").text(),
    ]

    for (const c of candidates) {
        if (c && c.trim().length > 100) {
            return c;
        }
    }

    return "";
}

export function sanitizeText(text) {
    return text
        .replace(/\s+/g, " ")
        .replace(/\u00a0/g, " ")
        .trim();
}

export function skipTypes(url) {
    const fileTypes = [".pdf", ".jpg", ".png", ".zip"];
    const endPaths = ["/login", "/account", "/privacy", "/terms", "/tos"];

    const lowerCase = url.toLowerCase();

    for (let i = 0; i < fileTypes.length; i++) {
        if (lowerCase.endsWith(fileTypes[i])) {
            return true;
        }
    }

    for (let j = 0; j < endPaths.length; j++) {
        if (lowerCase.includes(endPaths[j])) {
            return true;
        }
    }
    return false;
}