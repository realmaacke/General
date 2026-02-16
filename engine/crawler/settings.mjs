"use strict";
import fs from "fs";
import YAML from "yaml";

const settingPath = "./settings.json";
const crawlerFilter = "./crawlerFilter.yaml";

export function loadSettings() {
    const rawData = fs.readFileSync(settingPath, "utf-8");
    const data = JSON.parse(rawData);
    return data;

}

let cachedFilters = null;
export function loadFilters() {
    if (!cachedFilters) {
        cachedFilters = YAML.parse(
            fs.readFileSync(crawlerFilter, "utf-8")
        );
    }
    return cachedFilters;
}