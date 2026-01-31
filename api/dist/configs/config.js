"use strict";
import dotenv from "dotenv";
dotenv.config();
const config = {
    port: Number(process.env.PORT) || 8086,
    nodeEnv: process.env.NODE_ENV || 'development',
};
export default config;
//# sourceMappingURL=config.js.map