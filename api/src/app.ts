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
    ]
}));

app.use(express.json());

app.use('/data', dataRoutes);
app.use('/engine', engineRoutes);


app.use(errorHandler);

export default app;
