import express from "express";
import itemRoutes from "./routes/itemRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
const app = express();
app.use(express.json());
app.use('/api/items', itemRoutes);
app.use(errorHandler);
export default app;
//# sourceMappingURL=app.js.map