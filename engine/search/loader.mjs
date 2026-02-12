"use strict";
import fs from "fs";

const settingPath = "./settings.json";

export function loadSettings() {
    const rawData = fs.readFileSync(settingPath, "utf-8");
    const data = JSON.parse(rawData);

    return data;
}

export function loadData(INDEX_FILE, DOC_FILE, format = "utf-8") {
    let index = JSON.parse(fs.readFileSync(INDEX_FILE, format));
    let docLengths = JSON.parse(fs.readFileSync(DOC_FILE, format));

    return { index, docLengths };
}