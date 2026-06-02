"use strict";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import fs from "fs";
import YAML from "yaml";
import { undoComment } from "undo-comments";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const SETTINGSPATH = join(__dirname, "../settings/settings.json");
const FILTERSPATH = join(__dirname, "../settings/crawlerFilter.yaml");
// Singleton variables
let settingsInstance = null;
let filtersInstance = null;
export function loadSettings() {
    if (settingsInstance) {
        return settingsInstance;
    }
    try {
        settingsInstance = undoComment(SETTINGSPATH, 'utf-8');
    }
    catch (error) {
        console.error("Error loading settings: ", error);
        settingsInstance = null;
    }
    return settingsInstance;
}
export function loadFilters() {
    if (filtersInstance) {
        return filtersInstance;
    }
    try {
        filtersInstance = YAML.parse(fs.readFileSync(FILTERSPATH, 'utf-8'));
    }
    catch (error) {
        console.error("Could not load Filters: ", error);
        filtersInstance = null;
    }
    return filtersInstance;
}
