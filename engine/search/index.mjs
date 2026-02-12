"use strict";
import { Search } from "./search.mjs";

import express from "express";
const app = express();

const search = new Search(1.5, 0.75);


app.get('/search', (req, res) => {
    search.processQuery(String(req.query.query));
});


app.listen(7676, () => {
    console.log("Search is online!");
})


