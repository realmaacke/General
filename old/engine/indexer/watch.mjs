"use strict";

import chokidar from "chokidar";
import { exec } from "node:child_process";
import { loadSettings } from "./settings.mjs";

const settings = loadSettings();
const PAGES_FILE = settings["PAGES_FILE"];

let running = false;
let pending = false;

function runIndexer() {

    if (running) {
        pending = true;
        return;
    }

    running = true;

    console.log("Change detected. Running indexer...");

    exec("node indexer/index.mjs", (err, stdout, stderr) => {

        if (stdout) console.log(stdout);
        if (stderr) console.error(stderr);

        running = false;

        if (pending) {
            pending = false;
            runIndexer();
        }
    });
}

chokidar.watch(PAGES_FILE, {
    ignoreInitial: true
}).on("change", () => {
    runIndexer();
});

console.log("Indexer watching:", PAGES_FILE);
