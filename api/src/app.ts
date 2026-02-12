import express from "express";
import itemRoutes from "./routes/itemRoutes.js";
import dataRoutes from "./routes/dataRoutes.js";
import engineRoutes from "./routes/engineRoutes.js";

import { errorHandler } from "./middlewares/errorHandler.js";
import cors from "cors";

import type { Request, Response, NextFunction } from "express";

const app = express();

app.use(cors({
    origin: [
        "https://petterssonhome.se",
        "https://www.petterssonhome.se"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.use('/data', dataRoutes);
app.use('/engine', engineRoutes);

app.get('/', async (req, res) => {
    res.status(200).json({
        routes: ["/data/usage", "/engine (might take a few tries)"]
    });
});


app.use(errorHandler);

export default app;
