import express from "express";
import cors from "cors";

import { errorHandler } from "./middlewares/errorHandler.js";

import dataRoutes from "./routes/dataRoutes.js";
import engineRoutes from "./routes/engineRoutes.js";
import infoRoutes from "./routes/infoRoutes.js";

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

app.use('/telemetry', infoRoutes);
app.use('/data', dataRoutes);
app.use('/engine', engineRoutes);

app.get('/', async (req, res) => {
    res.status(200).json({
        routes: [
		"/data/usage",
		"/engine (might take a few tries)",
		"/telemetry/server"
	]
    });
});


app.use(errorHandler);

export default app;
