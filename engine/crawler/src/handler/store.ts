"use strict";
import crypto from "crypto";
import mysql from "mysql2/promise";

import { SettingsType } from "../util.js";
import { sqlMapping } from "../sqlMaps.js";

export class Store {
    pool: mysql.Pool;


    constructor(settings: SettingsType) {
        this.pool = mysql.createPool(Object(settings.DATABASE_POOL));
        console.log(this.pool);
    }

    hash(url: Buffer<ArrayBuffer>): Buffer<ArrayBuffer> {
        return crypto.createHash("sha256").update(url).digest();
    }

    async isNotExistingHash(url: Buffer<ArrayBuffer>): Promise<Boolean> {
        const urlToHash: Buffer<ArrayBuffer> = this.hash(url);

        if (sqlMapping.checkHash.params) {
            throw new Error("[class] SqlMapping entry: isNotExistingHash, is faulty");
        }
        try {
            const [result] = await this.pool.execute<mysql.ResultSetHeader>(
                sqlMapping.checkHash.query, [urlToHash]
            );
            return result.affectedRows === 1;
        } catch (error) {
            console.error("[class] Store: isNotExistingHash, Failed: ", error);
            throw error;
        }
    }

    /**
     * Method that deletes entries from database.
     * @returns <Boolean>
     */
    async removePreviousEntries(): Promise<Boolean> {
        try {
            for (let i = 0; i < sqlMapping.previousEntries.query.length; i++) {
                let [res] = await this.pool.execute<mysql.ResultSetHeader>(
                    sqlMapping.previousEntries.query[i]
                );

                if (res.affectedRows === 0) {
                    return false
                }
            }
            return true
        } catch (error) {
            console.error("[class] Store: removePreviousEntries, could not execute: ", error);
            throw error;
        }
    }

    async populateIfNew(url: Buffer<ArrayBuffer>): Promise<Boolean> {
        const hash: Buffer<ArrayBuffer> = this.hash(url);
        const params = [hash, url];

        if (params.length !== sqlMapping.populateIfNew.params) {
            throw new Error("[class] sqlMapping, entry: populateIfNew is faulty");
        }

        try {
            const [result] = await this.pool.execute<mysql.ResultSetHeader>(
                sqlMapping.populateIfNew.query,
                params
            );
            return result.affectedRows === 1;
        } catch (error) {
            console.error("[class] Store: populateIfNew, could not execute: ", error);
            throw error;
        }
    }

    async populateFrontier(url: Buffer<ArrayBuffer>, search_depth: number): Promise<Boolean> {
        const hash: Buffer<ArrayBuffer> = this.hash(url);
        const params = [hash, url, search_depth];

        if (params.length !== sqlMapping.populateFrontier.params) {
            throw new Error("[class] sqlMapping, entry populateFrontier is faulty");
        }

        try {
            const [result] = await this.pool.execute<mysql.ResultSetHeader>(
                sqlMapping.populateFrontier.query,
                params
            );
            return result.affectedRows === 1;
        } catch (error) {
            console.error("[class] Store: populateFrontier, could not be executed: ", error);
            throw error;
        }
    },

    async nextBatch(limit: number = 50) {
        const connection: mysql.PoolConnection = await this.pool.getConnection();

        try {
            const rows = await this.getBatch(connection, limit);

            if (rows.length === 0) {
                await connection.commit();
                return [];
            }
            const allIds = rows.map(row => row.id);

            await this.updateRows(connection, allIds);
            await connection.commit();

            return rows;
        } catch (error) {
            await connection.rollback();
            console.error("[class] Store: nextBatch, failed to execute: ", error);
            throw error;
        } finally {
            connection.release();
        }
    }

    async getBatch(connection: mysql.PoolConnection, limit: number): Promise<object> {
        const params: number[] = [limit];
        try {
            const [rows] = await connection.query(
                sqlMapping.getBatch.query,
                params
            );

            return rows;
        } catch (error) {
            console.error("[class] Store: getBatch, failed to execute: ", error);
            throw error;
        }
    }
}