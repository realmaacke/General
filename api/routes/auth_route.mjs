"use strict";
import express from "express";

import auth from "../src/auth.mjs";

const router = express.Router();

router.get('/', (req, res) => {
    res.send('All users');
});

router.post('/login', async (req, res) => {
    let user = {
        email: req.body.email ?? null,
        password: req.body.password ?? null,
    };

    let response = await auth.login(user);

    res.status(200).json(response);

});

router.post('/add_user', async (req, res) => {
    let user = {
        name: req.body.name ?? null,
        email: req.body.email ?? null,
        password: req.body.password ?? null,
        role: "user"
    };

    let response = await auth.register(user);

    if (!response.ok) {
        res.status(400).json(response);
    }
    res.status(200).json(response);
});


export default router;