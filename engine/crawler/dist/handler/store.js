"use strict";
import crypto from "crypto";
import mysql from "mysql2/promise";
import { sqlMapping } from "../sqlMaps.js";
export class Store {
    pool;
    constructor(settings) {
        this.pool = mysql.createPool(Object(settings.DATABASE_POOL));
        console.log(this.pool);
    }
    hash(url) {
        return crypto.createHash("sha256").update(url).digest();
    }
    async isNotExistingHash(url) {
        const urlToHash = this.hash(url);
        if (sqlMapping.checkHash.params) {
            throw new Error("[class] SqlMapping entry: isNotExistingHash, is faulty");
        }
        try {
            const [result] = await this.pool.execute(sqlMapping.checkHash.query, [urlToHash]);
            return result.affectedRows === 1;
        }
        catch (error) {
            console.error("[class] Store: isNotExistingHash, Failed: ", error);
            throw error;
        }
    }
    /**
     * Method that deletes entries from database.
     * @returns <Boolean>
     */
    async removePreviousEntries() {
        try {
            for (let i = 0; i < sqlMapping.previousEntries.query.length; i++) {
                let [res] = await this.pool.execute(sqlMapping.previousEntries.query[i]);
                if (res.affectedRows === 0) {
                    return false;
                }
            }
            return true;
        }
        catch (error) {
            console.error("[class] Store: removePreviousEntries, could not execute: ", error);
            throw error;
        }
    }
    async populateIfNew(url) {
        const hash = this.hash(url);
        const params = [hash, url];
        if (params.length !== sqlMapping.populateIfNew.params) {
            throw new Error("[class] sqlMapping, entry: populateIfNew is faulty");
        }
        try {
            const [result] = await this.pool.execute(sqlMapping.populateIfNew.query, params);
            return result.affectedRows === 1;
        }
        catch (error) {
            console.error("[class] Store: populateIfNew, could not execute: ", error);
            throw error;
        }
    }
    async populateFrontier(url, search_depth) {
        const hash = this.hash(url);
        const params = [hash, url, search_depth];
        if (params.length !== sqlMapping.populateFrontier.params) {
            throw new Error("[class] sqlMapping, entry populateFrontier is faulty");
        }
        try {
            const [result] = await this.pool.execute(sqlMapping.populateFrontier.query, params);
            return result.affectedRows === 1;
        }
        catch (error) {
            console.error("[class] Store: populateFrontier, could not be executed: ", error);
            throw error;
        }
    }
    async nextBatch(limit = 50) {
        const connection = await this.pool.getConnection();
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
        }
        catch (error) {
            await connection.rollback();
            console.error("[class] Store: nextBatch, failed to execute: ", error);
            throw error;
        }
        finally {
            connection.release();
        }
    }
    async getBatch(connection, limit) {
        const params = [limit];
        try {
            const [rows] = await connection.query(sqlMapping.getBatch.query, params);
            return rows;
        }
        catch (error) {
            console.error("[class] Store: getBatch, failed to execute: ", error);
            throw error;
        }
    }
    async updateRows(connection, allIds) {
        const params = allIds;
        try {
            const [rows] = await connection.query(sqlMapping.updateRows.query, params);
            return rows;
        }
        catch (error) {
            console.error("[class] Store: updateRows, failed to execute: ", error);
            throw error;
        }
    }
    async setStatus(id, status) {
        const params = [status, id];
        if (params.length !== sqlMapping.setStatus.params) {
            throw new Error("[class] sqlMapping, entry: setStatus params is faulty");
        }
        try {
            const [result] = await this.pool.execute(sqlMapping.setStatus.query, params);
            return result.affectedRows === 1;
        }
        catch (error) {
            console.error("[class] Store: setStatus, could not execute: ", error);
            throw error;
        }
    }
    async saveToDB(url, title, text, anchors, timestamp) {
        const params = [url, title, text, anchors, timestamp];
        if (params.length !== sqlMapping.saveToDB.params) {
            throw new Error("[class] sqlMapping, entry saveToDB: params are faulty");
        }
        try {
            const [result] = await this.pool.execute(sqlMapping.saveToDB.query, params);
            return result.affectedRows === 1;
        }
        catch (error) {
            console.error("[class] Store: saveToDB, could not execute: ", error);
            throw error;
        }
    }
}
