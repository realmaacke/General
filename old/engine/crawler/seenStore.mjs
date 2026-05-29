// SeenStore.mjs
import crypto from "crypto";
import mysql from "mysql2/promise";

export class SeenStore {
    constructor(settings) {
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

    async isNewHash(url) {
        this.url_hash = this.hash(url);

        try {
            const [result] = await this.pool.execute(
                `INSERT IGNORE INTO crawler_content_hash (hash)
                 VALUES (?)`,
                 [this.url_hash]
            );

            return result.affectedRows === 1;
        } catch (err) {
            console.error("SeenStore isNewHash Failed: ", err);
            throw err;
        }
    }

    async removeOld() {
        try {
            const [result] = await this.pool.execute(
                `DELETE FROM crawler_seen_urls`
            );

            const [secondResult] = await this.pool.execute(
                `DELETE FROM crawler_frontier`
            );

            await this.pool.execute(
                `DELETE FROM crawler_content_hash`
            );

            if (result.affectedRows === 1 && secondResult.affectedRows === 1) {
                return true;
            }
            return false;
        } catch (err) {
            console.error("Could not remove crawler_seen_urls from database");
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

    async addNewFrontier(url, search_depth) {
        const url_hash = this.hash(url);
        try {
            const [result] = await this.pool.execute(
                `INSERT IGNORE INTO crawler_frontier (url_hash, url, search_depth)
                    VALUES (?, ?, ?)`,
                [url_hash, url, search_depth]
            );
            // True if does not exist
            return result.affectedRows === 1;

        } catch (err) {
            console.error("SeenStore failed to add to frontier", err);
            throw err;
        }
    }

    async nextbatch(limit = 50) {
        const conn = await this.pool.getConnection();

        try {
            const rows = await this.getBatch(conn, limit);

            if (rows.length === 0) {
                await conn.commit();
                return [];
            }

            const allIds = rows.map(row => row.id);

            await this.updateRows(conn, allIds);

            await conn.commit();
            return rows;
        } catch (err) {
            await conn.rollback();
            console.error("Catched error in nextBatch: ", err);
            throw err;
        } finally {
            conn.release();
        }
    }

    async getBatch(connection, limit) {
        try {
            const [rows] = await connection.query(
            `SELECT
                id,
                url,
                search_depth
             FROM crawler_frontier
             WHERE
                status = 'pending'
             ORDER BY id
             LIMIT ?
             FOR UPDATE SKIP LOCKED`,
            [limit]
            );

            return rows;
        } catch (err) {
            console.error("Could not get batch: ", err);
            throw err;
        }
    }

    async updateRows(connection, allIds) {
        try {
            await connection.query(
                `UPDATE crawler_frontier
                 SET status = 'processing'
                 WHERE id IN (?)`,
                 [allIds]
            );
        } catch (err) {
            console.error("Could not update Rows: ", err);
            throw err;
        }
    }

    async setStatus(id, status) {
        try {
            console.log("Setting id: " + id + " to done;")
            await this.pool.execute(
                `UPDATE crawler_frontier
                SET status = ?
                WHERE id = ?`,
                [status, id]
            );
        } catch (err) {
            console.error("Could not mark id:" + id + " as done");
            throw err;
        }
    }
}
