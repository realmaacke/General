"use strict";
import { loadSettings, SettingsType, loadFilters, FiltersType } from "./util.js";
import { Store } from "./handler/store.js";

class Main {
    settings: SettingsType | null;
    filters: FiltersType | null;

    store: Store | null = null;

    constructor(settings: SettingsType | null, filters: FiltersType | null) {
        this.settings = settings;
        this.filters = filters;

        if (!this.settings || !this.filters) {
            return;
        }

        this.store = new Store(this.settings);

    }
}

const settings: SettingsType | null = loadSettings();
const filters: FiltersType | null = loadFilters();

new Main(
    settings,
    filters
);