import express from "express";
import itemRoutes from "./routes/itemRoutes.ts";
import { errorHandler } from "./middlewares/errorHandler.ts";

const app = express();
app.use(express.json());

app.use('/api/items', itemRoutes);

app.use(errorHandler);

export default app;
