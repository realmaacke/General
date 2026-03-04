"use strict";
import fs from "fs";

const settingPath = "./settings.json";

export function loadSettings() {
    const rawData = fs.readFileSync(settingPath, "utf-8");
    const data = JSON.parse(rawData);

    return data;
}