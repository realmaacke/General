"use strict";
import { loadSettings } from "./settings.mjs";

import { buildIndex } from "./IndexManager.mjs";

const settings = loadSettings();

const PAGES_FILE = settings['PAGES_FILE'];
const OUTPUT_FILE = settings['INDEXER_FILE'];
const OUTPUT_FILE_DOC = settings['INDEXER_FILE_DOC'];

const MIN_DOCS = settings['MIN_DOCS'];
const MAX_RATIO = settings['MAX_RATIO'];

const index = new Map();

buildIndex(
    index,
    PAGES_FILE,
    OUTPUT_FILE,
    OUTPUT_FILE_DOC,
    MIN_DOCS,
    MAX_RATIO
);