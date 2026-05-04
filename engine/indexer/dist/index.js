"use strict";
import mysql from "mysql2/promise";
import { loadSettings, loadFilters } from "./utils.js";
import { addDocumentDB } from "./index-utils.js";
class Main {
    settings;
    filter;
    constructor(settings, filter) {
        if (!settings)
            throw new Error("Settings missing");
        if (!filter)
            throw new Error("Filter missing");
        this.settings = settings;
        this.filter = filter;
        this.run();
    }
    async run() {
        const pool = mysql.createPool(this.settings.DATABASE_POOL);
        while (true) {
            const [stateRows] = await pool.execute(`SELECT dirty FROM index_state WHERE id = 1`);
            const dirty = stateRows[0]?.dirty;
            if (!dirty) {
                await new Promise(r => setTimeout(r, 3000));
                continue;
            }
            console.log("Dirty flag detected, building index");
            await this.buildIndex(pool);
            await pool.execute(`UPDATE index_state SET dirty = 0, last_indexed = NOW() WHERE id = 1`);
        }
    }
    async buildIndex(pool) {
        const connection = await pool.getConnection();
        const stopWords = new Set(this.filter.url.excludeStopWords || []);
        let count = 0;
        const postingsBatch = [];
        const docLengths = [];
        const metaBatch = [];
        try {
            const [rows] = await connection.query(`
                SELECT url, title, text, anchors
                FROM crawled_sites
                WHERE text IS NOT NULL
            `);
            for (const doc of rows) {
                if (!doc.url || !doc.text)
                    continue;
                let anchors = [];
                try {
                    anchors = doc.anchors ? JSON.parse(doc.anchors) : [];
                }
                catch { }
                addDocumentDB(postingsBatch, docLengths, metaBatch, doc.url, doc.text, doc.title || "", anchors, stopWords);
                count++;
                if (count % 100 === 0) {
                    console.log("Indexed:", count);
                }
            }
            await connection.beginTransaction();
            await connection.query(`
                INSERT INTO doc_lengths (url, length)
                VALUES ?
                ON DUPLICATE KEY UPDATE length = VALUES(length)
            `, [docLengths]);
            // POSTINGS
            await connection.query(`
                INSERT INTO inverted_index_postings (term, doc_url, tf)
                VALUES ?
                ON DUPLICATE KEY UPDATE tf = VALUES(tf)
            `, [postingsBatch]);
            // DF rebuild
            await connection.query(`
                INSERT INTO inverted_index (term, df)
                SELECT term, COUNT(*)
                FROM inverted_index_postings
                GROUP BY term
                ON DUPLICATE KEY UPDATE df = VALUES(df)
            `);
            // META (THIS REPLACES FILE OUTPUT)
            await connection.query(`
                INSERT INTO document_meta (url, title, snippet)
                VALUES ?
                ON DUPLICATE KEY UPDATE
                    title = VALUES(title),
                    snippet = VALUES(snippet)
            `, [metaBatch]);
            await connection.commit();
        }
        catch (e) {
            await connection.rollback();
            throw e;
        }
        finally {
            connection.release();
            await pool.end();
        }
        console.log("Indexed docs:", count);
    }
}
const settings = loadSettings();
const filter = loadFilters();
new Main(settings, filter);
