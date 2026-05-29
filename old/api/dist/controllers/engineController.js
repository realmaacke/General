"use strict";
import { raw } from "express";
import fs from "fs";
function readData(path) {
    try {
        let rawData = fs.readFileSync(path, "utf-8");
        return rawData;
    }
    catch {
        console.error("Could not load file: ", path, "reason: ");
    }
    return "";
}
export const engineIndex = async (req, res, next) => {
    let rawIndexedData = readData("./data/indexer.json");
    const indexData = JSON.parse(rawIndexedData);
    // let rawCrawlerData: string = readData("./data/pager.jsonl");
    // const crawlerData = JSON.parse(rawCrawlerData);
    res.status(200).json({
        msg: "You made it!",
        index: indexData,
        // crawler: crawlerData
    });
};
export const searchIndex = async (req, res, next) => {
    let query = String(req.query.query);
    console.log(query);
    try {
        let result = await fetch(`http://searcher:7777/search?query=${query}`);
        const data = await result.json();
        console.log(data);
        res.status(200).json({
            out: data.out,
            message: data.message
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Request failed",
            msg: error
        });
    }
};
//# sourceMappingURL=engineController.js.map