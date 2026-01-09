"use strict";
import express from "express";

const router = express.Router();

router.get('/', (req, res) => {
    res.send("TV")
});


router.post('/new_playlist', async (req, res) => {
    let obj = req.body.data;
    console.log(obj);

    return obj
});


export default router;