"use strict";
import fs from "fs";
import path from "path";

import { loadSettings } from "./settings.mjs";
const settings = loadSettings();

const frontierFile = settings['FRONTIER_FILE'];
const pagesFile = settings['PAGES_FILE'];
const contentHashFile = settings['CONTENT_HASH_FILE'];

export function ensureFile(filePath, defaultContent = '') {
    const dir = path.dirname(filePath);

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {recursive: true });
    }

    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, defaultContent);
    }
}

export function saveFrontier(frontier) {
        fs.writeFileSync(frontierFile, JSON.stringify({ 
            domains: [...frontier.domains],
            seen: [...frontier.seen]
        }));
}

export function loadFrontier(frontier) {
    ensureFile(frontierFile, JSON.stringify({ domains: [], seen: [] }));

    if (!fs.existsSync(frontierFile)) return;

    const data = JSON.parse(fs.readFileSync(frontierFile, 'utf-8'));
    frontier.domains = new Map(data.domains);
    frontier.seen = new Set(data.seen);
}

export function loadContentHash(seenContent) {
    ensureFile(contentHashFile, "[]");

    if (!fs.existsSync(contentHashFile)) return;

    try {
        const raw = fs.readFileSync(contentHashFile, "utf-8");

        if (!raw ||!raw.trim()) {
            console.warn("Content hash file empty, starting fresh");
            return;
        }
        
        const data = JSON.parse(raw);
        for (const h of data) {
            seenContent.add(h);
        }
        console.log("Loaded content hashes:", seenContent.size);
    } catch (err) {
        console.error("Failed to load content hash: ", err.message);
    }

}

export function saveContentHash(content) {
    try {
        fs.writeFileSync(contentHashFile, JSON.stringify([...content]));
    } catch {
        console.error("Failed to save content hash, does the file exist?");
    }
}


ensureFile(pagesFile, "");
const stream = fs.createWriteStream(pagesFile, { flags: "a" });

export function savePage(data) {

    stream.write(JSON.stringify(data) + "\n");
}