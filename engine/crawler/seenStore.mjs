// SeenStore.mjs
import crypto from "crypto";
import mysql from "mysql2/promise";

import { loadSettings } from "./settings.mjs";

export class SeenStore {
    constructor() {
        const settings = loadSettings();

        this.pool = mysql.createPool({
            host: settings['DATABASE_POOL']['host'],
            user: settings['DATABASE_POOL']['user'],
            password: settings['DATABASE_POOL']['password'],
            database: settings['DATABASE_POOL']['database'],
            connectionLimit: settings['DATABASE_POOL']['connectionLimit'],
        });
    }

    hash(url) {
        return crypto.createHash("sha256").update(url).digest();
    }

    async removeOld() {
        try {
            const [result] = await this.pool.execute(
                `DELETE FROM crawler_seen_urls`
            );

            return result.affectedRows === 1;
        } catch (err) {
            console.error("Could not remove crawler_seen_urls from datbase");
            throw err;
        }
    }

    async addIfNew(url) {
        const hash = this.hash(url);

        try {
            const [result] = await this.pool.execute(
                `INSERT IGNORE INTO crawler_seen_urls (url_hash, url)
                 VALUES (?, ?)`,
                [hash, url]
            );

            // affectedRows === 1 → new URL
            // affectedRows === 0 → already exists
            return result.affectedRows === 1;

        } catch (err) {
            console.error("SeenStore insert failed:", err);
            throw err;
        }
    }
}
