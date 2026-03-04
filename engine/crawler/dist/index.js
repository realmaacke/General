"use strict";
import { loadSettings, loadFilters } from "./util.js";
import { Store } from "./handler/store.js";
class Main {
    settings;
    filters;
    store = null;
    constructor(settings, filters) {
        this.settings = settings;
        this.filters = filters;
        if (!this.settings || !this.filters) {
            return;
        }
        this.store = new Store(this.settings);
    }
}
const settings = loadSettings();
const filters = loadFilters();
new Main(settings, filters);
