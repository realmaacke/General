"use strict";

import fs  from "fs";

export function loadData(INDEX_FILE, DOC_FILE, format = "utf-8") {
    let index = JSON.parse(fs.readFileSync(INDEX_FILE, format));
    let docLengths = JSON.parse(fs.readFileSync(DOC_FILE, format));

    return {index, docLengths};
}