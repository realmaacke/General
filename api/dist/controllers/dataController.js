"use strict";
import {} from "express";
import { items } from "../models/data.js";
import { execSync } from "node:child_process";
export const dataUsage = async (req, res, next) => {
    try {
        const output = execSync("cat ./usage.json", {
            encoding: "utf-8",
            stdio: ["ignore", "pipe", "pipe"],
        });
        let data = JSON.parse(output);
        res.status(200).json(data);
    }
    catch (err) {
        console.error('usage.sh failed', err.stderr || err.message);
        next({
            status: 500,
            message: "usage.sh failed",
            details: err.stderr || err.message
        });
    }
};
//# sourceMappingURL=dataController.js.map