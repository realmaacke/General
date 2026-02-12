"use strict";
import { Search } from "./search.mjs";

import express from "express";
const app = express();

const search = new Search(1.5, 0.75);

app.get('/search', async (req, res) => {
    console.log("Searching for:", req.query.query);

    try {
        const data = search.processQuery(String(req.query.query));

        res.status(200).json({
            out: data,
            message: 'Search successful'
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            out: null,
            message: 'Could not search'
        });
    }
});



app.listen(7777, '0.0.0.0', () => {
    console.log("Search is online!");
})


